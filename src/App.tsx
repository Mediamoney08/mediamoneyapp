import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import routes from './routes';

import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import TopBanner from '@/components/banners/TopBanner';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';
import '@/i18n/config';

const AppContent = () => {
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminLogin && <TopBanner />}
      {!isAdminLogin && <Header />}
      <main className="flex-grow">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminLogin && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <AppContent />
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
