import React, { JSX, useMemo, useState } from 'react';
import { LogEntry } from '../types/apiDiagnostics';
import { formatTimestamp } from '../formattingUtils';
import '../styles/ServiceLogViewer.css';

type LevelClass = 'error' | 'warning' | 'info' | 'debug';

const ALL_LEVELS = 'ALL';

function levelClass(level: string): LevelClass {
  switch (level.toUpperCase()) {
    case 'ERROR':
    case 'FATAL':
    case 'SEVERE':
      return 'error';
    case 'WARN':
    case 'WARNING':
      return 'warning';
    case 'DEBUG':
    case 'TRACE':
      return 'debug';
    default:
      return 'info';
  }
}

interface ServiceLogViewerProps {
  logs: readonly LogEntry[];
}

function ServiceLogViewer({ logs }: ServiceLogViewerProps): JSX.Element {
  const [activeLevel, setActiveLevel] = useState<string>(ALL_LEVELS);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Distinct levels present, ordered by severity so the filter reads consistently.
  const levels = useMemo(() => {
    const severityOrder = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
    const present = new Set(logs.map((log) => log.level.toUpperCase()));
    const known = severityOrder.filter((level) => present.has(level));
    const extra = Array.from(present).filter((level) => !severityOrder.includes(level));
    return [...known, ...extra];
  }, [logs]);

  const filteredLogs = useMemo(
    () =>
      activeLevel === ALL_LEVELS
        ? logs
        : logs.filter((log) => log.level.toUpperCase() === activeLevel),
    [logs, activeLevel],
  );

  return (
    <div className="log-viewer">
      <div className="log-viewer-header">
        <h3>Application Logs</h3>
        <div className="log-filters" role="group" aria-label="Filter logs by level">
          <button
            type="button"
            className={`log-filter ${activeLevel === ALL_LEVELS ? 'active' : ''}`}
            onClick={() => setActiveLevel(ALL_LEVELS)}
          >
            All ({logs.length})
          </button>
          {levels.map((level) => {
            const count = logs.filter((log) => log.level.toUpperCase() === level).length;
            return (
              <button
                key={level}
                type="button"
                className={`log-filter log-filter-${levelClass(level)} ${
                  activeLevel === level ? 'active' : ''
                }`}
                onClick={() => setActiveLevel(level)}
              >
                {level} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="log-viewer-body">
        {filteredLogs.length === 0 ? (
          <p className="log-empty">
            {logs.length === 0
              ? 'No logs reported by the service.'
              : `No ${activeLevel.toLowerCase()} logs to display.`}
          </p>
        ) : (
          filteredLogs.map((log, index) => {
            const variant = levelClass(log.level);
            const isExpanded = expanded === index;
            return (
              <div key={index} className={`log-row log-row-${variant}`}>
                <div className="log-row-main">
                  <span className={`log-level-badge log-level-${variant}`}>{log.level}</span>
                  <span className="log-row-time">{formatTimestamp(log.timestamp)}</span>
                  <span className="log-row-logger" title={log.logger}>
                    {log.logger}
                  </span>
                  <span className="log-row-thread">[{log.thread}]</span>
                  <span className="log-row-message">{log.message}</span>
                  {log.throwable && (
                    <button
                      type="button"
                      className="log-stacktrace-toggle"
                      onClick={() => setExpanded(isExpanded ? null : index)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Hide stack trace' : 'Show stack trace'}
                    </button>
                  )}
                </div>
                {log.throwable && isExpanded && (
                  <pre className="log-stacktrace">{log.throwable}</pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ServiceLogViewer;
