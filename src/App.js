import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ServiceAPI from './pages/ServiceAPI';
import ServiceDatabase from './pages/ServiceDatabase';
import ServiceCache from './pages/ServiceCache';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/api" element={<ServiceAPI />} />
          <Route path="/services/database" element={<ServiceDatabase />} />
          <Route path="/services/cache" element={<ServiceCache />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
