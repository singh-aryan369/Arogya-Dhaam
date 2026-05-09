import { useState, useId } from 'react';
import { CalendarPlus, ShieldCheck, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { Reveal } from '../components/Motion.jsx';
import { specialties } from '../data/specialties.js';
import { doctors } from '../data/doctors.js';
import { contact } from '../data/contact.js';
import './Appointments.css';

const initial = {
  name: '',
  phone: '',
  email: '',
  specialty: '',
  doctor: '',
  date: '',
  notes: '',
  consent: false
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Appointments() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const ids = {
    name: useId(), phone: useId(), email: useId(), specialty: useId(),
    doctor: useId(), date: useId(), notes: useId(), consent: useId()
  };

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value, ...(field === 'specialty' ? { doctor: '' } : {}) }));
    if (errors[field]) setErrors(e => { const { [field]: _, ...rest } = e; return rest; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your full name.';
    if (!/^[+\d\s\-()]{8,}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number.';
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.specialty) e.specialty = 'Please choose a specialty.';
    if (!form.date) e.date = 'Please pick a preferred date.';
    if (!form.consent) e.consent = 'Please acknowledge the privacy notice.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) {
      const first = document.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    setSubmitted(true);
  };

  const filteredDoctors = form.specialty
    ? doctors.filter(d => d.specialty === form.specialty)
    : [];

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Confirmed" title="Thank you — your request is in." intro="A coordinator will call you within 30 minutes during OPD hours to confirm your slot." />
        <section className="section">
          <div className="container-narrow appt-success">
            <Reveal as="div" className="appt-success__card" y={20}>
              <CheckCircle2 size={42} aria-hidden="true" />
              <h2>What happens next?</h2>
              <ol>
                <li>You'll receive an SMS confirmation on <strong>{form.phone}</strong>.</li>
                <li>A patient coordinator will call to confirm date, time and reason for visit.</li>
                <li>Bring any prior reports or prescriptions to the appointment, if available.</li>
              </ol>
              <div className="appt-success__cta">
                <a href={`tel:${contact.phone.appointment.replace(/\s/g, '')}`} className="btn btn-primary">
                  <Phone size={16} aria-hidden="true" /> Call us instead · {contact.phone.appointment}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Book an appointment"
        title="Reach a specialist in under a minute."
        intro="Tell us a little about you and we'll confirm your slot. For emergencies please call our 24×7 ER directly."
      />

      <section className="section">
        <div className="container appt-grid">
          <Reveal as="form" className="appt-form" y={20} onSubmit={submit} noValidate aria-labelledby="appt-form-title">
            <h2 id="appt-form-title" className="visually-hidden">Appointment form</h2>

            <fieldset>
              <legend>Your details</legend>
              <div className="appt-row">
                <div className="field">
                  <label htmlFor={ids.name}>Full name <span aria-hidden="true">*</span></label>
                  <input
                    id={ids.name}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${ids.name}-err` : undefined}
                  />
                  {errors.name && <p id={`${ids.name}-err`} className="field-err" role="alert"><AlertCircle size={14} aria-hidden="true" /> {errors.name}</p>}
                </div>
                <div className="field">
                  <label htmlFor={ids.phone}>Phone <span aria-hidden="true">*</span></label>
                  <input
                    id={ids.phone}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="+91 9XXXX XXXXX"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? `${ids.phone}-err` : `${ids.phone}-hint`}
                  />
                  {errors.phone
                    ? <p id={`${ids.phone}-err`} className="field-err" role="alert"><AlertCircle size={14} aria-hidden="true" /> {errors.phone}</p>
                    : <p id={`${ids.phone}-hint`} className="field-hint">We'll send confirmation by SMS.</p>}
                </div>
              </div>
              <div className="field">
                <label htmlFor={ids.email}>Email <span className="field-optional">(optional)</span></label>
                <input
                  id={ids.email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${ids.email}-err` : undefined}
                />
                {errors.email && <p id={`${ids.email}-err`} className="field-err" role="alert"><AlertCircle size={14} aria-hidden="true" /> {errors.email}</p>}
              </div>
            </fieldset>

            <fieldset>
              <legend>What do you need?</legend>
              <div className="appt-row">
                <div className="field">
                  <label htmlFor={ids.specialty}>Specialty <span aria-hidden="true">*</span></label>
                  <select
                    id={ids.specialty}
                    value={form.specialty}
                    onChange={(e) => update('specialty', e.target.value)}
                    aria-invalid={!!errors.specialty}
                    aria-describedby={errors.specialty ? `${ids.specialty}-err` : undefined}
                  >
                    <option value="">Choose a specialty</option>
                    {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {errors.specialty && <p id={`${ids.specialty}-err`} className="field-err" role="alert"><AlertCircle size={14} aria-hidden="true" /> {errors.specialty}</p>}
                </div>
                <div className="field">
                  <label htmlFor={ids.doctor}>Preferred doctor <span className="field-optional">(optional)</span></label>
                  <select
                    id={ids.doctor}
                    value={form.doctor}
                    onChange={(e) => update('doctor', e.target.value)}
                    disabled={!form.specialty}
                  >
                    <option value="">No preference</option>
                    {filteredDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <p className="field-hint">{form.specialty ? `${filteredDoctors.length} consultant(s) available` : 'Pick a specialty first'}</p>
                </div>
              </div>
              <div className="field">
                <label htmlFor={ids.date}>Preferred date <span aria-hidden="true">*</span></label>
                <input
                  id={ids.date}
                  type="date"
                  min={todayISO()}
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? `${ids.date}-err` : undefined}
                />
                {errors.date && <p id={`${ids.date}-err`} className="field-err" role="alert"><AlertCircle size={14} aria-hidden="true" /> {errors.date}</p>}
              </div>
              <div className="field">
                <label htmlFor={ids.notes}>Reason for visit <span className="field-optional">(optional)</span></label>
                <textarea
                  id={ids.notes}
                  rows={4}
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Briefly describe your symptoms or reason for the visit."
                />
              </div>
            </fieldset>

            <div className="field appt-consent">
              <label htmlFor={ids.consent} className="appt-consent__label">
                <input
                  id={ids.consent}
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${ids.consent}-err` : undefined}
                />
                <span>
                  I understand my information will be used only for appointment coordination and is kept confidential.
                </span>
              </label>
              {errors.consent && <p id={`${ids.consent}-err`} className="field-err" role="alert"><AlertCircle size={14} aria-hidden="true" /> {errors.consent}</p>}
            </div>

            <button type="submit" className="btn btn-primary appt-submit">
              <CalendarPlus size={18} aria-hidden="true" /> Request appointment
            </button>
            <p className="appt-disclaimer">
              <ShieldCheck size={14} aria-hidden="true" /> For medical emergencies, please call <a href={`tel:${contact.phone.emergency.replace(/\s/g, '')}`}>{contact.phone.emergency}</a> directly.
            </p>
          </Reveal>

          <Reveal as="aside" className="appt-aside" y={20} delay={0.1}>
            <div className="card appt-aside__card">
              <h3>Need help over the phone?</h3>
              <p>Our patient coordinators are available during OPD hours.</p>
              <a href={`tel:${contact.phone.appointment.replace(/\s/g, '')}`} className="btn btn-ghost appt-aside__phone">
                <Phone size={16} aria-hidden="true" /> {contact.phone.appointment}
              </a>
              <ul className="appt-aside__list">
                <li><strong>OPD:</strong> {contact.hours.opd}</li>
                <li><strong>Sunday:</strong> {contact.hours.sunday}</li>
                <li><strong>Emergency:</strong> {contact.hours.emergency}</li>
              </ul>
            </div>
            <div className="card appt-aside__safe">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <strong>Privacy &amp; safety</strong>
                <p>Your information is handled per our patient confidentiality protocols. We never share data with third parties.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
