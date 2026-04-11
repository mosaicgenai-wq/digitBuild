import { Instagram, Linkedin, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const footerLinks = {
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Career', to: '/career' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact Us', to: '/contact' },
  ],
  Learn: [
    { label: 'All Courses', to: '/courses' },
    { label: 'Placement Support', to: '/#career-support' },
  ],
  Services: [
    { label: 'Career Services', to: '/#career-support' },
    { label: 'Technology Services', to: '/technology-services' },
  ],
};

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-custom footer-content">
        <div className="footer-grid">
          <div>
            <NavLink to="/" className="brand footer-brand">
              Digit<span>Build</span>
            </NavLink>
            <p className="footer-copy">Career-focused tech education &amp; IT solutions from Pune, India.</p>
            <div className="footer-socials">
              <a href="mailto:marutidigitbuild@gmail.com" aria-label="Gmail" className="footer-social-link">
                <Mail />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-link">
                <Instagram />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-link">
                <Linkedin />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group}>
              <h4 className="footer-heading">{group}</h4>
              <ul className="footer-list">
                {items.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className="footer-link">
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>{String.fromCharCode(169)} 2026 DigitBuild. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
