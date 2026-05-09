import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Award, Clock3, Languages, Stethoscope, CalendarPlus, Phone } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { specialties } from '../data/specialties.js';
import { contact } from '../data/contact.js';
import './DoctorModal.css';

const easeOut = [0.16, 1, 0.3, 1];

export default function DoctorModal({ doctor, onClose }) {
  const reduced = useReducedMotion();
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const scrollbarComp = window.innerWidth - html.clientWidth;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop:      body.style.top,
      bodyLeft:     body.style.left,
      bodyRight:    body.style.right,
      bodyWidth:    body.style.width,
      bodyPadRight: body.style.paddingRight
    };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    if (scrollbarComp > 0) body.style.paddingRight = `${scrollbarComp}px`;

    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top      = prev.bodyTop;
      body.style.left     = prev.bodyLeft;
      body.style.right    = prev.bodyRight;
      body.style.width    = prev.bodyWidth;
      body.style.paddingRight = prev.bodyPadRight;
      // Restore scroll synchronously, then again on next frame in case the
      // unlock-triggered reflow snaps the viewport elsewhere.
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!doctor) return null;

  const initials = doctor.name.split(' ').slice(-2).map(p => p[0]).join('');
  const specialtyLabel = specialties.find(s => s.id === doctor.specialty)?.name || doctor.specialty;
  const tel = contact.phone.appointment.replace(/\s/g, '');

  return (
    <m.div
      className="doc-modal__backdrop"
      role="presentation"
      onClick={onClose}
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, ease: easeOut }}
    >
      <m.div
        className="doc-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-modal-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: easeOut }}
      >
        <button
          type="button"
          className="doc-modal__close"
          onClick={onClose}
          aria-label="Close doctor details"
          ref={closeBtnRef}
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="doc-modal__scroll">
          <div className="doc-modal__head">
            <div className="doc-modal__avatar" aria-hidden="true">{initials}</div>
            <div className="doc-modal__head-text">
              <p className="doc-modal__spec-tag">
                <Stethoscope size={12} aria-hidden="true" /> {specialtyLabel}
              </p>
              <h2 id="doc-modal-title">{doctor.name}</h2>
              <p className="doc-modal__role">{doctor.role}</p>
              <p className="doc-modal__qual">{doctor.qualifications}</p>
            </div>
          </div>

          <div className="doc-modal__body">
            <p className="doc-modal__bio">{doctor.bio}</p>

            <ul className="doc-modal__meta">
              <li>
                <span className="doc-modal__meta-icon" aria-hidden="true"><Award size={16} aria-hidden="true" /></span>
                <div>
                  <strong>{doctor.experience}+ years</strong>
                  <span>Senior consultant experience</span>
                </div>
              </li>
              <li>
                <span className="doc-modal__meta-icon" aria-hidden="true"><Clock3 size={16} aria-hidden="true" /></span>
                <div>
                  <strong>OPD timing</strong>
                  <span>{doctor.timing}</span>
                </div>
              </li>
              <li>
                <span className="doc-modal__meta-icon" aria-hidden="true"><Languages size={16} aria-hidden="true" /></span>
                <div>
                  <strong>Languages</strong>
                  <span>{doctor.languages.join(', ')}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="doc-modal__cta">
          <Link to="/appointments" className="btn btn-primary" onClick={onClose}>
            <CalendarPlus size={16} aria-hidden="true" /> Book appointment
          </Link>
          <a href={`tel:${tel}`} className="doc-modal__phone">
            <Phone size={14} aria-hidden="true" /> Or call {contact.phone.appointment}
          </a>
        </div>

        <p className="doc-modal__privacy">
          Your information is confidential and used only for appointment coordination.
        </p>
      </m.div>
    </m.div>
  );
}
