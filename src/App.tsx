import React, {JSX} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/HeaderFooter.css';
import HamburgerNavigation from './components/HamburgerNavigation';
import usePingAPI from './hooks/usePingAPI';
import ServiceAPIDashboard from './pages/ServiceAPIDashboard';
import ServiceDatabaseDashboard from './pages/ServiceDatabaseDashboard';
import ServiceCacheDashboard from './pages/EventGeneratorDashboard';
import ParkingLotsOverview from './pages/parking/ParkingLotsOverview';
import ParkingLotDetails from './pages/parking/ParkingLotDetails';
import NotFound from './pages/NotFound';
import ParkingLotFloorDetails from "./pages/parking/ParkingLotFloorDetails";
import ParkingHome from "./pages/ParkingHome";
import PortfolioHome from './pages/PortfolioHome';
import Blog from "./pages/Blog";


const queryClient = new QueryClient();

function PageNavigationPingTracker(): null {
  usePingAPI();

  return null;
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <PageNavigationPingTracker />
          <HamburgerNavigation />
          <Routes>
            <Route path="/" element={<PortfolioHome />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/parking" element={<ParkingHome />} />
            <Route path="/services/api" element={<ServiceAPIDashboard />} />
            <Route path="/services/database" element={<ServiceDatabaseDashboard />} />
            <Route path="/services/generator" element={<ServiceCacheDashboard />} />
            <Route path="/parking-lots" element={<ParkingLotsOverview />} />
            <Route path="/parking-lots/:lotId/floors/:floorId" element={<ParkingLotFloorDetails />} />
            <Route path="/parking-lots/:lotId" element={<ParkingLotDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
