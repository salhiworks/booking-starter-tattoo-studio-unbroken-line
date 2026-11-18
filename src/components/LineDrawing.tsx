import type { CSSProperties } from 'react';

/**
 * One continuous line on a 200 × 200 board — a flash design or the first screen's figure. Drawn from
 * its start to its end when its parent is revealed (site.css: `.line-drawing__path`, pathLength 1),
 * or at once under prefers-reduced-motion. Decorative unless given a title.
 */
export function LineDrawing({ d, className, title, delay = 0 }: { d: string; className?: string; title?: string; delay?: number }) {
  return (
    <svg
      className={`line-drawing ${className ?? ''}`}
      viewBox="0 0 200 200"
      focusable="false"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ '--draw-delay': `${delay}ms` } as CSSProperties}
    >
      <path className="line-drawing__path" pathLength={1} d={d} />
    </svg>
  );
}
