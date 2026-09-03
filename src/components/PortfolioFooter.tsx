import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { ISAAC_GITHUB, ISAAC_LINKEDIN } from '../types/constants';

function PortfolioFooter(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="app-footer-links">
        <a
          href={ISAAC_GITHUB}
          className="app-footer-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub profile"
        >
          GitHub
        </a>
        <a
          href={ISAAC_LINKEDIN}
          className="app-footer-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open LinkedIn profile"
        >
          LinkedIn
        </a>
        <Link to="/contact" className="app-footer-link" aria-label="Open contact page">
          Contact
        </Link>
      </div>
      <p className="app-footer-copyright">© {currentYear} Isaac Martin. All rights reserved.</p>
    </footer>
  );
}

export default PortfolioFooter;
