import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function AnimatedCounter({ value = 0, className = '' }) {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 60, damping: 18 });

  useEffect(() => {
    spring.set(Number(value) || 0);
    const unsub = spring.on('change', (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [value, spring]);

  return <motion.span className={`animated-counter ${className}`}>{display}</motion.span>;
}
