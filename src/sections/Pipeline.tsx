import { useState } from 'react';
import { experience, pipelineStages, type StageId } from '../content';
import { Heading, Reveal } from '../components/Section';

/**
 * Experience as a data pipeline. The current role's documented work sits on
 * the stage it belongs to; hovering either side links the two.
 */
export function Pipeline() {
  const [hot, setHot] = useState<StageId | null>(null);
  const [current, ...earlier] = experience;
  const byStage = (id: StageId) => current.work.find((w) => w.stage === id);

  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <div className="wrap">
        <Heading id="exp-title" index="02" kicker="Experience pipeline" title={<>From source <em>to insight.</em></>} />

        <Reveal className="role-head">
          <span className="live">Current</span>
          <h3 className="role-title">{current.role}</h3>
          <p className="role-org">
            {current.org} <span>· {current.period}</span>
          </p>
        </Reveal>

        <Reveal variant="wipe" className="pipe">
          <div className="pipe-track" aria-hidden="true">
            <span className="pipe-flow" />
          </div>
          <ol className="pipe-stages">
            {pipelineStages.map((s, i) => {
              const w = byStage(s.id);
              return (
                <li key={s.id} className={`pipe-stage ${hot === s.id ? 'is-hot' : ''} ${hot && hot !== s.id ? 'is-dim' : ''}`}>
                  <button type="button" className="pipe-node" onMouseEnter={() => setHot(s.id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(s.id)} onBlur={() => setHot(null)}>
                    <span className="pipe-i">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pipe-dot" aria-hidden="true" />
                    <span className="pipe-label">{s.label}</span>
                  </button>
                  {w && <p className="pipe-work">{w.text}</p>}
                </li>
              );
            })}
          </ol>
        </Reveal>

        {earlier.map((r) => (
          <Reveal key={r.org} className="role-earlier" delay={120}>
            <span className="mono-label">Earlier</span>
            <div>
              <p className="role-earlier-title">{r.role}</p>
              <p className="role-org">
                {r.org} <span>· {r.period}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
