import React, { JSX } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import useAnalyticsEvents, { ANALYTICS_EVENTS_PAGE_SIZE } from '../network/useAnalyticsEvents';
import useRecentChatbotInteractions from '../network/useRecentChatbotInteractions';
import { AnalyticsQuery } from '../types/analytics';
import '../styles/Interactions.css';

const defaultAnalyticsQuery: AnalyticsQuery = {
  filters: [],
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
  const {
    data: analyticsEvents,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useAnalyticsEvents({ query: defaultAnalyticsQuery });

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
        <div className="interactions-content">
          <section className="interactions-table-card" aria-labelledby="analytics-table-heading">
            <h1 id="analytics-table-heading">Analytics</h1>
            <table className="interactions-table">
              <thead>
                <tr>
                  <th scope="col">Event</th>
                  <th scope="col">Session</th>
                  <th scope="col">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {analyticsLoading && (
                  <tr>
                    <td colSpan={3}>Loading analytics events...</td>
                  </tr>
                )}
                {analyticsError && (
                  <tr>
                    <td colSpan={3}>Failed to load analytics events.</td>
                  </tr>
                )}
                {!analyticsLoading && !analyticsError && analyticsEvents?.results.length === 0 && (
                  <tr>
                    <td colSpan={3}>No analytics events available.</td>
                  </tr>
                )}
                {!analyticsLoading &&
                  !analyticsError &&
                  analyticsEvents?.results.slice(0, ANALYTICS_EVENTS_PAGE_SIZE).map((event) => (
                    <tr key={event.id}>
                      <td>{event.eventType}</td>
                      <td>{event.sessionId}</td>
                      <td>{formatTimestamp(event.timestamp)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>

          <section className="interactions-table-card" aria-labelledby="chatbot-table-heading">
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
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}

export default Interactions;
