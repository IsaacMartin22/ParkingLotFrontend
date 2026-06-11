import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Home from './pages/Home';
import ServiceAPI from './pages/ServiceAPI';
import ServiceDatabase from './pages/ServiceDatabase';
import ServiceCache from './pages/ServiceCache';
import ParkingLots from './pages/ParkingLots';
import NotFound from './pages/NotFound';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/api" element={<ServiceAPI />} />
            <Route path="/services/database" element={<ServiceDatabase />} />
            <Route path="/services/cache" element={<ServiceCache />} />
            <Route path="/parking-lots" element={<ParkingLots />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
