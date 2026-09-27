import { useMemo, useState } from 'react';
import { proof, stack, type Proof } from '../content';
import { Heading, Reveal } from '../components/Section';
import { useProjects } from '../components/projectsContext';
import { lab } from '../lib/lab';

/** Links from a skill to the work on this site that shows it. */
function ProofLinks({ name }: { name: string }) {
  const { open } = useProjects();
  const items = proof[name];
  if (!items) return null;
  const go = (p: Proof) => {
    if (p.project) open(p.project);
    else if (p.href) document.querySelector(p.href)?.scrollIntoView({ behavior: lab.reducedMotion ? 'auto' : 'smooth' });
  };
  return (
    <span className="proof">
      <span className="proof-k">Seen in</span>
      {items.map((p) => (
        <button key={p.label} type="button" className="proof-link" onClick={() => go(p)} aria-haspopup={p.project ? 'dialog' : undefined}>
          {p.label} <span aria-hidden="true">→</span>
        </button>
      ))}
    </span>
  );
}

type Hot = { group: string; item?: string } | null;

const W = 1000;
const H = 640;
const CX = W / 2;
const CY = H / 2;

/**
 * The data stack as a network: Data Analytics at the centre, groups around it,
 * tools around each group. No proficiency levels — only what's on the profile.
 */
export function DataStack() {
  const [hover, setHover] = useState<Hot>(null);
  // Clicking a skill pins it, so its "Seen in" links stay clickable.
  const [pinned, setPinned] = useState<Hot>(null);
  const [mobilePick, setMobilePick] = useState<string | null>(null);
  const hot = hover ?? pinned;
  // Hand-tuned hub positions so every label has room (viewBox 1000 × 640).
  const HUBS: Record<string, { x: number; y: number; a: number }> = {
    analytics: { x: 500, y: 128, a: -Math.PI / 2 },
    bi: { x: 815, y: 205, a: -0.25 },
    ml: { x: 690, y: 455, a: 0.9 },
    db: { x: 250, y: 455, a: 2.3 },
    tools: { x: 185, y: 205, a: 3.4 },
  };
  const layout = useMemo(() => {
    return stack.map((g) => {
      const h = HUBS[g.id];
      let items;
      if (g.items.length > 5) {
        // Large group: two tidy columns beneath the hub.
        items = g.items.map((it, ii) => ({ ...it, x: h.x + (ii % 2 ? 105 : -105), y: h.y + 58 + Math.floor(ii / 2) * 34 }));
      } else {
        const spread = Math.min(2.2, 0.55 * g.items.length);
        items = g.items.map((it, ii) => {
          const t = g.items.length === 1 ? 0 : ii / (g.items.length - 1) - 0.5;
          const b = h.a + t * spread;
          return { ...it, x: h.x + Math.cos(b) * 140, y: h.y + Math.sin(b) * 88 };
        });
      }
      return { ...g, hx: h.x, hy: h.y, items };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (h: Hot) => {
    setHover(h);
    lab.focus = h || pinned ? 0.6 : 0;
  };
  const pin = (h: Hot) => {
    const same = pinned && h && pinned.group === h.group && pinned.item === h.item;
    setPinned(same ? null : h);
    lab.focus = same ? 0 : 0.6;
  };
  const group = layout.find((g) => g.id === hot?.group);
  const item = group?.items.find((i) => i.name === hot?.item);

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <Heading id="skills-title" index="04" kicker="Data stack" title={<>The tools, <em>connected.</em></>} lede={<>Every tool connects back to data analytics. <span className="only-pointer">Hover to trace a tool; click one to see where it’s used.</span><span className="only-touch">Tap a highlighted tool to see where it’s used.</span></>} />

        <Reveal variant="scale" className="stack">
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="stack-svg">
            {layout.map((g) => (
              <g key={g.id} className={`st-g ${hot && hot.group !== g.id ? 'is-dim' : ''} ${hot?.group === g.id ? 'is-hot' : ''}`}>
                <line x1={CX} y1={CY} x2={g.hx} y2={g.hy} className="st-trunk" />
                {g.items.map((it) => (
                  <line key={it.name} x1={g.hx} y1={g.hy} x2={it.x} y2={it.y} className={`st-branch ${hot?.item === it.name ? 'is-hot' : ''}`} />
                ))}
              </g>
            ))}
            <circle cx={CX} cy={CY} r="64" className="st-core" />
            <circle cx={CX} cy={CY} r="86" className="st-core-ring" />
          </svg>
          <div className="st-center" style={{ left: '50%', top: '50%' }} aria-hidden="true">
            Data
            <br />
            analytics
          </div>
          {layout.map((g) => (
            <div key={g.id}>
              <button
                type="button"
                className={`st-hub ${hot?.group === g.id ? 'is-hot' : ''}`}
                style={{ left: `${(g.hx / W) * 100}%`, top: `${(g.hy / H) * 100}%` }}
                onMouseEnter={() => set({ group: g.id })}
                onMouseLeave={() => set(null)}
                onFocus={() => set({ group: g.id })}
                onBlur={() => set(null)}
                onClick={() => pin({ group: g.id })}
                aria-describedby="st-note"
              >
                {g.label}
              </button>
              {g.items.map((it) => (
                <button
                  key={it.name}
                  type="button"
                  className={`st-leaf ${hot?.item === it.name ? 'is-hot' : ''} ${hot && hot.group !== g.id ? 'is-dim' : ''} ${proof[it.name] ? 'has-proof' : ''} ${pinned?.item === it.name ? 'is-pinned' : ''}`}
                  style={{ left: `${(it.x / W) * 100}%`, top: `${(it.y / H) * 100}%` }}
                  onMouseEnter={() => set({ group: g.id, item: it.name })}
                  onMouseLeave={() => set(null)}
                  onFocus={() => set({ group: g.id, item: it.name })}
                  onBlur={() => set(null)}
                  onClick={() => pin({ group: g.id, item: it.name })}
                  aria-pressed={pinned?.item === it.name}
                  aria-describedby="st-note"
                >
                  {it.name}
                </button>
              ))}
            </div>
          ))}
          <p id="st-note" className="st-note" aria-live="polite">
            {item ? (
              <>
                <strong>{item.name}</strong> · {item.note}
                {proof[item.name] && (pinned?.item === item.name ? <ProofLinks name={item.name} /> : <span className="proof-hint">Click to see where it’s used</span>)}
              </>
            ) : group ? (
              <>
                <strong>{group.label}</strong> · {group.note}
              </>
            ) : (
              'Data analytics sits at the centre of every tool below.'
            )}
          </p>
        </Reveal>

        {/* Small screens: the same stack as readable groups. */}
        <div className="stack-list">
          {stack.map((g) => (
            <div key={g.id} className="sl-group">
              <p className="sl-head">
                {g.label}
                <span>{g.note}</span>
              </p>
              <ul>
                {g.items.map((it) =>
                  proof[it.name] ? (
                    <li key={it.name}>
                      <button type="button" className="sl-btn" aria-pressed={mobilePick === it.name} onClick={() => setMobilePick(mobilePick === it.name ? null : it.name)}>
                        {it.name}
                      </button>
                    </li>
                  ) : (
                    <li key={it.name}>{it.name}</li>
                  ),
                )}
              </ul>
              {mobilePick && g.items.some((it) => it.name === mobilePick) && (
                <p className="sl-proof" aria-live="polite">
                  <strong>{mobilePick}</strong>
                  <ProofLinks name={mobilePick} />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
