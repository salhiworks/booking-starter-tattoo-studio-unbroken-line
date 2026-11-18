import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import { FLASH_LINES } from '../lib/flashLines';
import type { Resource } from '../lib/resource';
import { flashFor, minutesLabel, priceLabel } from '../lib/services';
import type { FlashSize } from '../lib/services';
import { Emphasis } from './Emphasis';
import { LineDrawing } from './LineDrawing';
import { Photo } from './Photo';
import { SectionLabel } from './SectionLabel';

interface FlashProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  onBook: StartBooking;
}

/** "Small" → small; "M", "Medium" → medium; "Large" → large; anything else → small (the first flash). */
function sizeOf(text: string): FlashSize {
  const t = text.trim().toLowerCase();
  if (/^(m|med|medium|mid)/.test(t)) return 'medium';
  if (/^(l|large|big)/.test(t)) return 'large';
  return 'small';
}

/**
 * The flash sheet: ready-drawn designs anyone can book. Each card is a sheet of tracing paper with the
 * design on it — the site's own sample drawings are one continuous line (src/lib/flashLines.ts) that
 * traces itself in the stencil colour on hover or focus — its number (F-01…), name, size, where it sits
 * well, and the live length and price of the flash appointment of that size. "Book F-03" opens that
 * appointment with "Flash F-03 · Crescent & star" written into the booking note (the client can change
 * it). Until the owner sets the list, the sheet is labelled as sample designs.
 */
export function Flash({ values, ownerFields, services, business, onBook }: FlashProps) {
  const items = values['flash.items'];
  if (items.length === 0) return null;
  const own = ownerFields.includes('flash.items');
  const locale = business?.locale ?? 'en-US';
  const list = services.status === 'ready' ? services.data : [];
  const photo = values['flash.photo'];
  return (
    <section className="flash section" id="flash" aria-labelledby="flash-title">
      <div className="shell">
        <SectionLabel n="02">Flash</SectionLabel>
        <div className="flash__layout">
          <header className="flash__head">
            <h2 id="flash-title" className="section-title" data-reveal="">
              <Emphasis text={values['flash.title']} />
            </h2>
            {values['flash.intro'] && <p className="section-intro">{values['flash.intro']}</p>}
            {!own && (
              <p className="sample-note">
                <span className="tag">Sample designs</span> Drawn for this website as examples — the studio replaces them with its own flash.
              </p>
            )}
            {photo && (
              <figure className="flash__photo" data-reveal="">
                <Photo image={photo} sizes="(min-width: 1080px) 24vw, 0px" />
                {!ownerFields.includes('flash.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
              </figure>
            )}
          </header>
          <div className="flash__body">
            <ul className="flash__sheet" role="list">
              {items.map((item, i) => {
                const code = `F-${String(i + 1).padStart(2, '0')}`;
                const size = sizeOf(item.size);
                const service = flashFor(list, size);
                const drawing = item.drawing;
                const sampleLine = !drawing ? FLASH_LINES[i] : undefined;
                const title = item.title.trim();
                const where = item.where.trim();
                return (
                  <li className="flash-card" key={`${i}-${title}`} data-reveal="">
                    <div className="flash-card__board">
                      <span className="flash-card__code" aria-hidden="true">
                        {code}
                      </span>
                      {drawing ? (
                        <img className="flash-card__img" src={drawing.src} alt={drawing.alt || `Flash design: ${title}`} loading="lazy" decoding="async" />
                      ) : sampleLine ? (
                        <>
                          <LineDrawing d={sampleLine.d} className="flash-card__line" title={`Flash design: ${title}, drawn in one continuous line`} delay={(i % 4) * 140} />
                          <LineDrawing d={sampleLine.d} className="flash-card__stencil" />
                        </>
                      ) : (
                        <span className="flash-card__blank" aria-hidden="true">
                          {code}
                        </span>
                      )}
                    </div>
                    <div className="flash-card__text">
                      <h3 className="flash-card__title">
                        <span className="sr-only">{code} · </span>
                        {title}
                      </h3>
                      <p className="flash-card__meta">
                        <span>{item.size.trim() || 'Small'}</span>
                        {service && <span>{minutesLabel(service.durationMinutes)}</span>}
                        {service && <span className="flash-card__price">{priceLabel(service, locale)}</span>}
                      </p>
                      {where && <p className="flash-card__where">{where}</p>}
                    </div>
                    {service && (
                      <a className="btn btn--line btn--small flash-card__book" href="#book" onClick={bookLink(onBook, service.id, `Flash ${code} · ${title}`)}>
                        Book {code}
                        <span className="sr-only"> — {title}, {service.name}</span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            {values['flash.footnote'] && <p className="footnote">{values['flash.footnote']}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
