import { useRef, useState, type PointerEvent } from 'react';
import { lab } from '../lib/lab';
import { tableauProfile, vizCategories, vizPageUrl, vizzes, type Viz, type VizCategory } from '../content';
import { Heading, Reveal } from '../components/Section';
import { useProjects } from '../components/projectsContext';
import { VizPreview } from '../components/VizPreview';

const capabilities = ['Business Intelligence', 'Data Visualization', 'Tableau', 'Analytics', 'Dashboard Design', 'Data Storytelling'];

/** A dashboard card. The whole card opens the viewer; the Tableau link stays separate. */
function VizCard({ viz, variant }: { viz: Viz; variant: 'feature' | 'row' }) {
  const { openViz } = useProjects();
  const ref = useRef<HTMLElement>(null);
  // A gentle 3D tilt and light that follow the mouse. Off for touch and calm mode.
  const tilt = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || lab.reducedMotion || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const amp = variant === 'feature' ? 5 : 2.5;
    el.style.setProperty('--rx', `${(0.5 - y) * amp}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * amp}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.classList.add('is-tilt');
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('is-tilt');
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
  };
  return (
    <article ref={ref} className={`viz-card viz-${variant}`} onPointerMove={tilt} onPointerLeave={reset}>
      <div className="viz-media">
        <VizPreview viz={viz} />
      </div>
      <div className="viz-body">
        <p className="viz-cat">
          <span>{viz.category}</span>
          <span aria-hidden="true">·</span>
          <span>Tableau</span>
        </p>
        <h3 className="viz-title">{viz.title}</h3>
        <p className="viz-text">{variant === 'feature' ? viz.summary : viz.domain}</p>
        <div className="viz-actions">
          <button type="button" className="text-btn viz-open" onClick={() => openViz(viz.id)} aria-haspopup="dialog">
            View interactive dashboard <span aria-hidden="true">→</span>
          </button>
          <a className="viz-ext" href={vizPageUrl(viz)} target="_blank" rel="noreferrer" aria-label={`Open ${viz.title} on Tableau Public (new tab)`}>
            Tableau Public <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function BIDashboards() {
  const [filter, setFilter] = useState<VizCategory | 'All'>('All');
  const featured = vizzes.filter((v) => v.featured);
  // Only categories that actually have dashboards become filters.
  const cats = vizCategories.filter((c) => vizzes.some((v) => v.category === c));
  const shown = filter === 'All' ? vizzes : vizzes.filter((v) => v.category === filter);

  return (
    <section id="bi" className="section sub" aria-labelledby="bi-title">
      <div className="wrap">
        <Heading
          id="bi-title"
          index="03.1"
          kicker="Business intelligence · Tableau Public"
          title={<>Dashboards you can <em>actually explore.</em></>}
          lede={
            <>
              Every workbook Sneha has published on Tableau Public — {vizzes.length} in all. Open one to use the live dashboard: filters, tooltips
              and all.
            </>
          }
        />

        <Reveal as="div" className="viz-caps-wrap">
          <ul className="viz-caps" aria-label="Areas this work covers">
            {capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>

        <h3 className="viz-group">Featured visualizations</h3>
        <div className="viz-featured">
          {featured.map((v, i) => (
            <Reveal key={v.id} className="viz-cell" delay={i * 90}>
              <VizCard viz={v} variant="feature" />
            </Reveal>
          ))}
        </div>

        <div className="viz-bar">
          <h3 className="viz-group">The full collection</h3>
          <div className="viz-filters" role="group" aria-label="Filter dashboards by category">
            {(['All', ...cats] as const).map((c) => {
              const n = c === 'All' ? vizzes.length : vizzes.filter((v) => v.category === c).length;
              return (
                <button key={c} type="button" className="viz-filter" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                  {c} <span className="viz-filter-n">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="viz-query" aria-hidden="true">
          <span className="q-k">SELECT</span> title, category <span className="q-k">FROM</span> tableau_public
          {filter !== 'All' && (
            <>
              {' '}
              <span className="q-k">WHERE</span> category = <span className="q-s">'{filter}'</span>
            </>
          )}
          ; <span className="q-c">-- {shown.length} {shown.length === 1 ? 'row' : 'rows'}</span>
          <span className="q-caret" />
        </p>
        <p className="sr-only" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? 'dashboard' : 'dashboards'}
          {filter === 'All' ? '' : ` in ${filter}`}.
        </p>
        <ul className="viz-list" key={filter}>
          {shown.map((v, i) => (
            <li key={v.id} className="viz-list-item" style={{ ['--i' as string]: i }}>
              <VizCard viz={v} variant="row" />
            </li>
          ))}
        </ul>

        <p className="viz-source">
          Source:{' '}
          <a className="inline-link" href={tableauProfile} target="_blank" rel="noreferrer">
            Sneha’s Tableau Public profile ↗
          </a>
        </p>
      </div>
    </section>
  );
}
