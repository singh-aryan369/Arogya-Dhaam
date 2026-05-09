import { Phone, Mail, MapPin, Clock, Ambulance, Navigation } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { contact } from '../data/contact.js';
import './Contact.css';

export default function Contact() {
  const tel = (n) => n.replace(/\s/g, '');
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="We're here, every day."
        intro="Reach us for appointments, queries, or emergencies. Our patient coordinators respond within 30 minutes during OPD hours."
      />

      <section className="section">
        <div className="container contact-grid">
          <Stagger className="contact-cards" delay={0.07}>
            <StaggerItem as="article" className="contact-card">
              <span className="contact-card__icon" aria-hidden="true"><Phone size={20} aria-hidden="true" /></span>
              <h3>Appointments</h3>
              <p><a href={`tel:${tel(contact.phone.appointment)}`}>{contact.phone.appointment}</a></p>
              <p className="contact-card__sub">Mon – Sat · 8 AM – 8 PM</p>
            </StaggerItem>
            <StaggerItem as="article" className="contact-card contact-card--alert">
              <span className="contact-card__icon" aria-hidden="true"><Ambulance size={20} aria-hidden="true" /></span>
              <h3>Emergency &amp; Ambulance</h3>
              <p>
                <a href={`tel:${tel(contact.phone.emergency)}`}>{contact.phone.emergency}</a> ·
                {' '}<a href={`tel:${contact.phone.ambulance}`}>Ambulance {contact.phone.ambulance}</a>
              </p>
              <p className="contact-card__sub">24×7 · Triage in &lt; 5 minutes</p>
            </StaggerItem>
            <StaggerItem as="article" className="contact-card">
              <span className="contact-card__icon" aria-hidden="true"><Mail size={20} aria-hidden="true" /></span>
              <h3>Email</h3>
              <p><a href={`mailto:${contact.email.general}`}>{contact.email.general}</a></p>
              <p><a href={`mailto:${contact.email.appointments}`}>{contact.email.appointments}</a></p>
            </StaggerItem>
            <StaggerItem as="article" className="contact-card">
              <span className="contact-card__icon" aria-hidden="true"><Clock size={20} aria-hidden="true" /></span>
              <h3>Hours</h3>
              <p>{contact.hours.opd}</p>
              <p>{contact.hours.sunday}</p>
              <p className="contact-card__sub">{contact.hours.emergency}</p>
            </StaggerItem>
          </Stagger>

          <Reveal as="aside" className="contact-map" y={20} delay={0.15}>
            <div className="contact-map__head">
              <h3><MapPin size={18} aria-hidden="true" /> Visit us</h3>
              <p>{contact.address.line1}<br />{contact.address.line2}</p>
            </div>
            <div className="contact-map__frame" role="img" aria-label="Hospital location map placeholder">
              <div className="contact-map__placeholder">
                <MapPin size={28} aria-hidden="true" />
                <span>{contact.name}</span>
              </div>
            </div>
            <a
              className="btn btn-primary contact-map__cta"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${contact.address.line1}, ${contact.address.line2}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation size={16} aria-hidden="true" /> Open in Maps
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
