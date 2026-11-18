import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { SiteImage } from '@profitstudio/booking-engine';
import type { SiteValues } from '../lib/content';
import { Emphasis } from './Emphasis';
import { Photo } from './Photo';
import { SectionLabel } from './SectionLabel';

type Group = 'skin' | 'paper';
type Filter = 'all' | Group;

interface Piece {
  key: string;
  n: string;
  image: SiteImage;
  caption: string;
  group: Group;
  sample: boolean;
}

const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'skin', label: 'On skin' },
  { id: 'paper', label: 'On paper' },
];

/** The wall's rows are about 22rem tall on wide screens (site.css --row-h): a print is at most ~33rem wide. */
const GRID_SIZES = '(min-width: 1080px) 34rem, (min-width: 640px) 50vw, 60vw';

/**
 * Recent work: ten photographs in two groups — on skin (1–6) and on paper (7–10) — as a wall of
 * prints hung in level rows (each print keeps its own shape; a row's prints share one height), each
 * with its number and caption. "All · On skin · On paper" filters the
 * wall (a toggle group); any print opens large in a viewer (a modal <dialog>: arrows, Esc, ✕).
 * Every default photo says "Sample photo" until the owner replaces it.
 */
export function Work({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const pieces: Piece[] = [];
  for (const i of SLOTS) {
    const image = values[`work.photo${i}`];
    if (!image) continue;
    pieces.push({
      key: `work.photo${i}`,
      n: String(pieces.length + 1).padStart(2, '0'),
      image,
      caption: values[`work.caption${i}`].trim(),
      group: i <= 6 ? 'skin' : 'paper',
      sample: !ownerFields.includes(`work.photo${i}`),
    });
  }
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(null);
  if (pieces.length === 0) return null;
  const hasPaper = pieces.some((p) => p.group === 'paper');
  const hasSkin = pieces.some((p) => p.group === 'skin');
  const shown = pieces.filter((p) => filter === 'all' || p.group === filter);
  return (
    <section className="work section" id="work" aria-labelledby="work-title">
      <div className="shell">
        <SectionLabel n="01">Work</SectionLabel>
        <header className="work__head">
          <h2 id="work-title" className="section-title" data-reveal="">
            <Emphasis text={values['work.title']} />
          </h2>
          <div className="work__aside">
            {values['work.intro'] && <p className="section-intro">{values['work.intro']}</p>}
            {hasPaper && hasSkin && (
              <div className="filter" role="group" aria-label="Show work">
                {FILTERS.map((f) => (
                  <button key={f.id} type="button" className="filter__button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                    {f.label}
                    <span className="filter__count">{f.id === 'all' ? pieces.length : pieces.filter((p) => p.group === f.id).length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
        <ul className="work__wall" role="list">
          {shown.map((p, i) => (
            <li className={`print print--${p.group}`} key={p.key} data-reveal="" style={{ '--r': ratioOf(p.image) } as CSSProperties}>
              <button type="button" className="print__open" onClick={() => setOpen(pieces.indexOf(p))} aria-label={`Open ${p.caption || `photo ${p.n}`} large`}>
                <Photo image={p.image} sizes={GRID_SIZES} className="frame--print" />
              </button>
              {p.sample && <span className="photo-label">Sample photo</span>}
              <p className="print__caption">
                <span className="print__n" aria-hidden="true">
                  {p.group === 'skin' ? 'S' : 'P'}·{p.n}
                </span>
                {p.caption}
              </p>
              {i === 0 && <span className="sr-only">{shown.length} photographs</span>}
            </li>
          ))}
        </ul>
      </div>
      <Viewer pieces={pieces} index={open} onIndex={setOpen} />
    </section>
  );
}

/** The photo's width over its height (its own size, or the default frame's). */
function ratioOf(image: SiteImage): number {
  const r = (image.width ?? 4) / (image.height ?? 5);
  return Math.min(2, Math.max(0.5, Math.round(r * 1000) / 1000));
}

/** The print keeps the photo's own shape: upright, tall or wide (the owner's photo by its size). */
function ratioClass(image: SiteImage): 'wide' | 'tall' | 'upright' {
  const w = image.width ?? 4;
  const h = image.height ?? 5;
  const r = w / h;
  if (r > 1.15) return 'wide';
  if (r < 0.72) return 'tall';
  return 'upright';
}

/** The viewer: one print large with its caption; ← → step through all ten; Esc or ✕ closes. */
function Viewer({ pieces, index, onIndex }: { pieces: Piece[]; index: number | null; onIndex: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.classList.add('is-locked');
    } else if (index === null && dialog.open) {
      dialog.close();
    }
  }, [index]);

  const piece = index !== null ? pieces[index] : null;
  const step = (d: number) => index !== null && onIndex((index + d + pieces.length) % pieces.length);
  return (
    <dialog
      ref={ref}
      className="viewer"
      aria-label="Work, large"
      onClose={() => {
        document.documentElement.classList.remove('is-locked');
        onIndex(null);
        returnTo.current?.focus();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onIndex(null);
      }}
    >
      {piece && (
        <div className="viewer__inner">
          <figure className="viewer__figure">
            <Photo key={piece.key} image={piece.image} sizes="(min-width: 1024px) 60vw, 94vw" className={`frame--viewer frame--${ratioClass(piece.image)}`} />
            <figcaption className="viewer__caption">
              <span className="viewer__n">
                {piece.group === 'skin' ? 'On skin' : 'On paper'} · {index! + 1} / {pieces.length}
              </span>
              <span>{piece.caption}</span>
              {piece.sample && <span className="tag">Sample photo</span>}
            </figcaption>
          </figure>
          <div className="viewer__controls">
            <button type="button" className="icon-button viewer__step" onClick={() => step(-1)} aria-label="Previous photo">
              ←
            </button>
            <button type="button" className="icon-button viewer__step" onClick={() => step(1)} aria-label="Next photo">
              →
            </button>
            <button type="button" className="icon-button viewer__close" onClick={() => onIndex(null)} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
