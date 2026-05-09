import { Check } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { Stagger, StaggerItem } from '../components/Motion.jsx';
import { departments } from '../data/departments.js';
import './Departments.css';

export default function Departments() {
  return (
    <>
      <PageHeader
        eyebrow="Inside Arogya Dhaam"
        title="Departments &amp; facilities"
        intro="Modern infrastructure, modular operating theatres, and round-the-clock critical care — built for outcomes and patient comfort."
      />

      <section className="section">
        <div className="container">
          <Stagger className="dept-grid" delay={0.07}>
            {departments.map((d, i) => (
              <StaggerItem key={d.id} as="article" className={`dept ${i === 0 ? 'dept--feature' : ''}`}>
                <h2>{d.name}</h2>
                <p className="dept__desc">{d.desc}</p>
                <ul className="dept__list">
                  {d.facilities.map(f => (
                    <li key={f}><Check size={14} aria-hidden="true" /> {f}</li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
