/** Device-aware rendering tiers for the data lab. */
export type Tier = 'none' | 'low' | 'mid' | 'high';

function query(name: string) {
  return typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get(name) : null;
}

export function hasWebGL(): boolean {
  if (typeof window === 'undefined' || query('nogl') !== null) return false;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  if (query('calm') !== null) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function detectTier(): Tier {
  if (!hasWebGL()) return 'none';
  const forced = query('tier');
  if (forced === 'low' || forced === 'mid' || forced === 'high') return forced;
  const w = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (w < 700 || (coarse && w < 1000) || mem <= 2 || cores <= 2) return 'low';
  if (w < 1200 || coarse || mem <= 4 || cores <= 4) return 'mid';
  return 'high';
}

export const tierSettings = {
  low: { points: 1800, dpr: [1, 1.25] as [number, number], antialias: false },
  mid: { points: 3600, dpr: [1, 1.5] as [number, number], antialias: true },
  high: { points: 6000, dpr: [1, 1.75] as [number, number], antialias: true },
};
