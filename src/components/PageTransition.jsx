import { m, useReducedMotion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }
};

export default function PageTransition({ children }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <m.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </m.div>
  );
}
