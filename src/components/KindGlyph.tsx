import type { ProjectKind } from '../content';

/** A small line icon per project type: bars (BI), network (ML), tables (database). */
export function KindGlyph({ kind, size = 18 }: { kind: ProjectKind; size?: number }) {
  const c = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="glyph">
      {kind === 'bi' && (
        <g {...c}>
          <path d="M4 20h16" />
          <path d="M7 17v-5M12 17V7M17 17v-8" />
        </g>
      )}
      {kind === 'ml' && (
        <g {...c}>
          <circle cx="5" cy="7" r="1.8" />
          <circle cx="5" cy="17" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
          <path d="M6.6 7.8 10.4 11M6.6 16.2l3.8-3.2M13.8 12h3.4" />
        </g>
      )}
      {kind === 'db' && (
        <g {...c}>
          <ellipse cx="12" cy="6" rx="7" ry="2.5" />
          <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
          <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
        </g>
      )}
    </svg>
  );
}
