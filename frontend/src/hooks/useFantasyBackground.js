import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);

  return mobile;
}

export function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Fairies: max 20px desktop, max 16px mobile */
export function getFairySize(isMobile, seed) {
  if (isMobile) return 12 + seededRandom(seed) * 4;
  return 14 + seededRandom(seed) * 6;
}

/** Butterflies: max 16px desktop, max 14px mobile */
export function getButterflySize(isMobile, seed) {
  if (isMobile) return 10 + seededRandom(seed) * 4;
  return 11 + seededRandom(seed) * 5;
}

/**
 * Performance limits:
 * Desktop — fairies 5, butterflies 12, stars 40
 * Mobile — fairies 2, butterflies 5, stars 15
 * @param {'full'|'soft'} intensity — soft = auth emphasis
 */
export function useFantasyConfig(intensity = 'full') {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const isAuth = intensity === 'soft';
  const appScale = isAuth ? 1 : 0.75;

  if (reducedMotion) {
    return {
      fairies: 1,
      butterflies: 2,
      stars: 8,
      sparkles: 3,
      dust: 4,
      bubbles: 3,
      flowers: 2,
      blobs: 2,
      parallax: false,
      animate: false,
      emphasis: isAuth,
      isMobile,
    };
  }

  if (isMobile) {
    return {
      fairies: 2,
      butterflies: 4,
      stars: 18,
      sparkles: Math.round(8 * appScale),
      dust: Math.round(10 * appScale),
      bubbles: Math.round(6 * appScale),
      flowers: Math.round(6 * appScale),
      clouds: 3,
      blobs: 2,
      parallax: false,
      animate: true,
      emphasis: isAuth,
      isMobile: true,
    };
  }

  return {
    fairies: 4,
    butterflies: 8,
    stars: Math.min(40, Math.round(36 * appScale)),
    sparkles: Math.round(14 * appScale),
    dust: Math.round(16 * appScale),
    bubbles: Math.round(12 * appScale),
    flowers: Math.round(10 * appScale),
    clouds: isAuth ? 4 : 3,
    blobs: isAuth ? 4 : 3,
    parallax: true,
    animate: true,
    emphasis: isAuth,
    isMobile: false,
  };
}

export function useParallax(enabled) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      setOffset({ x: 0, y: 0 });
      return undefined;
    }

    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [enabled]);

  return offset;
}
