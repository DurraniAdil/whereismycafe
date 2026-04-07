import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { CafeDetail } from './pages/CafeDetail';
import { SearchPage as Search } from './pages/Search';
import { About } from './pages/About';
import { Vibes } from './pages/Vibes';
import { Secret } from './pages/Secret';
import { MapView } from './pages/MapView';
import { Contact } from './pages/Contact';
import { Studio } from './pages/Studio';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { FinanceDashboard } from './pages/FinanceDashboard';
import { TripPlanner } from './pages/TripPlanner';
import { InvitePage } from './pages/InvitePage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { useAuth } from './context/AuthContext';
import { LoginModal } from './components/auth/LoginModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

function MainApp() {
  const [showSplash, setShowSplash] = useState(true);
  const { showAuthModal, setShowAuthModal } = useAuth();

  const handleModalClose = () => {
    setShowAuthModal(false);
    sessionStorage.setItem('wimc_auth_dismissed', 'true');
  };

  return (
    <>
      <ScrollToTop />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
        <div className="flex-grow min-h-[85vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafes/:id" element={<CafeDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/vibes" element={<Vibes />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/wimc-secret" element={<Secret />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/studio" element={<Studio />} /> */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/wimc-super-secret-admin-access-page" element={<Admin />} />
            <Route path="/wimc-cafe-owner-portal" element={<FinanceDashboard />} />
            <Route path="/trip" element={
              <ProtectedRoute>
                <TripPlanner />
              </ProtectedRoute>
            } />
            <Route path="/trip/invite/:code" element={<InvitePage />} />
            {/* Fallback routes */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <ConditionalFooter />
        <Navbar />
      </div>

      <LoginModal
        isOpen={showAuthModal}
        onClose={handleModalClose}
        dismissible={true}
      />
    </>
  );
}

function ConditionalFooter() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/cafes/') || pathname === '/wimc-secret' || pathname === '/wimc-cafe-owner-portal') return null;
  return <Footer />;
}
