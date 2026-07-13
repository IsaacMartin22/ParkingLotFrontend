import React, {JSX, useEffect, useRef} from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/HeaderFooter.css';
import HamburgerNavigation from './components/HamburgerNavigation';
import usePostAnalyticsRequest from './network/usePostAnalyticsRequest';
import APIDashboard from './pages/service/APIDashboard';
import DatabaseDashboard from './pages/service/DatabaseDashboard';
import ParkingLotsOverview from './pages/parking/ParkingLotsOverview';
import ParkingLotDetails from './pages/parking/ParkingLotDetails';
import NotFound from './pages/NotFound';
import ParkingLotFloorDetails from "./pages/parking/ParkingLotFloorDetails";
import ParkingHome from "./pages/ParkingHome";
import PortfolioHome from './pages/PortfolioHome';
import Blog from "./pages/Blog";
import type { AnalyticsRequest, PageViewPayload } from './types/analytics';
import SDK from "./pages/service/SDKDashboard";

const queryClient = new QueryClient();

function setFavicon(faviconUrl: string): void {
  let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  favicon.href = faviconUrl;
}

function buildPageViewAnalyticsRequest(referrerUrl: string): AnalyticsRequest<PageViewPayload> {
  return {
    eventType: 'PAGE_VIEW',
    currentUrl: window.location.href,
    browser: window.navigator.userAgent,
    operatingSystem: window.navigator.platform,
    ipAddress: 'unknown',
    timestamp: new Date().toISOString(),
    payload: {
      referrerUrl,
    },
  };
}

function isStaticRouteRewrite(locationSearch: string): boolean {
  return locationSearch.startsWith('?/');
}

function AppShell(): JSX.Element {
  const location = useLocation();
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const lastPageViewKeyRef = useRef<string | null>(null);
  const isParkingExperience =
    location.pathname.startsWith('/parking') ||
    location.pathname.startsWith('/parking-lots') ||
    location.pathname.startsWith('/services');
  const portfolioFaviconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#0f3557" /><stop offset="100%" stop-color="#48b7d8" /></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)" /><rect x="14" y="14" width="36" height="8" rx="4" fill="#f6b73c" /><circle cx="22" cy="35" r="5" fill="#ffffff" /><circle cx="32" cy="35" r="5" fill="#ffffff" opacity="0.8" /><circle cx="42" cy="35" r="5" fill="#ffffff" opacity="0.6" /><rect x="18" y="46" width="28" height="4" rx="2" fill="#ffffff" opacity="0.9" /></svg>';
  const portfolioFaviconUrl = `data:image/svg+xml,${encodeURIComponent(portfolioFaviconSvg)}`;

  useEffect(() => {
    document.title = isParkingExperience ? 'Parking App' : 'Developer Portfolio';
  }, [isParkingExperience]);

  useEffect(() => {
    setFavicon(portfolioFaviconUrl);
  }, [isParkingExperience, portfolioFaviconUrl]);

  useEffect(() => {
    if (isStaticRouteRewrite(location.search)) {
      return;
    }

    const pageViewKey = `${location.pathname}${location.search}${location.hash}`;

    if (lastPageViewKeyRef.current === pageViewKey) {
      return;
    }

    lastPageViewKeyRef.current = pageViewKey;
    postAnalyticsRequest(buildPageViewAnalyticsRequest(document.referrer));
  }, [location.pathname, location.search, location.hash, postAnalyticsRequest]);

  return (
    <div className={`App app-shell ${isParkingExperience ? 'app-shell--parking' : 'app-shell--portfolio'}`}>
      <HamburgerNavigation />
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/parking" element={<ParkingHome />} />
        <Route path="/services/api" element={<APIDashboard />} />
        <Route path="/services/database" element={<DatabaseDashboard />} />
        <Route path="/services/sdk" element={<SDK />} />
        <Route path="/parking-lots" element={<ParkingLotsOverview />} />
        <Route path="/parking-lots/:lotId/floors/:floorId" element={<ParkingLotFloorDetails />} />
        <Route path="/parking-lots/:lotId" element={<ParkingLotDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
