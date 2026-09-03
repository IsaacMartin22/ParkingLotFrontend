import React, {JSX, useEffect, useRef} from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/HeaderFooter.css';
import usePostAnalyticsRequest from './network/usePostAnalyticsRequest';
import ParkingLotsOverview from './pages/parking/ParkingLotsOverview';
import ParkingLotDetails from './pages/parking/ParkingLotDetails';
import NotFound from './pages/NotFound';
import ParkingLotFloorDetails from "./pages/parking/ParkingLotFloorDetails";
import InfrastructureHome from "./pages/InfrastructureHome";
import InteractionsPage from './pages/Interactions';
import PortfolioHome from './pages/PortfolioHome';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import type { AnalyticsRequest, ClickPayload } from './types/analytics';

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

function buildPageViewAnalyticsRequest(): Omit<AnalyticsRequest<{}>, 'sessionId'> {
  return {
    eventType: 'PAGE_VIEW',
    currentUrl: window.location.href,
    browser: window.navigator.userAgent,
    operatingSystem: window.navigator.platform,
    ipAddress: 'unknown',
    timestamp: new Date().toISOString(),
    payload: {},
  };
}

function buildClickAnalyticsRequest(payload: ClickPayload): Omit<AnalyticsRequest<ClickPayload>, 'sessionId'> {
  return {
    eventType: 'CLICK',
    currentUrl: window.location.href,
    browser: window.navigator.userAgent,
    operatingSystem: window.navigator.platform,
    ipAddress: 'unknown',
    timestamp: new Date().toISOString(),
    payload,
  };
}

function isStaticRouteRewrite(locationSearch: string): boolean {
  return locationSearch.startsWith('?/');
}

function getClickButtonId(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const htmlElement = target.closest<HTMLElement>(
    '[data-analytics-id]'
  );
  return htmlElement?.dataset.analyticsId?.trim();
}

function AppShell(): JSX.Element {
  const location = useLocation();
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const lastPageViewKeyRef = useRef<string | null>(null);
  const isParkingExperience = location.pathname.startsWith('/parking-lots');
  const portfolioFaviconUrl = `${process.env.PUBLIC_URL}/favicon.svg`;

  useEffect(() => {
    document.title = isParkingExperience ? 'Parking App' : 'Isaac Martin - Software Engineer';
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
    postAnalyticsRequest(buildPageViewAnalyticsRequest());
  }, [location.pathname, location.search, location.hash, postAnalyticsRequest]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const buttonId = getClickButtonId(event.target);
      if (!buttonId) {
        return;
      }

      postAnalyticsRequest(
        buildClickAnalyticsRequest({
          buttonId,
        })
      );
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [postAnalyticsRequest]);

  return (
    <div className={`App app-shell ${isParkingExperience ? 'app-shell--parking' : 'app-shell--portfolio'}`}>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/infrastructure" element={<InfrastructureHome />} />
        <Route path="/interactions" element={<InteractionsPage />} />
        <Route path="/dashboards" element={<Navigate to="/infrastructure" replace />} />
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
