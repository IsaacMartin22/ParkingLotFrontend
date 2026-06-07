import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <>
      <header>
        <h1>404 - Page Not Found</h1>
      </header>
      <main className="container not-found">
        <h2>Oops!</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn">
          Go Home
        </Link>
      </main>
      <footer>
        <p>&copy; 2025 React Application. All rights reserved.</p>
      </footer>
    </>
  );
}

export default NotFound;
