import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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

export function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <Footer />
      </div>
    </ToastProvider>
  );
}
