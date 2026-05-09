import { ShieldCheck, Heart, Users, Award, Sparkles, Microscope } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Section from '../components/Section.jsx';
import Stat from '../components/Stat.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { accreditations, stats } from '../data/contact.js';
import './About.css';

const values = [
  { icon: Heart, title: 'Patient-first', text: 'Every protocol, every interaction is designed around patient comfort, dignity and clear communication.' },
  { icon: ShieldCheck, title: 'Safety always', text: 'NABH-accredited safety standards, infection control, and audited quality across departments.' },
  { icon: Microscope, title: 'Evidence-based', text: 'Treatment plans grounded in current clinical guidelines and reviewed by multidisciplinary teams.' },
  { icon: Users, title: 'Team medicine', text: 'Specialists, nurses, technicians and counselors collaborate on every complex case.' }
];

const milestones = [
  { year: '1996', text: 'Founded as a 40-bed multi-specialty clinic.' },
  { year: '2003', text: 'Expanded to 150 beds with dedicated cardiac and orthopedic units.' },
  { year: '2010', text: 'NABH accreditation; first laparoscopic surgery program in the region.' },
  { year: '2016', text: 'Cancer day-care unit launched in partnership with leading oncology centers.' },
  { year: '2021', text: '350-bed full-service hospital, robotic surgery, integrated diagnostics.' },
  { year: '2024', text: 'Telemedicine platform live; home-care and chronic-care programs.' }
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Arogya Dhaam"
        title="Trusted healthcare. For 28 years and counting."
        intro="A multi-specialty hospital built around patients — where senior consultants, modern infrastructure, and compassionate teams meet every day."
      />

      <Section eyebrow="Our mission" title="Care that listens, treats, and heals.">
        <Reveal className="about-mission" y={18}>
          <p>
            Arogya Dhaam exists to deliver the highest standard of clinical care while keeping the
            patient experience human. We believe great medicine is the combination of clinical
            excellence, honest communication, and unhurried attention.
          </p>
          <p>
            Our consultants, nurses, technicians and support teams are united by a simple commitment —
            treat every patient as we would want our own family treated.
          </p>
        </Reveal>
      </Section>

      {/* Stats band */}
      <section className="section about-stats-section">
        <div className="container">
          <Stagger className="about-stats" delay={0.1}>
            {stats.map(s => (
              <StaggerItem key={s.label} as="div">
                <Stat value={s.value} suffix={s.suffix} label={s.label} isFloat={s.isFloat} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Section eyebrow="What we believe" title="Values that shape every decision" alt>
        <Stagger className="values" delay={0.08}>
          {values.map(v => (
            <StaggerItem key={v.title} as="article" className="card values__item">
              <span className="values__icon" aria-hidden="true"><v.icon size={20} aria-hidden="true" /></span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section eyebrow="Our journey" title="Three decades of progress">
        <Stagger as="ol" className="timeline" delay={0.08}>
          {milestones.map(m => (
            <StaggerItem key={m.year} as="li">
              <div className="timeline__year">{m.year}</div>
              <div className="timeline__text">{m.text}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section eyebrow="Accreditations" title="Independently audited and certified" alt>
        <Stagger className="accred-grid" delay={0.08}>
          {accreditations.map(a => (
            <StaggerItem key={a.code} as="div" className="accred">
              <Award size={20} aria-hidden="true" />
              <h3>{a.code}</h3>
              <p>{a.name}</p>
            </StaggerItem>
          ))}
          <StaggerItem as="div" className="accred">
            <Sparkles size={20} aria-hidden="true" />
            <h3>NQAS</h3>
            <p>National Quality Assurance Standards reviewed annually</p>
          </StaggerItem>
        </Stagger>
      </Section>
    </>
  );
}
