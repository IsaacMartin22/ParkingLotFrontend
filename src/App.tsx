import React, {JSX} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/App.css';
import Home from './pages/Home';
import ServiceAPIDashboard from './pages/ServiceAPIDashboard';
import ServiceDatabaseDashboard from './pages/ServiceDatabaseDashboard';
import ServiceCacheDashboard from './pages/ServiceCacheDashboard';
import ParkingLots from './pages/ParkingLots';
import ParkingLotDetails from './pages/ParkingLotDetails';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/api" element={<ServiceAPIDashboard />} />
            <Route path="/services/database" element={<ServiceDatabaseDashboard />} />
            <Route path="/services/cache" element={<ServiceCacheDashboard />} />
            <Route path="/parking-lots" element={<ParkingLots />} />
            <Route path="/parking-lots/:id" element={<ParkingLotDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
