import React, { JSX, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAnalyticsEvents, { AnalyticsEventRecord } from '../../network/useAnalyticsEvents';
import useAnalyticsErrorReporter from '../../network/useAnalyticsErrorReporter';
import { ANALYTICS_EVENT_TYPES, AnalyticsEventType } from '../../types/analytics';
import '../../styles/ServicePageStyles.css';

type EventTypeFilter = 'ALL' | AnalyticsEventType;
type SortDirection = 'asc' | 'desc';
type SortField = Exclude<keyof AnalyticsEventRecord, 'payload'>;
type ColumnKey = keyof AnalyticsEventRecord;

type SortFieldOption = {
  value: SortField;
  label: string;
};

type ColumnDefinition = {
  key: ColumnKey;
  label: string;
  sortable: boolean;
};

const sortFieldOptions: readonly SortFieldOption[] = [
  { value: 'timestamp', label: 'Timestamp' },
  { value: 'eventType', label: 'Event Type' },
  { value: 'sessionId', label: 'Session ID' },
  { value: 'currentUrl', label: 'URL' },
  { value: 'browser', label: 'Browser' },
  { value: 'operatingSystem', label: 'Operating System' },
  { value: 'ipAddress', label: 'IP Address' },
];

const columnDefinitions: readonly ColumnDefinition[] = [
  { key: 'timestamp', label: 'Timestamp', sortable: true },
  { key: 'eventType', label: 'Event Type', sortable: true },
  { key: 'id', label: 'ID', sortable: false },
  { key: 'sessionId', label: 'Session ID', sortable: true },
  { key: 'currentUrl', label: 'URL', sortable: true },
  { key: 'browser', label: 'Browser', sortable: true },
  { key: 'operatingSystem', label: 'Operating System', sortable: true },
  { key: 'ipAddress', label: 'IP Address', sortable: true },
  { key: 'payload', label: 'Payload', sortable: false },
];

const defaultVisibleColumns: Record<ColumnKey, boolean> = {
  id: false,
  eventType: true,
  currentUrl: true,
  browser: false,
  operatingSystem: false,
  sessionId: true,
  ipAddress: false,
  timestamp: true,
  payload: true,
};

function formatEventTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString();
}

function getComparableValue(event: AnalyticsEventRecord, field: SortField): string | number {
  if (field === 'timestamp') {
    return new Date(event.timestamp).getTime();
  }

  return event[field];
}

function renderEventCell(event: AnalyticsEventRecord, key: ColumnKey): JSX.Element {
  if (key === 'eventType') {
    return <span className="analytics-event-type-badge">{event.eventType}</span>;
  }

  if (key === 'timestamp') {
    return <>{formatEventTimestamp(event.timestamp)}</>;
  }

  if (key === 'payload') {
    return <>{JSON.stringify(event.payload)}</>;
  }

  return <>{String(event[key])}</>;
}

function AnalyticsDashboard(): JSX.Element {
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>('ALL');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleColumns, setVisibleColumns] =
    useState<Record<ColumnKey, boolean>>(defaultVisibleColumns);
  const { data: analyticsEvents = [], isLoading, isError, error } = useAnalyticsEvents();
  useAnalyticsErrorReporter(error, 'Failed to load analytics events');

  const filteredEvents = useMemo(() => {
    return analyticsEvents.filter((event) => {
      if (eventTypeFilter === 'ALL') {
        return true;
      }

      return event.eventType === eventTypeFilter;
    });
  }, [analyticsEvents, eventTypeFilter]);

  const sortedFilteredEvents = useMemo(() => {
    return [...filteredEvents].sort((left, right) => {
      const leftValue = getComparableValue(left, sortField);
      const rightValue = getComparableValue(right, sortField);
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return (leftValue - rightValue) * directionMultiplier;
      }

      return String(leftValue).localeCompare(String(rightValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      }) * directionMultiplier;
    });
  }, [filteredEvents, sortDirection, sortField]);

  const visibleColumnDefinitions = useMemo(
    () => columnDefinitions.filter((column) => visibleColumns[column.key]),
    [visibleColumns]
  );

  const visibleColumnCount = useMemo(
    () => Object.values(visibleColumns).filter(Boolean).length,
    [visibleColumns]
  );

  const uniqueSessions = useMemo(
    () => new Set(sortedFilteredEvents.map((event) => event.sessionId)).size,
    [sortedFilteredEvents]
  );

  const latestEventTimestamp =
    sortedFilteredEvents.length > 0 ? formatEventTimestamp(sortedFilteredEvents[0].timestamp) : 'N/A';

  const handleSortFieldChange = (value: SortField, toggleDirection = false): void => {
    if (toggleDirection && sortField === value) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(value);
  };

  const handleColumnToggle = (columnKey: ColumnKey): void => {
    setVisibleColumns((current) => {
      const isCurrentlyVisible = current[columnKey];
      if (isCurrentlyVisible && visibleColumnCount === 1) {
        return current;
      }

      return {
        ...current,
        [columnKey]: !isCurrentlyVisible,
      };
    });
  };

  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/parking" className="back-link" data-analytics-id="back-to-parking-home-analytics">
            ← Parking Home
          </Link>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Analytics Dashboard</h1>
        <p className="service-subtitle">
          Review client analytics activity and filter events by event type.
        </p>
      </header>
      <main className="service-container analytics-dashboard-container">
        <section className="service-details analytics-dashboard-section">
          <div className="analytics-controls-grid">
            <div className="analytics-control-group">
              <label htmlFor="analytics-event-type-filter">Filter by event type</label>
              <select
                id="analytics-event-type-filter"
                className="analytics-filter-select"
                value={eventTypeFilter}
                data-analytics-id="analytics-event-type-filter"
                onChange={(event) => setEventTypeFilter(event.target.value as EventTypeFilter)}
              >
                <option value="ALL">All event types</option>
                {ANALYTICS_EVENT_TYPES.map((eventType) => (
                  <option key={eventType} value={eventType}>
                    {eventType}
                  </option>
                ))}
              </select>
            </div>

            <div className="analytics-control-group">
              <label htmlFor="analytics-sort-field">Sort by</label>
              <select
                id="analytics-sort-field"
                className="analytics-filter-select"
                value={sortField}
                data-analytics-id="analytics-sort-field"
                onChange={(event) => handleSortFieldChange(event.target.value as SortField)}
              >
                {sortFieldOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="analytics-control-group">
              <label htmlFor="analytics-sort-direction">Sort direction</label>
              <select
                id="analytics-sort-direction"
                className="analytics-filter-select"
                value={sortDirection}
                data-analytics-id="analytics-sort-direction"
                onChange={(event) => setSortDirection(event.target.value as SortDirection)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="analytics-column-toggles">
            {columnDefinitions.map((column) => {
              if (column.key === "id") {
                return;
              }
              const isVisible = visibleColumns[column.key];
              const isOnlyVisibleColumn = isVisible && visibleColumnCount === 1;

              return (
                <label key={column.key} className="analytics-column-toggle">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    disabled={isOnlyVisibleColumn}
                    onChange={() => handleColumnToggle(column.key)}
                  />
                  {column.label}
                </label>
              );
            })}
          </div>

          <div className="analytics-summary-grid">
            <div>
              <span className="service-card-kicker">Total Events</span>
              <p>{analyticsEvents.length.toLocaleString()}</p>
            </div>
            <div>
              <span className="service-card-kicker">Filtered Events</span>
              <p>{sortedFilteredEvents.length.toLocaleString()}</p>
            </div>
            <div>
              <span className="service-card-kicker">Active Sessions</span>
              <p>{uniqueSessions.toLocaleString()}</p>
            </div>
            <div>
              <span className="service-card-kicker">Latest Event</span>
              <p>{latestEventTimestamp}</p>
            </div>
          </div>

          {isLoading && <p>Loading analytics events...</p>}

          {isError && (
            <p className="error">
              {error instanceof Error ? error.message : 'Failed to load analytics events.'}
            </p>
          )}

          {!isLoading && !isError && sortedFilteredEvents.length === 0 && (
            <p>No analytics events matched the selected event type.</p>
          )}

          {!isLoading && !isError && sortedFilteredEvents.length > 0 && (
            <div className="analytics-table-scroll">
              <table className="analytics-table">
                <thead>
                  <tr>
                    {visibleColumnDefinitions.map((column) => {
                      if (!column.sortable) {
                        return <th key={column.key}>{column.label}</th>;
                      }

                      const isActiveSortField = sortField === column.key;
                      const sortIndicator =
                        isActiveSortField ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '';

                      return (
                        <th key={column.key}>
                          <button
                            type="button"
                            className={`analytics-th-button${isActiveSortField ? ' is-active' : ''}`}
                            onClick={() => handleSortFieldChange(column.key as SortField, true)}
                          >
                            {column.label}
                            {sortIndicator}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedFilteredEvents.map((event) => (
                    <tr key={event.id}>
                      {visibleColumnDefinitions.map((column) => {
                        const cellClassName =
                          column.key === 'payload'
                            ? 'analytics-payload-cell'
                            : 'analytics-nowrap-cell';

                        return (
                          <td key={`${event.id}-${column.key}`} className={cellClassName}>
                            {renderEventCell(event, column.key)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <footer>
        <p>&copy; 2026 Isaac - Parking App Demo.</p>
      </footer>
    </>
  );
}

export default AnalyticsDashboard;
