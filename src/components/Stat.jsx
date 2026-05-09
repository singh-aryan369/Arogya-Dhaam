import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Stat({ value, suffix = '', label, isFloat }) {
  const [n, setN] = useState(prefersReducedMotion() ? value : 0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1400;
          const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = isFloat ? +(value * eased).toFixed(1) : Math.round(value * eased);
            setN(cur);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, isFloat]);

  return (
    <div ref={ref} className="stat">
      <p className="stat__num">
        <span>{n}</span><span className="stat__suffix">{suffix}</span>
      </p>
      <p className="stat__label">{label}</p>
    </div>
  );
}
