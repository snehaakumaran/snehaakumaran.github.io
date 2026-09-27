/**
 * The bridge between the page and the 3D lab. DOM listeners write here; the
 * render loop reads every frame. No React re-renders on scroll.
 */
export const SECTION_IDS = [
  'home',
  'about',
  'experience',
  'projects',
  'bi',
  'ml',
  'ticketing',
  'skills',
  'education',
  'certifications',
  'contact',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** The data states the point system moves through. */
export const STATES = [
  'Raw data',
  'Connected network',
  'Data pipeline',
  'Project universe',
  'Dashboard',
  'Analytical model',
  'Relational tables',
  'Insight surface',
] as const;

/**
 * For each section: which data state the points take, and where the structure
 * sits so it frames the copy (x: horizontal offset on wide screens, dim: how
 * strongly it recedes behind interactive content).
 */
export const SECTION_SCENE: { state: number; x: number; y: number; scale: number; dim: number; spin: number }[] = [
  { state: 0, x: 2.55, y: 0.3, scale: 0.78, dim: 1, spin: 0.35 }, //   home — raw data cube
  { state: 1, x: -2.1, y: -0.3, scale: 0.85, dim: 0.55, spin: 0.15 }, // about — network behind the profile graph
  { state: 2, x: 0, y: -2.3, scale: 0.9, dim: 0.6, spin: 0 }, //        experience — pipeline under the stages
  { state: 3, x: 0, y: -0.1, scale: 1.05, dim: 0.5, spin: 0.2 }, //     projects — universe
  { state: 4, x: 2.5, y: -0.2, scale: 0.95, dim: 0.7, spin: 0.25 }, //  bi — dashboard bars
  { state: 5, x: 2.5, y: 0, scale: 0.95, dim: 0.7, spin: 0.1 }, //      ml — model layers
  { state: 6, x: 2.5, y: 0, scale: 0.95, dim: 0.7, spin: 0.2 }, //      ticketing — tables
  { state: 1, x: 0, y: 0, scale: 1.2, dim: 0.35, spin: 0.12 }, //       skills — network again
  { state: 7, x: 0, y: -0.6, scale: 1.1, dim: 0.45, spin: 0.06 }, //    education — insight surface
  { state: 7, x: 0, y: -0.8, scale: 1.1, dim: 0.4, spin: 0.06 }, //     certifications
  { state: 7, x: 0, y: -0.2, scale: 1.25, dim: 0.8, spin: 0.08 }, //    contact
];

export const lab = {
  progress: 0,
  section: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  reducedMotion: false,
  /** Set by the scene: the data state currently dominant (for the HUD). */
  stateIndex: 0,
  /** Projects/skills hover energy. */
  focus: 0,
};

let offsets: number[] = [];
let lastY = 0;
let lastT = 0;

function measure() {
  offsets = SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
}

function update() {
  const y = window.scrollY;
  const doc = document.documentElement.scrollHeight;
  lab.progress = Math.min(1, Math.max(0, y / Math.max(1, doc - window.innerHeight)));
  const probe = y + window.innerHeight * 0.5;
  let s = 0;
  for (let i = 0; i < offsets.length; i++) {
    const start = offsets[i];
    const end = i + 1 < offsets.length ? offsets[i + 1] : doc;
    if (probe >= start) s = i + Math.min(1, (probe - start) / Math.max(1, end - start));
  }
  lab.section = s;
  const now = performance.now();
  const dt = Math.max(16, now - lastT);
  lab.velocity = Math.max(lab.velocity, Math.min(1, Math.abs(y - lastY) / dt / 3));
  lastY = y;
  lastT = now;
}

export function startLab(): () => void {
  measure();
  update();
  let raf = 0;
  let prev = performance.now();
  const decay = (now: number) => {
    const dt = Math.min(0.1, (now - prev) / 1000);
    prev = now;
    lab.velocity *= Math.pow(0.05, dt);
    raf = requestAnimationFrame(decay);
  };
  raf = requestAnimationFrame(decay);
  const onScroll = () => update();
  const onResize = () => {
    measure();
    update();
  };
  const onPointer = (e: PointerEvent) => {
    lab.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    lab.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(document.body);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onPointer, { passive: true });
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointer);
  };
}
