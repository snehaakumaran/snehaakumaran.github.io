import { useEffect, useRef } from 'react';
import { lab, STATES } from '../lib/lab';
import { tierSettings, detectTier } from '../lib/device';

/**
 * A small lab readout naming the data state the 3D system is in. The point
 * count is the real number of points being rendered on this device.
 */
export function LabHud({ webgl }: { webgl: boolean }) {
  const stateRef = useRef<HTMLSpanElement>(null);
  const idxRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const tier = detectTier();
  const n = tier === 'none' ? 0 : tierSettings[tier].points;

  useEffect(() => {
    let raf = 0;
    let last = -1;
    let lastP = -1;
    const tick = () => {
      const s = lab.stateIndex;
      if (s !== last) {
        last = s;
        if (stateRef.current) stateRef.current.textContent = STATES[s];
        if (idxRef.current) idxRef.current.textContent = `${String(s + 1).padStart(2, '0')} / ${String(STATES.length).padStart(2, '0')}`;
      }
      const p = Math.round(lab.progress * 200) / 200;
      if (p !== lastP && barRef.current) {
        lastP = p;
        barRef.current.style.transform = `scaleX(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!webgl) return null;
  return (
    <aside className="hud" aria-hidden="true">
      <div className="hud-row">
        <span className="hud-k">Dataset</span>
        <span className="hud-v">n = {n.toLocaleString('en-US')} points</span>
      </div>
      <div className="hud-row">
        <span className="hud-k">State</span>
        <span className="hud-v">
          <span ref={idxRef}>01 / 08</span> · <span ref={stateRef}>{STATES[0]}</span>
        </span>
      </div>
      <span className="hud-bar">
        <span ref={barRef} />
      </span>
    </aside>
  );
}
