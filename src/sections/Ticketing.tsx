import { projects } from '../content';
import { Heading, Reveal } from '../components/Section';
import { useProjects } from '../components/projectsContext';

const STEPS = ['Tables', 'Relationships', 'Query', 'Result'];

/** Ticketing Reservation System as a database architecture (schema is abstract). */
export function Ticketing() {
  const p = projects.find((x) => x.id === 'ticketing')!;
  const { open } = useProjects();
  return (
    <section id="ticketing" className="section sub" aria-labelledby="tk-title">
      <div className="wrap">
        <Heading id="tk-title" index="03.3" kicker="Database design" title={<>{p.title}</>} />
        <div className="db-grid">
          <Reveal variant="scale" className="db-art">
            <svg viewBox="0 0 600 300" aria-hidden="true">
              {[
                { x: 20, y: 30 },
                { x: 20, y: 170 },
                { x: 220, y: 100 },
              ].map((t, i) => (
                <g key={i} className="db-table" style={{ animationDelay: `${i * 160}ms` }}>
                  <rect x={t.x} y={t.y} width="150" height="104" rx="10" className="db-t-box" />
                  <rect x={t.x} y={t.y} width="150" height="24" rx="10" className="db-t-head" />
                  {[0, 1, 2].map((r) => (
                    <g key={r}>
                      <circle cx={t.x + 16} cy={t.y + 44 + r * 20} r="3" className={r === 0 ? 'db-key' : 'db-col-dot'} />
                      <rect x={t.x + 28} y={t.y + 41 + r * 20} width={80 - r * 14} height="6" rx="3" className="db-col" />
                    </g>
                  ))}
                </g>
              ))}
              <path d="M170 82 C200 82 195 140 220 140" className="db-rel" />
              <path d="M170 222 C200 222 195 170 220 170" className="db-rel" />
              <path d="M370 152 L420 152" className="db-rel db-rel-q" />
              <rect x="420" y="118" width="72" height="68" rx="12" className="db-query" />
              <text x="456" y="157" textAnchor="middle" className="db-query-t">
                SQL
              </text>
              <path d="M492 152 L520 152" className="db-rel db-rel-q" />
              <g className="db-result">
                {[0, 1, 2, 3].map((r) =>
                  [0, 1].map((c) => <rect key={`${r}${c}`} x={524 + c * 34} y={112 + r * 22} width="30" height="16" rx="3" className="db-cell" style={{ animationDelay: `${(r * 2 + c) * 60}ms` }} />),
                )}
              </g>
            </svg>
            <ol className="db-steps">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <span>{String(i + 1).padStart(2, '0')}</span> {s}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="db-copy" delay={100}>
            <p className="db-text">{p.overview}</p>
            <p className="mono-label">Technologies</p>
            <ul className="tags">
              {p.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="db-flag">Schema shown is illustrative.</p>
            <button type="button" className="text-btn" onClick={() => open(p.id)} aria-haspopup="dialog">
              Open details <span aria-hidden="true">→</span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
