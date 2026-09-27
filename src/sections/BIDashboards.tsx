import { links, projects } from '../content';
import { Heading, Reveal } from '../components/Section';
import { useProjects } from '../components/projectsContext';

/** Abstract dashboard compositions — illustrative only, no real values. */
function Illustration({ variant }: { variant: number }) {
  return (
    <svg viewBox="0 0 320 190" className="dash-art" aria-hidden="true">
      <rect x="0.5" y="0.5" width="319" height="189" rx="10" className="dash-frame" />
      <rect x="12" y="12" width="90" height="8" rx="4" className="dash-muted" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x={12 + k * 100} y="30" width="92" height="36" rx="6" className="dash-tile" />
          <rect x={20 + k * 100} y="40" width="34" height="5" rx="2.5" className="dash-muted" />
          <rect x={20 + k * 100} y="51" width={48 - k * 8} height="8" rx="3" className={`dash-kpi dash-kpi-${k}`} />
        </g>
      ))}
      {variant === 0 && (
        <>
          <rect x="12" y="76" width="190" height="102" rx="6" className="dash-tile" />
          {[40, 62, 50, 30, 18].map((h, i) => (
            <rect key={i} x={28 + i * 34} y={168 - h} width="20" height={h} rx="3" className="dash-bar" style={{ animationDelay: `${i * 90}ms` }} />
          ))}
          <rect x="210" y="76" width="98" height="102" rx="6" className="dash-tile" />
          <circle cx="259" cy="127" r="30" className="dash-ring-bg" />
          <circle cx="259" cy="127" r="30" className="dash-ring" strokeDasharray="120 200" />
        </>
      )}
      {variant === 1 && (
        <>
          <rect x="12" y="76" width="296" height="102" rx="6" className="dash-tile" />
          <path d="M26 160 C60 150 80 120 110 126 S160 100 190 108 S250 82 294 92" className="dash-line" />
          <path d="M26 166 C70 162 96 150 130 150 S200 136 240 140 S280 128 294 130" className="dash-line dash-line-2" />
          {[26, 110, 190, 294].map((x, i) => (
            <circle key={i} cx={x} cy={[160, 126, 108, 92][i]} r="3" className="dash-dot" />
          ))}
        </>
      )}
      {variant === 2 && (
        <>
          <rect x="12" y="76" width="140" height="102" rx="6" className="dash-tile" />
          <circle cx="82" cy="127" r="32" className="dash-ring-bg" />
          <circle cx="82" cy="127" r="32" className="dash-ring" strokeDasharray="70 201" />
          <circle cx="82" cy="127" r="32" className="dash-ring dash-ring-2" strokeDasharray="50 201" strokeDashoffset="-70" />
          <rect x="160" y="76" width="148" height="102" rx="6" className="dash-tile" />
          {[70, 52, 40, 28, 16].map((w, i) => (
            <rect key={i} x="172" y={88 + i * 17} width={w * 1.7} height="9" rx="3" className="dash-bar" style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </>
      )}
    </svg>
  );
}

export function BIDashboards() {
  const { open } = useProjects();
  const bi = projects.filter((p) => p.kind === 'bi');
  return (
    <section id="bi" className="section sub" aria-labelledby="bi-title">
      <div className="wrap">
        <Heading
          id="bi-title"
          index="03.1"
          kicker="Business intelligence"
          title={<>Dashboards that <em>answer questions.</em></>}
          lede={
            links.tableau ? (
              <>
                See Sneha’s published visualizations on{' '}
                <a className="inline-link" href={links.tableau} target="_blank" rel="noreferrer">
                  Tableau Public ↗
                </a>
              </>
            ) : undefined
          }
        />
        <div className="dash-grid">
          {bi.map((p, i) => (
            <Reveal key={p.id} as="article" className="dash" delay={i * 90}>
              <div className="dash-media">
                <Illustration variant={i} />
                <span className="dash-flag">Illustrative · not a screenshot</span>
              </div>
              <div className="dash-body">
                <h3 className="dash-title">{p.title}</h3>
                <p className="dash-text">{p.overview}</p>
                <button type="button" className="text-btn" onClick={() => open(p.id)} aria-haspopup="dialog">
                  Open details <span aria-hidden="true">→</span>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
