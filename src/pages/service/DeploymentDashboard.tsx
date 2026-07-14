import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import useBuildkiteInfo from '../../network/useBuildkiteInfo';
import { BuildkiteBuildResponse } from '../../types/buildkiteInfo';
import '../../styles/ServicePageStyles.css';

type BuildStatus = 'success' | 'failure' | 'in-progress' | 'blocked' | 'unknown';

type BuildStatusInfo = {
  label: string;
  status: BuildStatus;
};

type PipelineBuildGroup = {
  key: string;
  name: string;
  slug: string;
  builds: BuildkiteBuildResponse[];
  latestActivity: number;
};

function getBuildTimestamp(build: BuildkiteBuildResponse): number {
  const candidateTimestamps = [build.created_at, build.started_at, build.finished_at, build.scheduled_at];

  for (const timestamp of candidateTimestamps) {
    if (!timestamp) {
      continue;
    }

    const parsedTimestamp = new Date(timestamp).getTime();
    if (!Number.isNaN(parsedTimestamp)) {
      return parsedTimestamp;
    }
  }

  return 0;
}

function getBuildStatus(state: string | null, blocked: boolean): BuildStatusInfo {
  if (blocked) {
    return {
      label: 'Blocked',
      status: 'blocked',
    };
  }

  const normalizedState = (state ?? '').toLowerCase();

  if (normalizedState === 'passed' || normalizedState === 'finished' || normalizedState === 'success') {
    return {
      label: 'Passed',
      status: 'success',
    };
  }

  if (normalizedState === 'running' || normalizedState === 'scheduled' || normalizedState === 'creating') {
    return {
      label: 'In Progress',
      status: 'in-progress',
    };
  }

  if (normalizedState === 'failed' || normalizedState === 'canceled' || normalizedState === 'canceling') {
    return {
      label: 'Failed',
      status: 'failure',
    };
  }

  return {
    label: state ?? 'Unknown',
    status: 'unknown',
  };
}

function getBuildDuration(startedAt: string | null, finishedAt: string | null): string {
  if (!startedAt) {
    return 'N/A';
  }

  const startedDate = new Date(startedAt);
  if (Number.isNaN(startedDate.getTime())) {
    return 'N/A';
  }

  const finishedDate = finishedAt ? new Date(finishedAt) : new Date();
  if (Number.isNaN(finishedDate.getTime())) {
    return 'N/A';
  }

  const elapsedMs = Math.max(0, finishedDate.getTime() - startedDate.getTime());
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function formatDateTime(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function buildPipelineGroups(buildInfo: BuildkiteBuildResponse[]): PipelineBuildGroup[] {
  const groupedBuilds = new Map<
    string,
    {
      name: string;
      slug: string;
      builds: BuildkiteBuildResponse[];
    }
  >();

  buildInfo.forEach((build, index) => {
    const pipelineName = build.pipeline?.name ?? 'Unassigned Pipeline';
    const pipelineSlug = build.pipeline?.slug ?? 'N/A';
    const pipelineKey = build.pipeline?.slug ?? build.pipeline?.id ?? `${pipelineName}-${index}`;
    const existingGroup = groupedBuilds.get(pipelineKey);

    if (existingGroup) {
      existingGroup.builds.push(build);
      return;
    }

    groupedBuilds.set(pipelineKey, {
      name: pipelineName,
      slug: pipelineSlug,
      builds: [build],
    });
  });

  return Array.from(groupedBuilds.entries())
    .map(([key, group]) => {
      const sortedBuilds = [...group.builds].sort((a, b) => {
        const timestampDiff = getBuildTimestamp(b) - getBuildTimestamp(a);
        if (timestampDiff !== 0) {
          return timestampDiff;
        }

        return (b.number ?? 0) - (a.number ?? 0);
      });

      return {
        key,
        name: group.name,
        slug: group.slug,
        builds: sortedBuilds,
        latestActivity: getBuildTimestamp(sortedBuilds[0] ?? group.builds[0]),
      };
    })
    .sort((a, b) => b.latestActivity - a.latestActivity)
    .slice(0, 3);
}

function DeploymentDashboard(): JSX.Element {
  const { data: buildInfo = [], isLoading, isError, error } = useBuildkiteInfo();
  const pipelineGroups = buildPipelineGroups(buildInfo);

  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/parking" className="back-link" data-analytics-id="back-to-parking-home-deployments">
            ← Parking Home
          </Link>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Deployments Dashboard</h1>
        <p className="service-subtitle">
          30 most recent builds for pipelines, including outcomes, duration, and timestamps.
        </p>
      </header>

      <main className="service-container">
        <section className="service-details deployment-dashboard-section">
          <h3>Recent Builds by Pipeline</h3>
          {isLoading && <p>Loading recent pipeline builds...</p>}
          {isError && (
            <p className="deployment-error-message">
              {error instanceof Error ? error.message : 'Failed to load Buildkite build information.'}
            </p>
          )}
          {!isLoading && !isError && pipelineGroups.length === 0 && (
            <p>No pipeline build information is currently available.</p>
          )}

          {!isLoading && !isError && pipelineGroups.length > 0 && (
            <div className="deployment-pipeline-grid">
              {pipelineGroups.map((pipelineGroup) => (
                <article className="deployment-pipeline-card" key={pipelineGroup.key}>
                  <div className="deployment-pipeline-card-header">
                    <div>
                      <h4>{pipelineGroup.name}</h4>
                      <p>Pipeline slug: {pipelineGroup.slug}</p>
                    </div>
                    <span className="deployment-recent-count">{pipelineGroup.builds.length} recent builds</span>
                  </div>

                  <div className="deployment-build-table-wrapper">
                    <table className="deployment-build-table">
                      <thead>
                        <tr>
                          <th>Build</th>
                          <th>Status</th>
                          <th>Duration</th>
                          <th>Created</th>
                          <th>Started</th>
                          <th>Finished</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pipelineGroup.builds.map((build) => {
                          const buildStatus = getBuildStatus(build.state, build.blocked);

                          return (
                            <tr key={build.id}>
                              <td>#{build.number ?? 'N/A'}</td>
                              <td>
                                <span className={`deployment-state-badge deployment-state-badge--${buildStatus.status}`}>
                                  {buildStatus.label}
                                </span>
                              </td>
                              <td>{getBuildDuration(build.started_at, build.finished_at)}</td>
                              <td>{build.created_at ? formatDateTime(build.created_at) : 'N/A'}</td>
                              <td>{build.started_at ? formatDateTime(build.started_at) : 'N/A'}</td>
                              <td>{build.finished_at ? formatDateTime(build.finished_at) : 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="service-details">
          <h3>Data Source</h3>
          <p>
            This dashboard is powered by the Buildkite builds feed and grouped by pipeline. It displays the 30 most recent
            triggered builds.
          </p>
          <div className="database-snapshot-grid">
            <div>
              <span className="service-card-kicker">Pipelines Shown</span>
              <p>{pipelineGroups.length}/3</p>
            </div>
            <div>
              <span className="service-card-kicker">Total Builds Received</span>
              <p>{buildInfo.length}</p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2026 Isaac - Parking App Demo.</p>
      </footer>
    </>
  );
}

export default DeploymentDashboard;
