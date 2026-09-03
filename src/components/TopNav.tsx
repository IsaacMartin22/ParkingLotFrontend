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
        <Link to="/projects" className="intro-top-nav-link">Projects</Link>
        <Link to="/infrastructure" className="intro-top-nav-link">Infrastructure</Link>
        <Link to="/interactions" className="intro-top-nav-link">Interactions</Link>
        <Link to="/contact" className="intro-top-nav-link">Contact</Link>
      </div>
    </nav>
  );
}

export default TopNav;
