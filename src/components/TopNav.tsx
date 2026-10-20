import React, { JSX } from 'react';
import { Link } from 'react-router-dom';

interface TopNavProps {
  className?: string;
}

function TopNav({ className = '' }: TopNavProps): JSX.Element {
  const navClassName = ['intro-top-nav', className].filter(Boolean).join(' ');

  return (
    <nav className={navClassName} aria-label="Portfolio sections">
      <Link to="/" className="intro-top-nav-link intro-top-nav-brand">Isaac Martin</Link>
      <div className="intro-top-nav-links">
        <Link to="/gubb" className="intro-top-nav-link">Gubb</Link>
        <Link to="/projects" className="intro-top-nav-link">Projects</Link>
        <Link to="/infrastructure" className="intro-top-nav-link">Internals</Link>
      </div>
    </nav>
  );
}

export default TopNav;
