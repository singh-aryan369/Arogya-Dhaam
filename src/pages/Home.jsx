import { Link } from 'react-router-dom';
import {
  Clock, UserCheck, Ambulance, Activity, Play, ArrowRight,
  CalendarPlus, Phone, ChevronRight
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import HeroIllustration from '../components/HeroIllustration.jsx';
import Section from '../components/Section.jsx';
import DoctorModal from '../components/DoctorModal.jsx';
import { Reveal, Stagger, StaggerItem, m, useReducedMotion } from '../components/Motion.jsx';
import { doctors } from '../data/doctors.js';
import { posts } from '../data/blog.js';
import { contact } from '../data/contact.js';
import { useState, useId } from 'react';
import { specialties } from '../data/specialties.js';
import './Home.css';

const featuredDoctors = doctors.slice(0, 4);
const featuredPosts = posts.slice(0, 3);

const services = [
  { icon: Clock, title: '24 Hours Service', desc: 'Round-the-clock OPD, ER, pharmacy and lab support — we are open every day, every hour.' },
  { icon: UserCheck, title: 'Qualified Doctors', desc: 'Board-certified senior consultants with verified credentials across 20+ specialties.' },
  { icon: Ambulance, title: 'Emergency Care', desc: 'Triage in under 5 minutes, dedicated trauma bay and a 24×7 ambulance fleet.' },
  { icon: Activity, title: 'Operation Theater', desc: 'Modular OTs with HEPA filtration, robotic surgery, and integrated imaging.' }
];

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const easeOut = [0.16, 1, 0.3, 1];

export default function Home() {
  const reduced = useReducedMotion();
  const [openDoc, setOpenDoc] = useState(null);

  return (
    <>
      {/* HERO — diagonal teal block */}
      <section className="hero" aria-label="Welcome">
        <div className="hero__shape" aria-hidden="true"></div>
        <div className="container hero__inner">
          <m.div
            className="hero__copy"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          >
            <h1>A Wealth of Experience To<br /><span>Heal And Help You.</span></h1>
            <m.p
              className="hero__lead"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.28 }}
            >
              Multi-specialty care led by senior consultants, a 24/7 emergency room, and patient-first protocols built up over nearly three decades.
            </m.p>
            <m.div
              className="hero__cta"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.42 }}
            >
              <Link to="/about" className="btn btn-light">Get More</Link>
              <Link to="/appointments" className="btn btn-outline-light">Make an Appointment</Link>
            </m.div>
          </m.div>
          <m.div
            className="hero__visual"
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
          >
            <m.div
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <HeroIllustration />
            </m.div>
          </m.div>
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="svc">
        <div className="container">
          <Stagger className="svc__inner" delay={0.08}>
            {services.map((s, i) => (
              <StaggerItem key={s.title} as="article" className={`svc__card ${i === 1 ? 'svc__card--accent' : ''}`}>
                <span className="svc__icon" aria-hidden="true"><s.icon size={26} aria-hidden="true" /></span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ABOUT SPLIT */}
      <section className="section about-split">
        <div className="container about-split__inner">
          <Reveal className="about-split__copy" y={28}>
            <p className="eyebrow">About us</p>
            <h2>Medicare Supplement<br />Advocate</h2>
            <p>
              We've spent nearly three decades doing one thing — helping families get the right care from the right specialist at the right time. Our protocols are evidence-based and our teams are trained to make every visit feel calm, unhurried and clear.
            </p>
            <p>
              From routine checkups to complex interventions, you'll see senior consultants from the first appointment, supported by modern diagnostics and round-the-clock care.
            </p>
            <Link to="/about" className="btn btn-primary about-split__cta">Read More</Link>
          </Reveal>
          <Reveal className="about-split__visual" y={28} delay={0.12} aria-hidden="true">
            <div className="about-split__img">
              <div className="about-split__layers">
                <span className="about-split__layer about-split__layer--a"></span>
                <span className="about-split__layer about-split__layer--b"></span>
                <span className="about-split__layer about-split__layer--c"></span>
              </div>
              <button type="button" className="about-split__play" aria-label="Play introduction video">
                <Play size={22} fill="currentColor" aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <Section eyebrow="Specialists" title="Our Expert Team" intro="Senior consultants with decades of combined experience and patient-first values. Tap a card to view full credentials." narrow={false}>
        <Stagger className="team" delay={0.08}>
          {featuredDoctors.map(d => (
            <StaggerItem key={d.id} as="div" className="team__card-wrap">
              <button
                type="button"
                className="team__card"
                onClick={() => setOpenDoc(d)}
                aria-haspopup="dialog"
                aria-label={`View details for ${d.name}, ${d.role}`}
              >
                <div className="team__avatar" aria-hidden="true">
                  {d.name.split(' ').slice(-2).map(p => p[0]).join('')}
                </div>
                <h3 className="team__name">{d.name}</h3>
                <p className="team__role">{d.role.replace(/^.*?— /, '')}</p>
                <p className="team__meta">{d.experience}+ yrs · {d.languages.slice(0, 2).join(', ')}</p>
                <span className="team__more">
                  View profile <ArrowRight size={14} aria-hidden="true" />
                </span>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="section__cta" delay={0.1}>
          <Link to="/doctors" className="btn btn-ghost">View all doctors <ArrowRight size={16} aria-hidden="true" /></Link>
        </Reveal>
      </Section>

      <AnimatePresence>
        {openDoc && (
          <DoctorModal doctor={openDoc} onClose={() => setOpenDoc(null)} />
        )}
      </AnimatePresence>

      {/* APPOINTMENT */}
      <AppointmentMini />

      {/* NEWS & EVENTS */}
      <Section eyebrow="From the journal" title="News & Events" intro="Practical, plainly written articles from our consultants." alt>
        <Stagger className="news" delay={0.1}>
          {featuredPosts.map(p => (
            <StaggerItem key={p.id} as="div" className={`news__card-wrap`}>
              <Link to={`/blog/${p.id}`} className={`news__card news__card--${p.tone}`}>
                <div className="news__cover" aria-hidden="true">
                  <span className={`news__cover-mark news__cover-mark--${p.tone}`}>
                    <Activity size={28} aria-hidden="true" />
                  </span>
                </div>
                <div className="news__body">
                  <p className="news__meta">{fmtDate(p.date)} · {p.category}</p>
                  <h3>{p.title}</h3>
                  <p className="news__excerpt">{p.excerpt}</p>
                  <span className="news__more">Read article <ChevronRight size={14} aria-hidden="true" /></span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="section__cta" delay={0.1}>
          <Link to="/blog" className="btn btn-ghost">All articles <ArrowRight size={16} aria-hidden="true" /></Link>
        </Reveal>
      </Section>
    </>
  );
}

/* Inline mini appointment block — matches Figma's centered form */
function AppointmentMini() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', dept: '', notes: '', when: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const ids = {
    name: useId(), email: useId(), phone: useId(), dept: useId(), notes: useId(), when: useId()
  };

  const upd = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const { [k]: _, ...rest } = e; return rest; });
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^[+\d\s\-()]{8,}$/.test(form.phone.trim())) e.phone = 'Valid phone required';
    if (!form.dept) e.dept = 'Required';
    if (!form.when) e.when = 'Required';
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    if (Object.keys(e).length) return;
    setDone(true);
  };

  return (
    <section className="section appt-mini" aria-label="Appointment">
      <div className="container">
        <Reveal className="appt-mini__shell" y={28}>
          <div className="appt-mini__head">
            <h2>Make an Appointment</h2>
            <p>Tell us a little about you and we'll confirm your slot within 30 minutes.</p>
          </div>

          {done ? (
            <div className="appt-mini__done" role="status">
              <h3>Thank you, {form.name.split(' ')[0] || 'friend'}!</h3>
              <p>Your request has been received. A coordinator will call <strong>{form.phone}</strong> shortly.</p>
              <div className="appt-mini__done-cta">
                <Link to="/appointments" className="btn btn-ghost">Open full booking page</Link>
              </div>
            </div>
          ) : (
            <form className="appt-mini__form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor={ids.name}>Full name</label>
                <input id={ids.name} type="text" autoComplete="name" value={form.name} onChange={(e) => upd('name', e.target.value)} aria-invalid={!!errors.name} required />
              </div>
              <div className="field">
                <label htmlFor={ids.email}>Email</label>
                <input id={ids.email} type="email" autoComplete="email" value={form.email} onChange={(e) => upd('email', e.target.value)} aria-invalid={!!errors.email} />
              </div>
              <div className="field">
                <label htmlFor={ids.phone}>Phone number</label>
                <input id={ids.phone} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => upd('phone', e.target.value)} aria-invalid={!!errors.phone} required />
              </div>
              <div className="field">
                <label htmlFor={ids.dept}>Department</label>
                <select id={ids.dept} value={form.dept} onChange={(e) => upd('dept', e.target.value)} aria-invalid={!!errors.dept} required>
                  <option value="">Select a department</option>
                  {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="field appt-mini__full">
                <label htmlFor={ids.notes}>Additional information</label>
                <input id={ids.notes} type="text" value={form.notes} onChange={(e) => upd('notes', e.target.value)} placeholder="Briefly describe your reason for the visit." />
              </div>
              <div className="field appt-mini__full">
                <label htmlFor={ids.when}>Date and time</label>
                <input id={ids.when} type="datetime-local" value={form.when} onChange={(e) => upd('when', e.target.value)} aria-invalid={!!errors.when} required />
              </div>
              {Object.keys(errors).length > 0 && (
                <p className="appt-mini__err appt-mini__full" role="alert">
                  Please complete the highlighted fields.
                </p>
              )}
              <p className="appt-mini__privacy appt-mini__full">
                Your information is confidential and used only for appointment coordination.
              </p>
              <div className="appt-mini__submit appt-mini__full">
                <button type="submit" className="btn btn-primary"><CalendarPlus size={18} aria-hidden="true" /> Confirm</button>
                <a href={`tel:${contact.phone.appointment.replace(/\s/g, '')}`} className="appt-mini__phone">
                  <Phone size={14} aria-hidden="true" /> Or call {contact.phone.appointment}
                </a>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
