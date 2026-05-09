import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Plus, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { contact } from '../data/contact.js';
import './Footer.css';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="container ftr__top">
        <div className="ftr__brand">
          <div className="ftr__brand-row">
            <span className="ftr__mark" aria-hidden="true"><Plus size={16} strokeWidth={3} aria-hidden="true" /></span>
            <span className="ftr__name">Arogya Dhaam</span>
          </div>
          <p className="ftr__tag">
            We bring a wealth of experience to heal and help you. Trusted multi-specialty care, expert doctors, and round-the-clock support.
          </p>
          <ul className="ftr__social" aria-label="Social media">
            <li><span className="ftr__social-disabled" aria-label="Facebook (coming soon)" role="img"><Facebook size={16} aria-hidden="true" /></span></li>
            <li><span className="ftr__social-disabled" aria-label="Twitter (coming soon)" role="img"><Twitter size={16} aria-hidden="true" /></span></li>
            <li><span className="ftr__social-disabled" aria-label="Instagram (coming soon)" role="img"><Instagram size={16} aria-hidden="true" /></span></li>
            <li><span className="ftr__social-disabled" aria-label="YouTube (coming soon)" role="img"><Youtube size={16} aria-hidden="true" /></span></li>
          </ul>
        </div>

        <div>
          <h4 className="ftr__h">Links</h4>
          <ul className="ftr__list">
            <li><Link to="/specialties">Services</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/doctors">Find a doctor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="ftr__h">Contact</h4>
          <ul className="ftr__list ftr__list--icons">
            <li>
              <MapPin size={14} aria-hidden="true" />
              <span>{contact.address.line1}, {contact.address.line2}</span>
            </li>
            <li>
              <Phone size={14} aria-hidden="true" />
              <a href={`tel:${contact.phone.appointment.replace(/\s/g, '')}`}>{contact.phone.appointment}</a>
            </li>
            <li>
              <Mail size={14} aria-hidden="true" />
              <a href={`mailto:${contact.email.general}`}>{contact.email.general}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="ftr__h">Hours</h4>
          <ul className="ftr__list">
            <li>{contact.hours.opd}</li>
            <li>{contact.hours.sunday}</li>
            <li className="ftr__list-emp">{contact.hours.emergency}</li>
          </ul>
        </div>
      </div>

      <div className="ftr__bottom">
        <div className="container ftr__bottom-inner">
          <p>© {year} Arogya Dhaam. All rights reserved.</p>
          <p className="ftr__muted">Information on this site is general guidance and does not replace medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
