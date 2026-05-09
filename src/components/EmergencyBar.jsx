import { Phone, Ambulance, Clock } from 'lucide-react';
import { contact } from '../data/contact.js';
import './EmergencyBar.css';

export default function EmergencyBar() {
  return (
    <div className="emergency-bar" role="region" aria-label="Emergency contact">
      <div className="container emergency-bar__inner">
        <div className="emergency-bar__group">
          <Clock size={14} aria-hidden="true" />
          <span>Emergency · open 24×7</span>
        </div>
        <div className="emergency-bar__divider" aria-hidden="true" />
        <a className="emergency-bar__link" href={`tel:${contact.phone.emergency.replace(/\s/g, '')}`} aria-label={`Emergency phone ${contact.phone.emergency}`}>
          <Phone size={14} aria-hidden="true" />
          <span><strong>Emergency:</strong> {contact.phone.emergency}</span>
        </a>
        <div className="emergency-bar__divider" aria-hidden="true" />
        <a className="emergency-bar__link" href={`tel:${contact.phone.ambulance}`} aria-label={`Ambulance ${contact.phone.ambulance}`}>
          <Ambulance size={14} aria-hidden="true" />
          <span><strong>Ambulance:</strong> {contact.phone.ambulance}</span>
        </a>
      </div>
    </div>
  );
}
