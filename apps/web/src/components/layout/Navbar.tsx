import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ButtonLink } from '../ui/Button';
import { API_BASE } from '../../config/api';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/#services' },
  { label: 'Placement Support', to: '/#career-support' },
  { label: 'Technology', to: '/technology-services' },
  { label: 'Courses', to: '/courses' },
  { label: 'Blog', to: '/blog' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Career', to: '/career' },
];

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = isAuthenticated && localStorage.getItem('userRole') === 'admin';
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    _id: string;
    title: string;
    message: string;
    eventType: 'purchase_initiated' | 'payment_success';
    packageName: string;
    customerName: string;
    isRead?: boolean;
    createdAt?: string;
    _createdAt?: string;
  }>>([]);
  const notificationWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsNotificationOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isAdmin) return;

    let active = true;
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/admin-notifications`);
        if (!response.ok) return;
        const data = await response.json();
        if (active && Array.isArray(data)) setNotifications(data);
      } catch {
        // Keep navbar stable even if notifications fail.
      }
    };

    void fetchNotifications();
    const timer = window.setInterval(fetchNotifications, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isNotificationOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (notificationWrapRef.current?.contains(target)) return;
      setIsNotificationOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isNotificationOpen]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  }

  function handleLogout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.href = '/';
  }

  async function markNotificationRead(id: string, read = true) {
    try {
      await fetch(`${API_BASE}/api/admin-notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });
      setNotifications((current) => current.map((item) => (
        item._id === id ? { ...item, isRead: read } : item
      )));
    } catch {
      // Keep UX responsive even if write fails.
    }
  }

  function formatNotificationTime(value?: string) {
    const date = new Date(value || '');
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function isLinkActive(to: string) {
    if (to.includes('#')) {
      const [pathname, hash] = to.split('#');
      return location.pathname === (pathname || '/') && location.hash === `#${hash}`;
    }

    return location.pathname === to;
  }

  const unreadCount = notifications.filter((item) => item.isRead !== true).length;

  return (
    <>
      <nav className={`navbar glass ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container-custom navbar-inner">
          <NavLink to="/" className="brand">
            Digit<span>Build</span>
          </NavLink>

          <div className="nav-links desktop-only">
            {links.map((link) => {
              const active = isLinkActive(link.to);

              return (
                <NavLink key={link.to} to={link.to} className={`nav-link ${active ? 'is-active' : ''}`}>
                  {link.label}
                  {active ? <motion.span layoutId="nav-dot" className="nav-dot" /> : null}
                </NavLink>
              );
            })}
          </div>

          <div className="nav-actions">
            <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isAdmin ? (
              <div ref={notificationWrapRef} className="notification-wrap desktop-only">
                <button
                  type="button"
                  className="icon-button notification-button"
                  onClick={() => setIsNotificationOpen((value) => !value)}
                  aria-label="Admin notifications"
                >
                  <Bell size={16} />
                  {unreadCount > 0 ? <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span> : null}
                </button>
                {isNotificationOpen ? (
                  <div className="notification-menu">
                    <div className="notification-menu-header">
                      <strong>Notifications</strong>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="notification-empty">No notifications yet.</p>
                    ) : (
                      <div className="notification-list">
                        {notifications.map((item) => (
                          <button
                            type="button"
                            key={item._id}
                            className={`notification-item ${item.isRead === true ? '' : 'is-unread'}`}
                            onClick={() => void markNotificationRead(item._id, true)}
                          >
                            <div className="notification-item-top">
                              <span>{item.title}</span>
                              <time>{formatNotificationTime(item.createdAt || item._createdAt)}</time>
                            </div>
                            <p>{item.message}</p>
                            <small>{item.customerName} · {item.packageName}</small>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="nav-actions-desktop desktop-only" style={{ gap: '1rem', display: 'flex', alignItems: 'center' }}>
              {isAdmin ? (
                <NavLink to="/admin/payments" className="btn-minimalist">
                  Payments
                </NavLink>
              ) : null}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-minimalist">
                  Logout
                </button>
              ) : null}
              {!isAdmin ? (
                <ButtonLink to="/contact" size="sm">
                  Get Started
                </ButtonLink>
              ) : null}
            </div>

            <button type="button" className="icon-button mobile-only" onClick={() => setIsOpen((value) => !value)} aria-label="Menu">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className="mobile-menu-link">
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              isAdmin ? (
                <NavLink to="/admin/payments" className="mobile-menu-link">
                  Payments
                </NavLink>
              ) : null
            ) : null}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="mobile-menu-link text-left" style={{ background: 'transparent', border: 'none', padding: '1rem 1.5rem' }}>
                Logout
              </button>
            ) : null}
            {!isAdmin ? (
              <ButtonLink to="/contact" size="lg">
                Get Started
              </ButtonLink>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
