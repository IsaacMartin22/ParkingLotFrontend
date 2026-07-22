import React, { JSX, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type HeaderActionLink = {
  analyticsId: string;
  href: string;
  label: string;
};

type ServiceHeaderProps = {
  title: string;
  subtitle: ReactNode;
  actionLink?: HeaderActionLink;
};

function ServiceHeader({
  title,
  subtitle,
  actionLink,
}: ServiceHeaderProps): JSX.Element {
  return (
    <header className="service-header">
      <div className="service-header-nav">
        <Link to="/dashboards" className="back-link">
          ← Dashboards
        </Link>
        {actionLink && (
          <a
            data-analytics-id={actionLink.analyticsId}
            href={actionLink.href}
            className="header-action-link"
            target="_blank"
            rel="noreferrer"
          >
            {actionLink.label}
          </a>
        )}
      </div>
      <p className="service-eyebrow">Diagnostics</p>
      <h1>{title}</h1>
      <p className="service-subtitle">{subtitle}</p>
    </header>
  );
}

export default ServiceHeader;
