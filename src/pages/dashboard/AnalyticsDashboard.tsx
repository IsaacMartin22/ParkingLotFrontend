import React, { JSX, useEffect, useMemo, useState } from 'react';
import AppFooter from '../../components/AppFooter';
import ServiceHeader from '../../components/ServiceHeader';
import useAnalyticsEvents, {
  ANALYTICS_EVENTS_PAGE_SIZE,
} from '../../network/useAnalyticsEvents';
import useAnalyticsErrorReporter from '../../network/useAnalyticsErrorReporter';
import {
  AnalyticsEventRecord,
  AnalyticsQuery,
  AnalyticsQueryField,
  AnalyticsQueryFilter,
  AnalyticsQueryFilterOperator,
} from '../../types/analytics';
import '../../styles/ServicePageStyles.css';

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

type FilterFieldOption = {
  value: AnalyticsQueryField;
  label: string;
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

const MAX_ANALYTICS_FILTERS = 10;

const filterFieldOptions: readonly FilterFieldOption[] = [
  { value: 'eventType', label: 'Event Type' },
  { value: 'currentUrl', label: 'URL' },
  { value: 'browser', label: 'Browser' },
  { value: 'operatingSystem', label: 'Operating System' },
  { value: 'sessionId', label: 'Session ID' },
  { value: 'ipAddress', label: 'IP Address' },
  { value: 'timestamp', label: 'Timestamp' },
];

const filterOperatorLabels: Record<AnalyticsQueryFilterOperator, string> = {
  eq: 'Equals',
  neq: 'Does not equal',
  has: 'Contains',
  lt: 'Less than',
  lte: 'Less than or equal',
  gt: 'Greater than',
  gte: 'Greater than or equal',
};

const allowedOperatorsByField: Record<AnalyticsQueryField, readonly AnalyticsQueryFilterOperator[]> = {
  eventType: ['eq', 'neq'],
  currentUrl: ['eq', 'neq', 'has'],
  browser: ['eq', 'neq', 'has'],
  operatingSystem: ['eq', 'neq', 'has'],
  sessionId: ['eq', 'neq', 'has'],
  ipAddress: ['eq', 'neq', 'has'],
  timestamp: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
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

function getAllowedOperators(field: AnalyticsQueryField): readonly AnalyticsQueryFilterOperator[] {
  return allowedOperatorsByField[field];
}

function createAnalyticsFilter(field: AnalyticsQueryField = 'eventType'): AnalyticsQueryFilter {
  return {
    field,
    operator: getAllowedOperators(field)[0],
    value: '',
  };
}

function isCompleteAnalyticsFilter(filter: AnalyticsQueryFilter): boolean {
  return filter.value.trim().length > 0;
}

function AnalyticsDashboard(): JSX.Element {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [filters, setFilters] = useState<AnalyticsQueryFilter[]>([]);
  const [visibleColumns, setVisibleColumns] =
    useState<Record<ColumnKey, boolean>>(defaultVisibleColumns);
  const activeFilters = useMemo(
    () =>
      filters
        .map((filter) => ({
          ...filter,
          value: filter.value.trim(),
        }))
        .filter(isCompleteAnalyticsFilter),
    [filters]
  );
  const analyticsQuery = useMemo<AnalyticsQuery>(() => {
    return {
      filters: activeFilters,
      sortField,
      sortDirection,
      page,
    };
  }, [activeFilters, page, sortDirection, sortField]);

  const {
    data: analyticsEventsResponse = { results: [], totalPages: 0, totalCount: 0, pageSize: 1000 },
    isLoading,
    isError,
    error,
  } = useAnalyticsEvents({ query: analyticsQuery });
  useAnalyticsErrorReporter(error, 'Failed to load analytics events');

  const activeFilterCount = useMemo(
    () => activeFilters.length,
    [activeFilters]
  );

  const sortedFilteredEvents = useMemo(() => {
    return [...analyticsEventsResponse.results].sort((left, right) => {
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
  }, [analyticsEventsResponse.results, sortDirection, sortField]);

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

  const hasNextPage = analyticsEventsResponse.results.length === ANALYTICS_EVENTS_PAGE_SIZE;
  const canGoToPreviousPage = page > 1;

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const handleSortFieldChange = (value: SortField, toggleDirection = false): void => {
    if (toggleDirection && sortField === value) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      setPage(1);
      return;
    }

    setSortField(value);
    setPage(1);
  };

  const handleFilterFieldChange = (index: number, field: AnalyticsQueryField): void => {
    setFilters((current) =>
      current.map((filter, filterIndex) => {
        if (filterIndex !== index) {
          return filter;
        }

        const allowedOperators = getAllowedOperators(field);

        return {
          field,
          operator: allowedOperators.includes(filter.operator) ? filter.operator : allowedOperators[0],
          value: filter.value,
        };
      })
    );
    setPage(1);
  };

  const handleFilterOperatorChange = (index: number, operator: AnalyticsQueryFilterOperator): void => {
    setFilters((current) =>
      current.map((filter, filterIndex) => (filterIndex === index ? { ...filter, operator } : filter))
    );
    setPage(1);
  };

  const handleFilterValueChange = (index: number, value: string): void => {
    setFilters((current) =>
      current.map((filter, filterIndex) => (filterIndex === index ? { ...filter, value } : filter))
    );
    setPage(1);
  };

  const handleAddFilter = (): void => {
    setFilters((current) => {
      if (current.length >= MAX_ANALYTICS_FILTERS) {
        return current;
      }

      return [...current, createAnalyticsFilter()];
    });
    setPage(1);
  };

  const handleRemoveFilter = (index: number): void => {
    setFilters((current) => current.filter((_, filterIndex) => filterIndex !== index));
    setPage(1);
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

  const handlePageInputCommit = (): void => {
    const parsedPage = Number.parseInt(pageInput, 10);

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
      setPageInput(String(page));
      return;
    }

    setPage(parsedPage);
    setPageInput(String(parsedPage));
  };

  return (
    <>
      <ServiceHeader
        backAnalyticsId="back-to-dashboards-analytics"
        title="Analytics Dashboard"
        subtitle="Review client analytics activity and filter events by field."
      />
      <main className="service-container analytics-dashboard-container">
        <section className="service-details analytics-dashboard-section">
          <div className="analytics-query-controls">
            <div className="analytics-controls-grid analytics-sort-controls">
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
                  onChange={(event) => {
                    setSortDirection(event.target.value as SortDirection);
                    setPage(1);
                  }}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              <div className="analytics-query-actions">
                <button
                  type="button"
                  className="analytics-page-button"
                  data-analytics-id="analytics-add-filter"
                  disabled={filters.length >= MAX_ANALYTICS_FILTERS || isLoading}
                  onClick={handleAddFilter}
                >
                  Add filter
                </button>
              </div>
            </div>

            <div className="analytics-filter-stack">
              {(
                <div className="analytics-filter-list">
                  {filters.length > 0 && (
                    <div className="analytics-filter-row analytics-filter-row-header">
                      <div>Field</div>
                      <div>Operator</div>
                      <div>Value</div>
                      <div />
                    </div>
                  )}

                  {filters.map((filter, index) => {
                    const allowedOperators = getAllowedOperators(filter.field);

                    return (
                      <div key={`${filter.field}-${index}`} className="analytics-filter-row">
                        <select
                          id={`analytics-filter-field-${index}`}
                          className="analytics-filter-select"
                          value={filter.field}
                          onChange={(event) =>
                            handleFilterFieldChange(index, event.target.value as AnalyticsQueryField)
                          }
                        >
                          {filterFieldOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <select
                          id={`analytics-filter-operator-${index}`}
                          className="analytics-filter-select"
                          value={filter.operator}
                          onChange={(event) =>
                            handleFilterOperatorChange(
                              index,
                              event.target.value as AnalyticsQueryFilterOperator
                            )
                          }
                        >
                          {allowedOperators.map((operator) => (
                            <option key={operator} value={operator}>
                              {filterOperatorLabels[operator]}
                            </option>
                          ))}
                        </select>

                        <input
                          id={`analytics-filter-value-${index}`}
                          type="text"
                          className="analytics-filter-input"
                          value={filter.value}
                          onChange={(event) => handleFilterValueChange(index, event.target.value)}
                        />

                        <button
                          type="button"
                          className="analytics-filter-remove-button"
                          data-analytics-id={`analytics-remove-filter-${index}`}
                          onClick={() => handleRemoveFilter(index)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="analytics-column-toggles">
            {columnDefinitions.map((column) => {
              if (column.key === 'id') {
                return null;
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
              <span className="service-card-kicker">Events on Page</span>
              <p>{analyticsEventsResponse.results.length.toLocaleString()}</p>
            </div>
            <div>
              <span className="service-card-kicker">Total Results</span>
              <p>{analyticsEventsResponse.totalCount}</p>
            </div>
            <div>
              <span className="service-card-kicker">Unique Sessions</span>
              <p>{uniqueSessions.toLocaleString()}</p>
            </div>
            <div>
              <span className="service-card-kicker">Latest Event</span>
              <p>{latestEventTimestamp}</p>
            </div>
          </div>

          <div className="analytics-pagination-controls">
            <div className="analytics-pagination-buttons">
              <button
                type="button"
                className="analytics-page-button"
                data-analytics-id="analytics-page-previous"
                disabled={isLoading || !canGoToPreviousPage}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </button>
              <input
                id="analytics-set-page"
                type="number"
                min={1}
                step={1}
                className="analytics-page-input"
                data-analytics-id="analytics-set-page"
                disabled={isLoading || (!canGoToPreviousPage && !hasNextPage)}
                value={pageInput}
                onChange={(event) => setPageInput(event.target.value)}
                onBlur={handlePageInputCommit}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handlePageInputCommit();
                  }
                }}
              />
              <button
                type="button"
                className="analytics-page-button"
                data-analytics-id="analytics-page-next"
                disabled={isLoading || !hasNextPage}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
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
      <AppFooter />
    </>
  );
}

export default AnalyticsDashboard;
