import { useMemo, useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { Search, Award, Clock3, Languages, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { Reveal, m, useReducedMotion } from '../components/Motion.jsx';
import { AnimatePresence } from 'framer-motion';
import { doctors } from '../data/doctors.js';
import { specialties } from '../data/specialties.js';
import './Doctors.css';

const easeOut = [0.16, 1, 0.3, 1];

export default function Doctors() {
  const [q, setQ] = useState('');
  const [spec, setSpec] = useState('all');
  const searchId = useId();
  const specId = useId();
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return doctors.filter(d => {
      const matchSpec = spec === 'all' || d.specialty === spec;
      const matchQ = !s ||
        d.name.toLowerCase().includes(s) ||
        d.role.toLowerCase().includes(s) ||
        d.qualifications.toLowerCase().includes(s);
      return matchSpec && matchQ;
    });
  }, [q, spec]);

  const specialtyLabel = (id) => specialties.find(s => s.id === id)?.name || id;

  return (
    <>
      <PageHeader
        eyebrow="Find a doctor"
        title="Senior consultants, ready to help"
        intro="Search by name, qualification or specialty. All doctors are senior consultants with verified credentials."
      />

      <section className="section">
        <div className="container">
          <Reveal className="doc-toolbar" role="search" y={16}>
            <div className="doc-toolbar__field">
              <label htmlFor={searchId} className="doc-toolbar__label">
                <Search size={16} aria-hidden="true" /> Search by name or qualification
              </label>
              <input
                id={searchId}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. cardiology, MD, Dr. Priya"
                autoComplete="off"
              />
            </div>
            <div className="doc-toolbar__field">
              <label htmlFor={specId} className="doc-toolbar__label">Specialty</label>
              <select id={specId} value={spec} onChange={(e) => setSpec(e.target.value)}>
                <option value="all">All specialties</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </Reveal>

          <p className="doc-count" aria-live="polite">
            Showing <strong>{filtered.length}</strong> of {doctors.length} consultants
          </p>

          <m.div className="doc-grid" layout={!reduced}>
            <AnimatePresence mode="popLayout">
              {filtered.map((d, i) => (
                <m.article
                  key={d.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.45, ease: easeOut, delay: Math.min(i, 6) * 0.04 }}
                  className="doc-row card"
                >
                  <div className="doc-row__avatar" aria-hidden="true">
                    {d.name.split(' ').slice(-2).map(p => p[0]).join('')}
                  </div>
                  <div className="doc-row__main">
                    <h3>{d.name}</h3>
                    <p className="doc-row__role">{d.role}</p>
                    <p className="doc-row__qual">{d.qualifications}</p>
                    <p className="doc-row__bio">{d.bio}</p>
                    <ul className="doc-row__meta">
                      <li><Award size={14} aria-hidden="true" /> {d.experience} years experience</li>
                      <li><Clock3 size={14} aria-hidden="true" /> {d.timing}</li>
                      <li><Languages size={14} aria-hidden="true" /> {d.languages.join(', ')}</li>
                      <li className="doc-row__spec-tag">{specialtyLabel(d.specialty)}</li>
                    </ul>
                  </div>
                  <div className="doc-row__cta">
                    <Link to="/appointments" className="btn btn-primary">Book <ArrowRight size={14} aria-hidden="true" /></Link>
                  </div>
                </m.article>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <p className="doc-empty">No doctors match your search. Try clearing filters.</p>
            )}
          </m.div>
        </div>
      </section>
    </>
  );
}
