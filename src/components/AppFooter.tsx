import React, { JSX, ReactNode } from 'react';

interface FooterLink {
  href: string;
  label: string;
  ariaLabel?: string;
  icon?: ReactNode;
}

interface AppFooterProps {
  links?: FooterLink[];
}

function AppFooter({ links = [] }: AppFooterProps): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {links.length > 0 && (
        <div className="app-footer-links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="app-footer-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel ?? `Open ${link.label}`}
            >
              {link.icon && <span>{link.icon}</span>}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )}
      <p className="app-footer-copyright">© {currentYear} Isaac Martin. All rights reserved.</p>
    </footer>
  );
}

export default AppFooter;
