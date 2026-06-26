import React, {JSX} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/HeaderFooter.css';
import ServiceAPIDashboard from './pages/ServiceAPIDashboard';
import ServiceDatabaseDashboard from './pages/ServiceDatabaseDashboard';
import ServiceCacheDashboard from './pages/ServiceCacheDashboard';
import ParkingLotsOverview from './pages/parking/ParkingLotsOverview';
import ParkingLotDetails from './pages/parking/ParkingLotDetails';
import NotFound from './pages/NotFound';
import ParkingLotFloorDetails from "./pages/parking/ParkingLotFloorDetails";
import Home from "./pages/Home";
import ServicesHome from "./pages/ServicesHome";
import IntroHome from './pages/IntroHome';
import Blog from "./pages/BlogEngineeringJournal";


const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<IntroHome />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/parking" element={<Home />} />
            <Route path="/services" element={<ServicesHome />} />
            <Route path="/services/api" element={<ServiceAPIDashboard />} />
            <Route path="/services/database" element={<ServiceDatabaseDashboard />} />
            <Route path="/services/cache" element={<ServiceCacheDashboard />} />
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
