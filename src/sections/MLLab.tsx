import { useState } from 'react';
import { projects } from '../content';
import { Heading, Reveal } from '../components/Section';
import { useProjects } from '../components/projectsContext';

const STAGES = ['Dataset', 'Features', 'Model', 'Prediction'];

/**
 * The ML environment: dataset particles flow through features into a model and
 * out as predictions. Selecting a project labels the model with the technique
 * its title names. No accuracies or results are shown — none are documented.
 */
export function MLLab() {
  const ml = projects.filter((p) => p.kind === 'ml');
  const [sel, setSel] = useState(ml[0].id);
  const { open } = useProjects();
  const p = ml.find((x) => x.id === sel)!;

  return (
    <section id="ml" className="section sub" aria-labelledby="ml-title">
      <div className="wrap">
        <Heading id="ml-title" index="03.2" kicker="Machine learning" title={<>Dataset in, <em>prediction out.</em></>} />

        <div className="ml-grid">
          <Reveal variant="wipe" className="ml-flow">
            <svg viewBox="0 0 640 220" aria-hidden="true">
              <defs>
                <linearGradient id="mlg" x1="0" x2="1">
                  <stop offset="0" stopColor="#8b7dff" />
                  <stop offset="1" stopColor="#4cc9f0" />
                </linearGradient>
              </defs>
              <path id="ml-path" d="M40 110 C120 110 120 110 200 110 S300 110 360 110 S480 110 600 110" className="ml-rail" />
              {/* dataset: scattered points */}
              {Array.from({ length: 18 }).map((_, i) => (
                <circle key={i} cx={30 + ((i * 37) % 60)} cy={70 + ((i * 53) % 80)} r="2.2" className="ml-pt" />
              ))}
              {/* features: columns */}
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={186 + i * 12} y={78 + (i % 2) * 10} width="7" height={64 - (i % 2) * 20} rx="2" className="ml-feat" />
              ))}
              {/* model: layered nodes */}
              {[0, 1, 2].map((l) =>
                [0, 1, 2, 3].slice(0, l === 1 ? 4 : 3).map((k) => (
                  <circle key={`${l}-${k}`} cx={340 + l * 28} cy={(l === 1 ? 68 : 80) + k * 24} r="5" className="ml-node" />
                )),
              )}
              <rect x="318" y="50" width="100" height="120" rx="14" className="ml-box" />
              {/* prediction */}
              <circle cx="580" cy="110" r="22" className="ml-out" />
              <circle cx="580" cy="110" r="8" className="ml-out-core" />
              {Array.from({ length: 7 }).map((_, i) => (
                <circle key={i} r="3" className="ml-flow-pt">
                  <animateMotion dur="4.2s" begin={`${i * 0.6}s`} repeatCount="indefinite">
                    <mpath href="#ml-path" />
                  </animateMotion>
                </circle>
              ))}
            </svg>
            <ol className="ml-stages">
              {STAGES.map((s, i) => (
                <li key={s}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s}
                  {s === 'Model' && <em>{p.task}</em>}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="ml-list" delay={100}>
            <p className="mono-label" id="ml-list-label">
              Experiments
            </p>
            <ul aria-labelledby="ml-list-label">
              {ml.map((x) => (
                <li key={x.id}>
                  <button type="button" aria-pressed={x.id === sel} className={`ml-item ${x.id === sel ? 'is-sel' : ''}`} onClick={() => setSel(x.id)} onMouseEnter={() => setSel(x.id)}>
                    <span className="ml-item-title">{x.title}</span>
                    <span className="ml-item-task">{x.task}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="text-btn" onClick={() => open(p.id)} aria-haspopup="dialog">
              Open “{p.node}” details <span aria-hidden="true">→</span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
