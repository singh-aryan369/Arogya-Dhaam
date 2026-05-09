import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Plus, Home as HomeIcon, Stethoscope, Users,
  BookOpen, PhoneCall, Heart, CalendarPlus, ChevronRight, AlertCircle
} from 'lucide-react';
import { contact } from '../data/contact.js';
import './Navbar.css';

const links = [
  { to: '/',            label: 'Home',     icon: HomeIcon,    end: true, desc: 'Overview' },
  { to: '/specialties', label: 'Services', icon: Stethoscope,            desc: 'Specialties & care' },
  { to: '/doctors',     label: 'Doctors',  icon: Users,                  desc: 'Find a consultant' },
  { to: '/blog',        label: 'Blog',     icon: BookOpen,               desc: 'Articles & news' },
  { to: '/contact',     label: 'Contact',  icon: PhoneCall,              desc: 'Reach us' },
  { to: '/about',       label: 'About',    icon: Heart,                  desc: 'Who we are' }
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
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isHomeRoot = pathname === '/';

  return (
    <>
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
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile drawer + backdrop — outside <header> so it's not affected by --over-hero/transparent ancestors */}
      <div
        className={`nav__backdrop ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-nav"
        className={`nav__drawer ${open ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <div className="nav__drawer-head">
          <Link to="/" className="nav__drawer-brand" onClick={() => setOpen(false)}>
            <span className="nav__brand-mark" aria-hidden="true">
              <Plus size={16} strokeWidth={3} aria-hidden="true" />
            </span>
            <span>Arogya Dhaam</span>
          </Link>
          <button
            type="button"
            className="nav__drawer-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="nav__drawer-list" aria-label="Mobile">
          {links.map(l => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav__drawer-link ${isActive ? 'is-active' : ''}`}
              >
                <span className="nav__drawer-icon" aria-hidden="true"><Icon size={18} /></span>
                <span className="nav__drawer-text">
                  <strong>{l.label}</strong>
                  <small>{l.desc}</small>
                </span>
                <ChevronRight size={16} aria-hidden="true" className="nav__drawer-chev" />
              </NavLink>
            );
          })}
        </nav>

        <div className="nav__drawer-foot">
          <Link to="/appointments" className="btn btn-primary nav__drawer-cta">
            <CalendarPlus size={16} aria-hidden="true" /> Make an appointment
          </Link>
          <a
            href={`tel:${contact.phone.emergency.replace(/\s/g, '')}`}
            className="nav__drawer-emergency"
          >
            <AlertCircle size={14} aria-hidden="true" />
            <span><strong>Emergency 24×7</strong> {contact.phone.emergency}</span>
          </a>
        </div>
      </aside>
    </>
  );
}
