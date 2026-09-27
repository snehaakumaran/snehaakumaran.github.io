import { useRef, type AnchorHTMLAttributes, type ReactNode, type PointerEvent } from 'react';
import { lab } from '../lib/lab';

/** A link that leans gently toward the cursor. Disabled for touch and reduced motion. */
export function Magnetic({ children, className = '', ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (lab.reducedMotion || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = '');
  return (
    <a ref={ref} className={`mag ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
    </a>
  );
}
