import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus } from 'lucide-react';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/specialties', label: 'Services' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Detect if hero is visible (transparent nav over teal hero) — only on root
  const isHomeRoot = pathname === '/';

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${isHomeRoot && !scrolled ? 'nav--over-hero' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="Arogya Dhaam home">
          <span className="nav__brand-mark" aria-hidden="true">
            <Plus size={18} strokeWidth={3} aria-hidden="true" />
          </span>
          <span className="nav__brand-text">Arogya Dhaam</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      <div id="mobile-nav" className={`nav__mobile ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="nav__mobile-inner" aria-label="Mobile">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav__mobile-link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/appointments" className="btn btn-primary nav__mobile-cta">
            Make an appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
