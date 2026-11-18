/**
 * A section's label — its number and name in the mono label face — followed by the ornament: the line,
 * run out to the edge of the text with one loop in it, drawn as the section arrives (site.css). The
 * loop is a fixed-size drawing, so it never stretches; the straight runs either side are rules.
 */
export function SectionLabel({ n, children, tone }: { n?: string; children: string; tone?: 'night' }) {
  return (
    <div className={`label${tone ? ` label--${tone}` : ''}`} data-reveal="">
      <p className="label__name">
        {n && (
          <span className="label__n" aria-hidden="true">
            {n}
          </span>
        )}
        <span className="label__text">{children}</span>
      </p>
      <span className="label__line" aria-hidden="true">
        <span className="label__run" />
        <svg className="label__loop" viewBox="0 0 64 32" focusable="false">
          <path pathLength={1} d="M0 24C14 24 22 23 30 18C40 12 42 3 34 3C26 3 26 14 34 20C41 25 52 24 64 24" />
        </svg>
        <span className="label__run label__run--end" />
      </span>
    </div>
  );
}
