import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

export function MotionRoot({ children }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}

const easeOut = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  shown:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
};
const fadeIn = {
  hidden: { opacity: 0 },
  shown:  { opacity: 1, transition: { duration: 0.5, ease: easeOut } }
};

export function Reveal({ children, as = 'div', y = 24, delay = 0, once = true, className, style, ...rest }) {
  const reduced = useReducedMotion();
  const Comp = m[as] || m.div;

  if (reduced) {
    const Static = as;
    return <Static className={className} style={style} {...rest}>{children}</Static>;
  }

  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut, delay } }}
      viewport={{ once, amount: 0.18 }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Stagger({ children, as = 'div', delay = 0.06, className, style, once = true, ...rest }) {
  const reduced = useReducedMotion();
  const Comp = m[as] || m.div;

  if (reduced) {
    const Static = as;
    return <Static className={className} style={style} {...rest}>{children}</Static>;
  }

  return (
    <Comp
      className={className}
      style={style}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount: 0.15 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: delay, delayChildren: 0.05 } }
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, as = 'div', y = 18, className, style, ...rest }) {
  const Comp = m[as] || m.div;
  return (
    <Comp
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y },
        shown:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export const motionFadeUp = fadeUp;
export const motionFadeIn = fadeIn;
export { m, useReducedMotion };
