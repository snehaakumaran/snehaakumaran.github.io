import { useEffect, useState } from 'react';
import { useActiveSection } from '../lib/hooks';
import type { SectionId } from '../lib/lab';
import { links } from '../content';

const ITEMS: { id: SectionId; label: string; covers?: SectionId[] }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects', covers: ['bi', 'ml', 'ticketing'] },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export function Nav({ calm, onToggleCalm }: { calm: boolean; onToggleCalm: () => void }) {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);
  const isActive = (it: (typeof ITEMS)[number]) => it.id === active || it.covers?.includes(active);

  return (
    <header className="nav">
      <a className="nav-brand" href="#home" aria-label="Sneha Kumaran — back to top">
        <span className="nav-mono" aria-hidden="true">
          SK
        </span>
        <span className="nav-name">Sneha Kumaran</span>
      </a>
      <nav aria-label="Sections" id="nav-menu" className={`nav-menu ${open ? 'is-open' : ''}`}>
        <ul>
          {ITEMS.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className={isActive(it) ? 'is-active' : undefined} aria-current={isActive(it) ? 'true' : undefined} onClick={() => setOpen(false)}>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav-actions">
        <button type="button" className="nav-motion" aria-pressed={calm} aria-label="Reduce motion" title={calm ? 'Motion reduced' : 'Reduce motion'} onClick={onToggleCalm}>
          <span aria-hidden="true" className={`motion-glyph ${calm ? 'is-calm' : ''}`}>
            <i />
            <i />
            <i />
          </span>
        </button>
        <a className="nav-cta" href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" className={`nav-burger ${open ? 'is-open' : ''}`}>
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}
