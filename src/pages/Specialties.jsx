import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Icon from '../components/Icon.jsx';
import { Stagger, StaggerItem } from '../components/Motion.jsx';
import { specialties } from '../data/specialties.js';
import './Specialties.css';

export default function Specialties() {
  return (
    <>
      <PageHeader
        eyebrow="What we treat"
        title="Specialties &amp; clinical services"
        intro="Multidisciplinary care across 20+ specialties — preventive, diagnostic, surgical and rehabilitative."
      />

      <section className="section">
        <div className="container">
          <Stagger className="spec-list" delay={0.06}>
            {specialties.map(s => (
              <StaggerItem key={s.id} as="article" className="spec-item card">
                <div className="spec-item__head">
                  <span className="spec-item__icon" aria-hidden="true"><Icon name={s.icon} size={26} /></span>
                  <div>
                    <h2>{s.name}</h2>
                    <p>{s.summary}</p>
                  </div>
                </div>
                <ul className="spec-item__list">
                  {s.procedures.map(p => (
                    <li key={p}><Check size={14} aria-hidden="true" /> {p}</li>
                  ))}
                </ul>
                <div className="spec-item__cta">
                  <Link to="/appointments" className="btn btn-ghost">Book consultation <ArrowRight size={14} aria-hidden="true" /></Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
