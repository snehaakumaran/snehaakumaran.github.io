import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { vizEmbedUrl, vizPageUrl, vizzes } from '../content';
import { useProjects } from './projectsContext';
import { KindGlyph } from './KindGlyph';
import { VizPreview } from './VizPreview';

/** Height of Tableau's embed toolbar (":toolbar=bottom"), in dashboard pixels. */
const TOOLBAR = 27;
/** Give up waiting for the embed after this long and offer the direct link. */
const TIMEOUT_MS = 25000;

type Phase = 'idle' | 'loading' | 'ready' | 'failed';

/**
 * The dashboard viewer. The Tableau iframe is created only when a visualization is
 * opened (never on page load), rendered at the dashboard's real size and scaled to
 * fit, so a fixed-size Tableau layout never overflows the screen. Until it has
 * loaded, the preview stays in place; if it can't load, a direct link replaces it.
 */
export function VizViewer() {
  const { vizId, closeViz } = useProjects();
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viz = vizzes.find((v) => v.id === vizId) ?? null;

  const [phase, setPhase] = useState<Phase>('idle');
  const [scale, setScale] = useState(0);
  const [full, setFull] = useState(false);
  const canFull = typeof document !== 'undefined' && !!document.fullscreenEnabled;

  // Open / close the native dialog with the selected visualization.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (viz && !d.open) d.showModal();
    if (!viz && d.open) d.close();
  }, [viz]);

  // On wide screens the live dashboard loads straight away; on phones the visitor
  // chooses (a full Tableau dashboard is heavy on mobile data).
  useEffect(() => {
    if (!viz) return setPhase('idle');
    const wide = window.matchMedia('(min-width: 700px)').matches;
    setPhase(wide ? (navigator.onLine === false ? 'failed' : 'loading') : 'idle');
  }, [viz]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = window.setTimeout(() => setPhase('failed'), TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Scale the fixed-size dashboard to the space available.
  const fit = useCallback(() => {
    const el = stage.current;
    if (!el || !viz) return;
    const [w, h] = viz.size;
    const fs = document.fullscreenElement === el;
    const availW = el.clientWidth;
    const availH = fs ? window.innerHeight - 24 : Math.max(260, window.innerHeight * 0.66);
    setScale(Math.min(1, availW / w, availH / (h + TOOLBAR)));
  }, [viz]);

  useLayoutEffect(() => {
    if (!viz) return;
    fit();
    const el = stage.current;
    const ro = new ResizeObserver(fit);
    if (el) ro.observe(el);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [viz, fit]);

  useEffect(() => {
    const on = () => {
      setFull(document.fullscreenElement === stage.current);
      requestAnimationFrame(fit);
    };
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, [fit]);

  const toggleFull = () => {
    const el = stage.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen().catch(() => {});
  };

  const onClose = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    closeViz();
  };

  const w = viz ? viz.size[0] : 0;
  const h = viz ? viz.size[1] + TOOLBAR : 0;
  const live = phase === 'loading' || phase === 'ready';

  return (
    <dialog
      ref={dialog}
      className="modal viz-modal k-bi"
      aria-labelledby="viz-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {viz && (
        <div className="viz-modal-body">
          <header className="viz-head">
            <p className="modal-kind">
              <KindGlyph kind="bi" />
              Tableau Public · {viz.domain}
            </p>
            <h3 id="viz-title" className="modal-title">
              {viz.title}
            </h3>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close dashboard viewer">
              <span aria-hidden="true" />
            </button>
          </header>

          <div ref={stage} className={`viz-stage ${full ? 'is-full' : ''}`}>
            <div className="viz-canvas" style={{ width: w * scale, height: h * scale }}>
              {/* Preview underneath until the live dashboard has loaded. */}
              {phase !== 'ready' && (
                <div className={`viz-poster ${phase === 'loading' ? 'is-loading' : ''}`}>
                  <VizPreview viz={viz} eager />
                </div>
              )}
              {live && scale > 0 && (
                <iframe
                  key={viz.id}
                  className={`viz-iframe ${phase === 'ready' ? 'is-ready' : ''}`}
                  title={`${viz.title} — interactive Tableau dashboard`}
                  src={vizEmbedUrl(viz)}
                  width={w}
                  height={h}
                  style={{ transform: `scale(${scale})` }}
                  allowFullScreen
                  onLoad={() => window.setTimeout(() => setPhase((p) => (p === 'loading' ? 'ready' : p)), 400)}
                />
              )}
              {phase === 'loading' && (
                <p className="viz-status" role="status">
                  <span className="viz-spin" aria-hidden="true" /> Loading interactive dashboard…
                </p>
              )}
              {phase === 'idle' && (
                <div className="viz-overlay">
                  <button type="button" className="btn btn-solid" onClick={() => setPhase('loading')}>
                    Load interactive dashboard
                  </button>
                  <a className="text-btn" href={vizPageUrl(viz)} target="_blank" rel="noreferrer">
                    Open on Tableau Public <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
              {phase === 'failed' && (
                <div className="viz-overlay" role="alert">
                  <p>The interactive view couldn’t load here.</p>
                  <a className="btn btn-solid" href={vizPageUrl(viz)} target="_blank" rel="noreferrer">
                    Open interactive dashboard <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </div>
            {full && (
              <button type="button" className="viz-exit" onClick={toggleFull}>
                Exit full screen
              </button>
            )}
          </div>

          <div className="viz-tools">
            {canFull && live && (
              <button type="button" className="text-btn" onClick={toggleFull}>
                Full screen <span aria-hidden="true">⤢</span>
              </button>
            )}
            {live && (
              <a className="text-btn" href={vizPageUrl(viz)} target="_blank" rel="noreferrer">
                Open on Tableau Public <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          {viz.note && <p className="viz-note">{viz.note}</p>}

          <dl className="modal-fields viz-fields">
            <div>
              <dt>What it shows</dt>
              <dd>{viz.summary}</dd>
            </div>
            <div>
              <dt>Built with</dt>
              <dd>
                <ul className="tags">
                  <li>Tableau</li>
                  {viz.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </dialog>
  );
}
