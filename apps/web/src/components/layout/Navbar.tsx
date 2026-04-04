import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ButtonLink } from '../ui/Button';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Services', to: '/#career-support' },
  { label: 'Technology', to: '/technology-services' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Career', to: '/career' },
  { label: 'Blog', to: '/blog' },
];

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  }

  return (
    <>
      <nav className={`navbar glass ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container-custom navbar-inner">
          <NavLink to="/" className="brand">
            Digit<span>Build</span>
          </NavLink>

          <div className="nav-links desktop-only">
            {links.map((link) => {
              const active = link.to.includes('#')
                ? location.pathname === '/' && location.hash === '#career-support'
                : location.pathname === link.to;

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

            <div className="desktop-only">
              <ButtonLink to="/contact" size="sm">
                Get Started
              </ButtonLink>
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
            <ButtonLink to="/contact" size="lg">
              Get Started
            </ButtonLink>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
