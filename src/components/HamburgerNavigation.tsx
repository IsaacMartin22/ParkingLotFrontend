import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/HamburgerNavigation.css';

type NavigationItem = {
  label: string;
  to: string;
  description: string;
};

type NavigationSection = {
  heading: string;
  items: NavigationItem[];
};

const navigationSections: NavigationSection[] = [
  {
    heading: 'Portfolio',
    items: [
      { label: 'Home', to: '/', description: 'Open the portfolio introduction page' },
      { label: 'Blog', to: '/blog', description: 'Read the engineering journal' },
      { label: 'About', to: '/aboutme', description: 'Learn more about me' },
    ],
  },
  {
    heading: 'Parking App',
    items: [
      { label: 'Parking Home', to: '/parking', description: 'Open the parking experience home page' },
      { label: 'Parking Lots', to: '/parking-lots', description: 'Browse live parking lots' },
    ],
  },
  {
    heading: 'Diagnostics',
    items: [
      { label: 'Services Dashboard', to: '/services', description: 'Open the service landing page' },
      { label: 'API', to: '/services/api', description: 'Inspect API service health' },
      { label: 'Database', to: '/services/database', description: 'Inspect database service health' },
      { label: 'Cache', to: '/services/cache', description: 'Inspect cache service health' },
    ],
  },
];

function HamburgerNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <nav className="hamburger-navigation" aria-label="Primary navigation">
      <button
        type="button"
        className="hamburger-toggle"
        aria-expanded={isOpen}
        aria-controls="site-navigation-menu"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="hamburger-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="hamburger-label">Menu</span>
      </button>

      {isOpen && (
        <button
          type="button"
          className="hamburger-overlay"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div id="site-navigation-menu" className={`hamburger-menu ${isOpen ? 'is-open' : ''}`}>
        <p className="hamburger-menu-heading">Navigate to</p>
        {navigationSections.map((section) => (
          <div key={section.heading} className="hamburger-menu-section">
            <p className="hamburger-menu-group-title">{section.heading}</p>
            <ul className="hamburger-menu-list">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `hamburger-menu-link${isActive ? ' is-active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="hamburger-menu-link-title">{item.label}</span>
                    <span className="hamburger-menu-link-description">{item.description}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default HamburgerNavigation;


