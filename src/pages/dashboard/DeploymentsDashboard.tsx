import React, { JSX } from 'react';
import AppFooter from '../../components/AppFooter';
import ServiceHeader from '../../components/ServiceHeader';
import useDeploymentInfo from '../../network/useDeploymentInfo';
import useAnalyticsErrorReporter from '../../network/useAnalyticsErrorReporter';
import '../../styles/ServicePageStyles.css';
import {RENDER_EXTERNAL} from "../../types/constants";

type DeploymentTone = 'success' | 'failure' | 'in-progress' | 'blocked' | 'unknown';

type DeploymentStatusInfo = {
  label: string;
  tone: DeploymentTone;
};

function getDeploymentStatus(status: string): DeploymentStatusInfo {
  switch (status) {
    case 'created':
      return { label: 'Created', tone: 'unknown' };
    case 'queued':
      return { label: 'Queued', tone: 'blocked' };
    case 'build_in_progress':
      return { label: 'Build In Progress', tone: 'in-progress' };
    case 'update_in_progress':
      return { label: 'Update In Progress', tone: 'in-progress' };
    case 'live':
      return { label: 'Live', tone: 'success' };
    case 'deactivated':
      return { label: 'Deactivated', tone: 'unknown' };
    case 'build_failed':
      return { label: 'Build Failed', tone: 'failure' };
    case 'update_failed':
      return { label: 'Update Failed', tone: 'failure' };
    case 'canceled':
      return { label: 'Canceled', tone: 'blocked' };
    case 'pre_deploy_in_progress':
      return { label: 'Pre-deploy In Progress', tone: 'in-progress' };
    case 'pre_deploy_failed':
      return { label: 'Pre-deploy Failed', tone: 'failure' };
    default:
      return { label: status || 'Unknown', tone: 'unknown' };
  }
}

function getDeploymentDuration(startedAt: string, finishedAt: string): string {
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

function DeploymentsDashboard(): JSX.Element {
  const { data: deploymentInfo = [], isLoading, isError, error } = useDeploymentInfo();
  useAnalyticsErrorReporter(error, 'Failed to load deployment information.');

  return (
    <>
      <ServiceHeader
        title="Deployments Dashboard"
        subtitle="30 most recent deployments, including status, duration, and timestamps."
        actionLink={{
          analyticsId: 'render-external-link',
          href: RENDER_EXTERNAL,
          label: 'Render ↗',
        }}
      />

      <main className="service-container">
        <section className="service-details build-dashboard-section">
          <h3>Recent Deployments</h3>
          {isLoading && (
            <>
              <p>Loading recent deployment information...</p>
              <p>If this takes longer than 30 seconds check Render's status page <p/>
                <a href="https://status.render.com/" target="_blank" rel="noreferrer">https://status.render.com/</a>
              </p>
            </>
          )}
          {isError && (
            <p className="build-error-message">
              {error instanceof Error ? error.message : 'Failed to load deployment information.'}
            </p>
          )}
          {!isLoading && !isError && deploymentInfo.length === 0 && (
            <p>No deployment information is currently available.</p>
          )}
          {!isLoading && !isError && deploymentInfo.length > 0 && (
            <div className="build-pipeline-grid">
              <article className="build-pipeline-card">
                <div className="build-table-wrapper">
                  <table className="build-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Duration</th>
                        <th>Commit</th>
                        <th>Created</th>
                        <th>Started</th>
                        <th>Finished</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deploymentInfo.map((deploymentResponse) => {
                        const deployment = deploymentResponse.deploy;
                        const deploymentStatus = getDeploymentStatus(deployment.status);

                        return (
                          <tr key={deployment.id}>
                            <td>
                              <span className={`deployment-state-badge deployment-state-badge--${deploymentStatus.tone}`}>
                                {deploymentStatus.label}
                              </span>
                            </td>
                            <td>{getDeploymentDuration(deployment.startedAt, deployment.finishedAt)}</td>
                            <td>
                              <div>{deployment.commit.message}</div>
                              <div>Commit: {deployment.commit.id}</div>
                            </td>
                            <td>{formatDateTime(deployment.createdAt)}</td>
                            <td>{formatDateTime(deployment.startedAt)}</td>
                            <td>{formatDateTime(deployment.finishedAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
          )}
        </section>

        <section className="service-details">
          <h3>Data Source</h3>
          <p>
            This dashboard is powered by the deployment feed and displays the 30 most recent deployment records.
          </p>
          <div className="database-snapshot-grid">
            <div>
              <span className="service-card-kicker">Deployments Shown</span>
              <p>{deploymentInfo.length}/30</p>
            </div>
            <div>
              <span className="service-card-kicker">Total Deployments Received</span>
              <p>{deploymentInfo.length}</p>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </>
  );
}

export default DeploymentsDashboard;
