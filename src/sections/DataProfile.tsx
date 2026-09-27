import { useState } from 'react';
import { profile, profileNodes, profileThemes } from '../content';
import { Heading, Reveal } from '../components/Section';
import { useMedia } from '../lib/hooks';

/**
 * "The Data Profile": Sneha at the centre of the disciplines she works across.
 * Nodes are keyboard-focusable; hovering or focusing lights the connection.
 */
export function DataProfile() {
  const [hot, setHot] = useState<string | null>(null);
  const compact = useMedia('(max-width: 560px)');
  const n = profileNodes.length;
  const cx = 300;
  const cy = 260;
  const R = 190;
  const pts = profileNodes.map((node, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { ...node, x: cx + Math.cos(a) * R * (compact ? 0.9 : 1.25), y: cy + Math.sin(a) * R * (compact ? 1.08 : 1) };
  });
  const active = pts.find((p) => p.id === hot);

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <Heading id="about-title" index="01" kicker="The data profile" title={<>One analyst, <em>many connections.</em></>} />
        <div className="profile-grid">
          <Reveal variant="scale" className="profile-graph">
            <svg viewBox="0 0 600 520" role="img" aria-label={`${profile.name}, connected to: ${profileNodes.map((p) => p.label).join(', ')}`}>
              <defs>
                <radialGradient id="pg-core" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#8b7dff" stopOpacity=".55" />
                  <stop offset="1" stopColor="#8b7dff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx={cx} cy={cy} rx={R * 1.25} ry={R} className="pg-orbit" />
              <ellipse cx={cx} cy={cy} rx={R * 0.62} ry={R * 0.5} className="pg-orbit pg-orbit-2" />
              {pts.map((p) => (
                <line key={p.id} x1={cx} y1={cy} x2={p.x} y2={p.y} className={`pg-edge ${hot === p.id ? 'is-hot' : ''} ${hot && hot !== p.id ? 'is-dim' : ''}`} />
              ))}
              {pts.map((p) => (
                <circle key={`pulse-${p.id}`} r="2.4" className="pg-pulse">
                  <animateMotion dur={`${3 + (p.x % 3)}s`} repeatCount="indefinite" path={`M${p.x},${p.y} L${cx},${cy}`} />
                </circle>
              ))}
              <circle cx={cx} cy={cy} r="120" fill="url(#pg-core)" />
              <circle cx={cx} cy={cy} r="58" className="pg-center" />
              <text x={cx} y={cy - 4} textAnchor="middle" className="pg-center-t">
                SNEHA
              </text>
              <text x={cx} y={cy + 16} textAnchor="middle" className="pg-center-t">
                KUMARAN
              </text>
            </svg>
            {pts.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pg-node ${hot === p.id ? 'is-hot' : ''}`}
                style={{ left: `${(p.x / 600) * 100}%`, top: `${(p.y / 520) * 100}%` }}
                onMouseEnter={() => setHot(p.id)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(p.id)}
                onBlur={() => setHot(null)}
                aria-describedby="pg-note"
              >
                {p.label}
              </button>
            ))}
          </Reveal>

          <div className="profile-copy">
            <Reveal>
              <p className="profile-summary">{profile.summary}</p>
            </Reveal>
            <Reveal delay={80}>
              <p className="mono-label">Work themes</p>
              <ul className="chips">
                {profileThemes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={160} className="pg-readout" >
              <p className="mono-label">Node</p>
              <p id="pg-note" className="pg-note" aria-live="polite">
                {active ? (
                  <>
                    <strong>{active.label}</strong> — {active.note}
                  </>
                ) : (
                  'Hover or focus a node to inspect it.'
                )}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
