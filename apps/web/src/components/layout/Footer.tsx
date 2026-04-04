import { NavLink } from 'react-router-dom';

const footerLinks = {
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Career', to: '/career' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ],
  Learn: [
    { label: 'All Courses', to: '/courses' },
    { label: 'Tech Solutions', to: '/technology-services' },
  ],
};

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-custom footer-content">
        <div className="footer-grid">
          <div>
            <NavLink to="/" className="brand footer-brand">
              digit<span>build</span>
            </NavLink>
            <p className="footer-copy">Career-focused tech education &amp; IT solutions from Pune, India.</p>
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
          <p>© 2026 DigitBuild. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
