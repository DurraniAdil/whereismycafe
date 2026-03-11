import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { CafeDetail } from './pages/CafeDetail';
import { Search } from './pages/Search';
import { About } from './pages/About';
import { Vibes } from './pages/Vibes';
import { Secret } from './pages/Secret';
import { MapView } from './pages/MapView';
import { Contact } from './pages/Contact';
import { Studio } from './pages/Studio';
import { Collections } from './pages/Collections';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { useEffect, useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { SpeedInsights } from '@vercel/speed-insights/react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <ScrollToTop />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafes/:id" element={<CafeDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/vibes" element={<Vibes />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/wimc-secret" element={<Secret />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/collections" element={<Collections />} />
            {/* Fallback routes */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <ConditionalFooter />
        <Navbar />
      </div>
      <SpeedInsights />
    </Router>
  );
}

function ConditionalFooter() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/cafes/') || pathname === '/wimc-secret') return null;
  return <Footer />;
}
