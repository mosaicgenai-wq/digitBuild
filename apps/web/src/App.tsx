import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ToastProvider } from './components/toast/ToastProvider';

const HomePage = lazy(() => import('./pages/HomePage'));
const PlacementServicesPage = lazy(() => import('./pages/PlacementServicesPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CareerPage = lazy(() => import('./pages/CareerPage'));
const TechnologyServicesPage = lazy(() => import('./pages/TechnologyServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PlacementPaymentPage = lazy(() => import('./pages/PlacementPaymentPage'));
const AdminPaymentsPage = lazy(() => import('./pages/AdminPaymentsPage'));

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = location.hash.slice(1);
    let attempts = 0;

    const scrollToSection = () => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      attempts += 1;
      if (attempts < 12) {
        window.setTimeout(scrollToSection, 120);
      }
    };

    scrollToSection();
  }, [location.pathname, location.hash]);

  return null;
}

export function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <ScrollManager />
        <Navbar />
        <Suspense fallback={<div className="page-skeleton" />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/placement-services" element={<Navigate to="/" replace />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/technology-services" element={<TechnologyServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/career" element={<CareerPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/placement-payment" element={<PlacementPaymentPage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <Footer />
      </div>
    </ToastProvider>
  );
}
