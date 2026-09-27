import { useMemo, useState } from 'react';
import { kindLabel, projects, type Project, type ProjectKind } from '../content';
import { Heading, Reveal } from '../components/Section';
import { KindGlyph } from '../components/KindGlyph';
import { useProjects } from '../components/projectsContext';
import { lab } from '../lib/lab';

const RINGS: { kind: ProjectKind; rx: number; ry: number; offset: number }[] = [
  { kind: 'bi', rx: 22, ry: 17, offset: -0.35 },
  { kind: 'ml', rx: 36, ry: 29, offset: 0.2 },
  { kind: 'db', rx: 47, ry: 40, offset: 2.35 },
];

/**
 * The Data Universe: every project orbits the Project Lab. Rings group the
 * projects by type (BI dashboards, machine learning, database design).
 */
export function ProjectUniverse() {
  const { open } = useProjects();
  const [hot, setHot] = useState<string | null>(null);
  const placed = useMemo(() => {
    return RINGS.flatMap((ring) => {
      const list = projects.filter((p) => p.kind === ring.kind);
      return list.map((p, i) => {
        const a = ring.offset + (i / list.length) * Math.PI * 2;
        return { p, x: 50 + Math.cos(a) * ring.rx, y: 50 + Math.sin(a) * ring.ry };
      });
    });
  }, []);
  const shown: Project | undefined = projects.find((p) => p.id === hot);
  const focus = (id: string | null) => {
    setHot(id);
    lab.focus = id ? 1 : 0;
  };

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="wrap">
        <Heading
          id="projects-title"
          index="03"
          kicker="Data universe"
          title={<>Nine projects, <em>one lab.</em></>}
          lede={<>Every project orbits the lab, grouped by the kind of work. <span className="only-pointer">Hover to preview, select to open.</span><span className="only-touch">Tap a project to open it.</span></>}
        />

        <div className="universe-layout">
          <Reveal variant="scale" className="universe">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="universe-rings" aria-hidden="true">
              {RINGS.map((r) => (
                <ellipse key={r.kind} cx="50" cy="50" rx={r.rx} ry={r.ry} className={`u-ring k-${r.kind}`} vectorEffect="non-scaling-stroke" />
              ))}
              {placed.map(({ p, x, y }) => (
                <line key={p.id} x1="50" y1="50" x2={x} y2={y} className={`u-spoke ${hot === p.id ? 'is-hot' : ''}`} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <div className="u-core" aria-hidden="true">
              <span>Project</span>
              <strong>Lab</strong>
            </div>
            <ul className="u-nodes">
              {placed.map(({ p, x, y }) => (
                <li key={p.id} style={{ left: `${x}%`, top: `${y}%` }}>
                  <button
                    type="button"
                    className={`u-node k-${p.kind} ${hot === p.id ? 'is-hot' : ''}`}
                    onMouseEnter={() => focus(p.id)}
                    onMouseLeave={() => focus(null)}
                    onFocus={() => focus(p.id)}
                    onBlur={() => focus(null)}
                    onClick={() => open(p.id)}
                    aria-haspopup="dialog"
                    aria-label={`${p.title} — ${kindLabel[p.kind]}. Open details.`}
                  >
                    <KindGlyph kind={p.kind} />
                    <span className="u-node-label">{p.node}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <aside className="u-preview" aria-live="polite">
            {shown ? (
              <div className={`u-card k-${shown.kind}`} key={shown.id}>
                <p className="u-card-kind">
                  <KindGlyph kind={shown.kind} /> {kindLabel[shown.kind]}
                  {shown.links?.length ? <span className="u-card-repo">Repo</span> : null}
                </p>
                <p className="u-card-title">{shown.title}</p>
                <p className="u-card-text">{shown.overview}</p>
                <ul className="tags">
                  {shown.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="u-card-hint">Select to open ↵</p>
              </div>
            ) : (
              <div className="u-card u-card-idle">
                <p className="mono-label">Legend</p>
                <ul className="u-legend">
                  {RINGS.map((r) => (
                    <li key={r.kind} className={`k-${r.kind}`}>
                      <KindGlyph kind={r.kind} /> {kindLabel[r.kind]} <span>{projects.filter((p) => p.kind === r.kind).length}</span>
                    </li>
                  ))}
                </ul>
                <p className="u-card-hint">Hover a node to preview it.</p>
              </div>
            )}
          </aside>
        </div>

        {/* Phones: the same projects as a readable, tappable index. */}
        <ul className="u-list">
          {projects.map((p) => (
            <li key={p.id}>
              <button type="button" className={`u-list-item k-${p.kind}`} onClick={() => open(p.id)} aria-haspopup="dialog">
                <KindGlyph kind={p.kind} />
                <span>
                  <span className="u-list-title">{p.title}</span>
                  <span className="u-list-kind">{kindLabel[p.kind]}</span>
                </span>
                <span aria-hidden="true" className="u-list-arrow">
                  →
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
