import { Reveal } from './Motion.jsx';

export default function Section({ eyebrow, title, intro, alt, narrow, children, id }) {
  return (
    <section id={id} className={`section ${alt ? 'section-alt' : ''}`}>
      <div className={narrow ? 'container-narrow' : 'container'}>
        {(eyebrow || title || intro) && (
          <Reveal as="header" className="section__head" y={20}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {intro && <p className="section__intro">{intro}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
