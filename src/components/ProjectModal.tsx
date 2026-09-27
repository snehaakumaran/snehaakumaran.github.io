import { useEffect, useRef } from 'react';
import { kindLabel, links, projects, vizzes } from '../content';
import { useProjects } from './projectsContext';
import { KindGlyph } from './KindGlyph';

/** Project detail. Shows only documented facts; undocumented fields are omitted. */
export function ProjectModal() {
  const { openId, close, openViz } = useProjects();
  const ref = useRef<HTMLDialogElement>(null);
  const p = projects.find((x) => x.id === openId) ?? null;
  const viz = p?.viz ? vizzes.find((v) => v.id === p.viz) : undefined;
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (p && !d.open) d.showModal();
    if (!p && d.open) d.close();
  }, [p]);
  return (
    <dialog ref={ref} className={`modal ${p ? `k-${p.kind}` : ''}`} aria-labelledby="modal-title" onClose={close} onClick={(e) => e.target === e.currentTarget && close()}>
      {p && (
        <div className="modal-body">
          <button type="button" className="modal-close" onClick={close} aria-label="Close project details">
            <span aria-hidden="true" />
          </button>
          <p className="modal-kind">
            <KindGlyph kind={p.kind} />
            {kindLabel[p.kind]}
          </p>
          <h3 id="modal-title" className="modal-title">
            {p.title}
          </h3>
          <dl className="modal-fields">
            <div>
              <dt>Overview</dt>
              <dd>{p.overview}</dd>
            </div>
            {p.task && (
              <div>
                <dt>Approach</dt>
                <dd>{p.task}</dd>
              </div>
            )}
            <div>
              <dt>Technologies & topics</dt>
              <dd>
                <ul className="tags">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          {((p.links && p.links.length > 0) || viz) && (
            <div className="modal-links">
              {viz && (
                <button type="button" className="btn btn-solid mag" onClick={() => openViz(viz.id)} aria-haspopup="dialog">
                  View interactive dashboard <span aria-hidden="true">→</span>
                </button>
              )}
              {p.links?.map((l) => (
                <a key={l.href} className="btn btn-line mag" href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
          <p className="modal-note">
            Listed in the Projects section of Sneha’s LinkedIn profile.{' '}
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              View LinkedIn ↗
            </a>
          </p>
        </div>
      )}
    </dialog>
  );
}
