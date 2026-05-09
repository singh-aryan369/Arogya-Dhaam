import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './RouteProgress.css';

export default function RouteProgress() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    let raf, t1, t2;
    setPhase('start');
    raf = requestAnimationFrame(() => {
      setPhase('grow');
      t1 = setTimeout(() => setPhase('finish'), 360);
      t2 = setTimeout(() => setPhase('idle'), 700);
    });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <div className="route-progress" aria-hidden="true">
      <div className={`route-progress__bar route-progress__bar--${phase}`} />
    </div>
  );
}
