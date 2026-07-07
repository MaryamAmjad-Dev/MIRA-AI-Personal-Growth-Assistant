import { useEffect, useState } from 'react';

export function useBrandVariant() {
  const [variant, setVariant] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 640) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setVariant('mobile');
      else if (w < 1024) setVariant('tablet');
      else setVariant('desktop');
    };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return variant;
}
