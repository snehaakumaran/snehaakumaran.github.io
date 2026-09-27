import type { ReactNode } from 'react';
import { useInView } from '../lib/hooks';

/** Section heading: index, kicker, editorial title and optional lede. */
export function Heading({ index, kicker, title, lede, id }: { index: string; kicker: string; title: ReactNode; lede?: ReactNode; id: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`heading ${seen ? 'is-in' : ''}`}>
      <p className="kicker">
        <span className="kicker-index">{index}</span>
        <span className="kicker-bar" aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className="heading-title">
        <span className="clip">
          <span>{title}</span>
        </span>
      </h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

/** Reveal wrapper with a few distinct motions so sections don't all fade the same way. */
export function Reveal({
  children,
  className = '',
  variant = 'rise',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'rise' | 'scale' | 'wipe';
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <Tag ref={ref as never} className={`rv rv-${variant} ${seen ? 'is-in' : ''} ${className}`} style={{ transitionDelay: seen ? `${delay}ms` : undefined }}>
      {children}
    </Tag>
  );
}
