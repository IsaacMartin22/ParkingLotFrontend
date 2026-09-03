import React, { ChangeEvent, JSX, MouseEvent as ReactMouseEvent, useMemo, useState } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import useAnalyticsEvents from '../network/useAnalyticsEvents';
import useRecentChatbotInteractions from '../network/useRecentChatbotInteractions';
import { ANALYTICS_EVENT_TYPES, AnalyticsQuery, AnalyticsQueryField, AnalyticsQuerySortDirection } from '../types/analytics';
import '../styles/Interactions.css';

const defaultAnalyticsQuery: AnalyticsQuery = {
  filters: [{ field: 'eventType', operator: 'eq', value: 'PAGE_VIEW' }],
  sortField: 'timestamp',
  sortDirection: 'desc',
  page: 1,
};

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleString();
}

function Interactions(): JSX.Element {
  const [activeTable, setActiveTable] = useState<'analytics' | 'chatbot'>('analytics');
  const [analyticsColumnWidths, setAnalyticsColumnWidths] = useState<number[]>([14, 14, 18, 14, 14, 14, 12]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('PAGE_VIEW');
  const [sessionFilter, setSessionFilter] = useState<string>('');
  const [analyticsQuery, setAnalyticsQuery] = useState<AnalyticsQuery>(defaultAnalyticsQuery);
  const [visibleAnalyticsColumns, setVisibleAnalyticsColumns] = useState({
    eventType: true,
    sessionId: true,
    currentUrl: true,
    browser: false,
    operatingSystem: false,
    ipAddress: false,
    timestamp: true,
  });

  const handleAnalyticsColumnResizeMouseDown = (
    event: ReactMouseEvent<HTMLDivElement>,
    columnIndex: number
  ): void => {
    event.preventDefault();
    const table = event.currentTarget.closest('table');
    if (!table) {
      return;
    }

    const tableRect = table.getBoundingClientRect();
    const startX = event.clientX;
    const startWidths = [...analyticsColumnWidths];

    const handleMouseMove = (moveEvent: MouseEvent): void => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / tableRect.width) * 100;
      const leftWidth = startWidths[columnIndex] + deltaPercent;
      const rightWidth = startWidths[columnIndex + 1] - deltaPercent;
      const minWidth = 8;

      if (leftWidth < minWidth || rightWidth < minWidth) {
        return;
      }

      const nextWidths = [...startWidths];
      nextWidths[columnIndex] = leftWidth;
      nextWidths[columnIndex + 1] = rightWidth;
      setAnalyticsColumnWidths(nextWidths);
    };

    const handleMouseUp = (): void => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const {
    data: analyticsEvents,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useAnalyticsEvents({ query: analyticsQuery });

  const analyticsTotalPages = analyticsEvents?.totalPages ?? 1;

  const analyticsSortArrow = (field: AnalyticsQueryField): string => {
    if (analyticsQuery.sortField !== field) {
      return '';
    }
    return analyticsQuery.sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const applyAnalyticsFilters = (): void => {
    const filters = [];
    if (eventTypeFilter !== 'ALL') {
      filters.push({
        field: 'eventType' as const,
        operator: 'eq' as const,
        value: eventTypeFilter,
      });
    }
    if (sessionFilter.trim()) {
      filters.push({
        field: 'sessionId' as const,
        operator: 'has' as const,
        value: sessionFilter.trim(),
      });
    }

    setAnalyticsQuery((prevQuery) => ({
      ...prevQuery,
      filters,
      page: 1,
    }));
  };

  const resetAnalyticsFilters = (): void => {
    setEventTypeFilter('PAGE_VIEW');
    setSessionFilter('');
    setAnalyticsQuery(defaultAnalyticsQuery);
  };

  const handleSortChange = (field: AnalyticsQueryField): void => {
    setAnalyticsQuery((prevQuery) => {
      const nextDirection: AnalyticsQuerySortDirection =
        prevQuery.sortField === field && prevQuery.sortDirection === 'asc' ? 'desc' : 'asc';
      return {
        ...prevQuery,
        sortField: field,
        sortDirection: nextDirection,
        page: 1,
      };
    });
  };

  const goToPreviousAnalyticsPage = (): void => {
    setAnalyticsQuery((prevQuery) => ({
      ...prevQuery,
      page: Math.max(1, prevQuery.page - 1),
    }));
  };

  const goToNextAnalyticsPage = (): void => {
    setAnalyticsQuery((prevQuery) => ({
      ...prevQuery,
      page: Math.min(analyticsTotalPages, prevQuery.page + 1),
    }));
  };

  const analyticsPaginationControls = (
    <>
      <button type="button" onClick={goToPreviousAnalyticsPage} disabled={analyticsQuery.page <= 1}>
        Previous
      </button>
      <button
        type="button"
        onClick={goToNextAnalyticsPage}
        disabled={analyticsQuery.page >= analyticsTotalPages}
      >
        Next
      </button>
    </>
  );

  const analyticsSummary = useMemo(() => {
    if (!analyticsEvents) {
      return 'No analytics loaded.';
    }
    return `Showing page ${analyticsQuery.page} of ${analyticsEvents.totalPages} (${analyticsEvents.totalCount} total events)`;
  }, [analyticsEvents, analyticsQuery.page]);

  const analyticsColumns = useMemo(
    () => [
      { key: 'eventType', label: 'Event', sortField: 'eventType' as AnalyticsQueryField },
      { key: 'sessionId', label: 'Session', sortField: 'sessionId' as AnalyticsQueryField },
      { key: 'currentUrl', label: 'URL', sortField: 'currentUrl' as AnalyticsQueryField },
      { key: 'browser', label: 'Browser', sortField: 'browser' as AnalyticsQueryField },
      { key: 'operatingSystem', label: 'OS', sortField: 'operatingSystem' as AnalyticsQueryField },
      { key: 'ipAddress', label: 'IP', sortField: 'ipAddress' as AnalyticsQueryField },
      { key: 'timestamp', label: 'Timestamp', sortField: 'timestamp' as AnalyticsQueryField },
    ],
    []
  );

  const activeAnalyticsColumns = analyticsColumns.filter(
    (column) => visibleAnalyticsColumns[column.key as keyof typeof visibleAnalyticsColumns]
  );

  const activeColumnCount = activeAnalyticsColumns.length;

  const handleAnalyticsColumnToggle = (columnKey: keyof typeof visibleAnalyticsColumns): void => {
    setVisibleAnalyticsColumns((prevColumns) => {
      const enabledCount = Object.values(prevColumns).filter(Boolean).length;
      if (prevColumns[columnKey] && enabledCount === 1) {
        return prevColumns;
      }
      return {
        ...prevColumns,
        [columnKey]: !prevColumns[columnKey],
      };
    });
  };

  const {
    data: recentChatbotInteractions,
    isLoading: chatbotInteractionsLoading,
    isError: chatbotInteractionsError,
  } = useRecentChatbotInteractions();

  return (
    <div className="intro-home interactions-page">
      <TopNav />
      <section className="intro-header-bar" aria-label="Interactions page header" />
      <main className="container intro-main">
        <div className="interactions-tabs" role="tablist" aria-label="Interaction tables">
          <button
            type="button"
            role="tab"
            aria-selected={activeTable === 'analytics'}
            className={`interactions-tab ${activeTable === 'analytics' ? 'is-active' : ''}`}
            onClick={() => setActiveTable('analytics')}
          >
            Analytics
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTable === 'chatbot'}
            className={`interactions-tab ${activeTable === 'chatbot' ? 'is-active' : ''}`}
            onClick={() => setActiveTable('chatbot')}
          >
            Chatbot Interactions
          </button>
        </div>
        <div className="interactions-content">
          {activeTable === 'analytics' && (
            <section className="interactions-table-card interactions-panel" aria-labelledby="analytics-table-heading">
            <h1 id="analytics-table-heading">Analytics</h1>
            <div className="analytics-controls">
              <label htmlFor="analytics-event-filter">
                Event Type
                <select
                  id="analytics-event-filter"
                  value={eventTypeFilter}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => setEventTypeFilter(event.target.value)}
                >
                  <option value="ALL">All events</option>
                  {ANALYTICS_EVENT_TYPES.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {eventType}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="analytics-session-filter">
                Session Contains
                <input
                  id="analytics-session-filter"
                  type="text"
                  value={sessionFilter}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setSessionFilter(event.target.value)}
                />
              </label>
              <button type="button" onClick={applyAnalyticsFilters}>
                Apply Filters
              </button>
              <button type="button" onClick={resetAnalyticsFilters}>
                Reset
              </button>
            </div>
            <div className="analytics-column-toggles" role="group" aria-label="Toggle analytics columns">
              {analyticsColumns.map((column) => (
                <label key={column.key} htmlFor={`analytics-column-${column.key}`}>
                  <input
                    id={`analytics-column-${column.key}`}
                    type="checkbox"
                    checked={visibleAnalyticsColumns[column.key as keyof typeof visibleAnalyticsColumns]}
                    onChange={() =>
                      handleAnalyticsColumnToggle(column.key as keyof typeof visibleAnalyticsColumns)
                    }
                  />
                  {column.label}
                </label>
              ))}
            </div>
            <div className="analytics-pagination analytics-pagination-top">
              <span>{analyticsSummary}</span>
              <div className="analytics-pagination-buttons">{analyticsPaginationControls}</div>
            </div>
            <table className="interactions-table interactions-table-analytics">
              <colgroup>
                {activeAnalyticsColumns.map((column, index) => (
                  <col key={column.key} style={{ width: `${analyticsColumnWidths[index]}%` }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {activeAnalyticsColumns.map((column, index) => (
                    <th key={column.key} scope="col">
                      <div className="analytics-header-cell">
                        <button
                          type="button"
                          className="analytics-sort-button"
                          onClick={() => handleSortChange(column.sortField)}
                        >
                          {column.label}
                          {analyticsSortArrow(column.sortField)}
                        </button>
                        {index < activeAnalyticsColumns.length - 1 && (
                          <div
                            className="analytics-column-divider"
                            role="separator"
                            aria-orientation="vertical"
                            aria-label={`Resize ${column.label} and ${activeAnalyticsColumns[index + 1].label} columns`}
                            onMouseDown={(event) => handleAnalyticsColumnResizeMouseDown(event, index)}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analyticsLoading && (
                  <tr>
                    <td colSpan={activeColumnCount}>Loading analytics events...</td>
                  </tr>
                )}
                {analyticsError && (
                  <tr>
                    <td colSpan={activeColumnCount}>Failed to load analytics events.</td>
                  </tr>
                )}
                {!analyticsLoading && !analyticsError && analyticsEvents?.results.length === 0 && (
                  <tr>
                    <td colSpan={activeColumnCount}>No analytics events available.</td>
                  </tr>
                )}
                {!analyticsLoading &&
                  !analyticsError &&
                  analyticsEvents?.results.map((event) => (
                    <tr key={event.id}>
                      {visibleAnalyticsColumns.eventType && <td>{event.eventType}</td>}
                      {visibleAnalyticsColumns.sessionId && <td>{event.sessionId}</td>}
                      {visibleAnalyticsColumns.currentUrl && <td>{event.currentUrl}</td>}
                      {visibleAnalyticsColumns.browser && <td>{event.browser}</td>}
                      {visibleAnalyticsColumns.operatingSystem && <td>{event.operatingSystem}</td>}
                      {visibleAnalyticsColumns.ipAddress && <td>{event.ipAddress}</td>}
                      {visibleAnalyticsColumns.timestamp && <td>{formatTimestamp(event.timestamp)}</td>}
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="analytics-pagination">
              <span>{analyticsSummary}</span>
              <div className="analytics-pagination-buttons">{analyticsPaginationControls}</div>
            </div>
            </section>
          )}

          {activeTable === 'chatbot' && (
            <section className="interactions-table-card interactions-panel" aria-labelledby="chatbot-table-heading">
            <h1 id="chatbot-table-heading">Chatbot Interactions</h1>
            <table className="interactions-table">
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">User Message</th>
                  <th scope="col">Assistant Response</th>
                </tr>
              </thead>
              <tbody>
                {chatbotInteractionsLoading && (
                  <tr>
                    <td colSpan={3}>Loading chatbot interactions...</td>
                  </tr>
                )}
                {chatbotInteractionsError && (
                  <tr>
                    <td colSpan={3}>Failed to load chatbot interactions.</td>
                  </tr>
                )}
                {!chatbotInteractionsLoading &&
                  !chatbotInteractionsError &&
                  recentChatbotInteractions?.interactions.length === 0 && (
                    <tr>
                      <td colSpan={3}>No chatbot interactions available.</td>
                    </tr>
                  )}
                {!chatbotInteractionsLoading &&
                  !chatbotInteractionsError &&
                  recentChatbotInteractions?.interactions.map((interaction, index) => (
                    <tr key={`${interaction.timestamp}-${index}`}>
                      <td>{formatTimestamp(interaction.timestamp)}</td>
                      <td>{interaction.question}</td>
                      <td>{interaction.response}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            </section>
          )}
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}

export default Interactions;
