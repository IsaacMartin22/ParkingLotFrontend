import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <>
      <header>
        <h1>Welcome to React</h1>
      </header>
      <main className="container">
        <h2>Get Started</h2>
        <p>Edit <code>src/pages/Home.js</code> and save to see your changes.</p>
        
        <h2 style={{ marginTop: '40px' }}>Service Dashboards</h2>
        <p>Monitor and manage your microservices:</p>
        
        <div className="services-grid">
          <Link to="/services/api" className="service-card">
            <div className="service-card-icon">🔌</div>
            <h3>API Service</h3>
            <p>REST API endpoints and request handling</p>
          </Link>
          
          <Link to="/services/database" className="service-card">
            <div className="service-card-icon">🗄️</div>
            <h3>Database Service</h3>
            <p>PostgreSQL database operations and storage</p>
          </Link>
          
          <Link to="/services/cache" className="service-card">
            <div className="service-card-icon">⚡</div>
            <h3>Cache Service</h3>
            <p>Redis caching and performance optimization</p>
          </Link>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 React Application. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;
