import { m, useReducedMotion } from 'framer-motion';

const easeOut = [0.16, 1, 0.3, 1];

export default function PageHeader({ eyebrow, title, intro }) {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 18 };

  return (
    <header className="page-header">
      <div className="container">
        {eyebrow && (
          <m.p
            className="eyebrow"
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.05 }}
          >
            {eyebrow}
          </m.p>
        )}
        <m.h1
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
        >
          {title}
        </m.h1>
        {intro && (
          <m.p
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.28 }}
          >
            {intro}
          </m.p>
        )}
      </div>
    </header>
  );
}
