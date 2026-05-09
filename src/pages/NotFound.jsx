import { Link } from 'react-router-dom';
import { Home, ArrowRight, CalendarPlus, Search, Stethoscope, Phone } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { contact } from '../data/contact.js';
import './NotFound.css';

const quick = [
  { to: '/doctors', icon: Search, title: 'Find a doctor', desc: 'Search by name, qualification or specialty.' },
  { to: '/specialties', icon: Stethoscope, title: 'Browse specialties', desc: 'Care across 20+ medical specialties.' },
  { to: '/appointments', icon: CalendarPlus, title: 'Book an appointment', desc: 'Same-day OPD slots in most departments.' }
];

export default function NotFound() {
  return (
    <section className="nf section">
      <div className="container nf__inner">
        <Reveal className="nf__hero" y={20}>
          <p className="eyebrow">Page not found</p>
          <h1 className="nf__code">404</h1>
          <p className="nf__lead">
            The page you're looking for has moved or doesn't exist. Let's get you back on track.
          </p>
          <div className="nf__cta">
            <Link to="/" className="btn btn-primary">
              <Home size={16} aria-hidden="true" /> Back to home <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href={`tel:${contact.phone.appointment.replace(/\s/g, '')}`} className="btn btn-ghost">
              <Phone size={16} aria-hidden="true" /> Call us · {contact.phone.appointment}
            </a>
          </div>
        </Reveal>

        <div className="nf__quick" aria-label="Where to go from here">
          <Reveal as="h2" y={16}>Or try one of these</Reveal>
          <Stagger className="nf__grid" delay={0.07}>
            {quick.map(q => (
              <StaggerItem key={q.to} as="div" className="nf__card-wrap">
                <Link to={q.to} className="nf__card">
                  <span className="nf__card-icon" aria-hidden="true"><q.icon size={22} aria-hidden="true" /></span>
                  <h3>{q.title}</h3>
                  <p>{q.desc}</p>
                  <span className="nf__card-more">Open <ArrowRight size={14} aria-hidden="true" /></span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
