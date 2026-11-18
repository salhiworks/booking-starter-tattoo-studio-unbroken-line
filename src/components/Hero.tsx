import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import { FLASH_LINES } from '../lib/flashLines';
import type { Resource } from '../lib/resource';
import { firstOfKind, indexOrder, kindOf, priceLabel } from '../lib/services';
import type { OpeningInfo } from '../lib/useOpening';
import { Emphasis } from './Emphasis';
import { LineDrawing } from './LineDrawing';
import { Photo } from './Photo';

/** imagesizes must match the preload in index.html. */
export const HERO_SIZES = '(min-width: 1024px) min(40vw, 44rem), (min-width: 640px) 80vw, 100vw';

interface HeroProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  opening: OpeningInfo;
  onBook: StartBooking;
}

/**
 * The first screen, on the white wall. The headline set very large on the left (its emphasised words
 * in the line colour, a line pulled under them), the introduction, the main action and a ledger of live
 * facts — the consultation, flash from, the custom session rate — all from the engine. On the right, an
 * upright photograph of the artist at work with a sheet of tracing paper laid over its corner: on it
 * the line draws one figure without lifting, and the owner's note. The photograph's height follows the
 * screen's, so the action stays in the first screen from 320 × 568 to 2560 × 1440.
 */
export function Hero({ values, ownerFields, services, business, opening, onBook }: HeroProps) {
  const photo = values['hero.photo'];
  const own = ownerFields.includes('hero.photo');
  const kicker = values['hero.kicker'].trim();
  const place = values['hero.place'].trim();
  const note = values['hero.note'].trim();
  return (
    <section className={`hero${photo ? '' : ' hero--no-photo'}`} id="top" aria-labelledby="hero-title">
      <div className="shell hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker">
            {kicker && <span>{kicker}</span>}
            {place && <span>{place}</span>}
            {opening.status && (
              <span className="hero__open" data-open={opening.status.open}>
                <span className="hero__open-dot" aria-hidden="true" />
                {opening.status.text}
              </span>
            )}
          </p>
          <h1 id="hero-title" className="hero__title">
            <Emphasis text={values['hero.title']} />
          </h1>
          {values['hero.lede'] && <p className="hero__lede">{values['hero.lede']}</p>}
          <div className="hero__actions">
            <a className="btn btn--ink btn--large" href="#book" onClick={bookLink(onBook)}>
              {values['hero.cta']}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a className="text-link" href="#flash">
              See the flash
            </a>
          </div>
          <Facts services={services} business={business} />
        </div>
        {photo && (
          <figure className="hero__figure">
            <Photo image={photo} sizes={HERO_SIZES} priority className="frame--hero" />
            {!own && <figcaption className="photo-label">Sample photo</figcaption>}
            <div className="hero__sheet tracing" aria-hidden={note ? undefined : true}>
              <span className="tracing__reg tracing__reg--tl" aria-hidden="true" />
              <span className="tracing__reg tracing__reg--br" aria-hidden="true" />
              <LineDrawing d={FLASH_LINES[0].d} className="hero__drawing" delay={350} />
              {note && <p className="hero__note">{note}</p>}
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}

/** Consultation · flash from · custom session — live from the engine, each only if the owner offers it. */
function Facts({ services, business }: { services: Resource<Service[]>; business: Business | null }) {
  if (services.status !== 'ready' || services.data.length === 0) return null;
  const locale = business?.locale ?? 'en-US';
  const list = services.data;
  const consult = firstOfKind(list, 'consult');
  const flash = indexOrder(list)
    .filter((s) => kindOf(s) === 'flash' && s.priceCents !== null)
    .sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0))[0];
  const custom = firstOfKind(list, 'custom');
  const rows: { term: string; value: string }[] = [];
  if (consult) rows.push({ term: consult.name, value: priceLabel(consult, locale) });
  if (flash) rows.push({ term: 'Flash from', value: priceLabel(flash, locale).replace(/^from /, '') });
  if (custom) rows.push({ term: 'Custom work', value: priceLabel(custom, locale) });
  if (rows.length === 0) return null;
  return (
    <dl className="facts">
      {rows.map((r) => (
        <div className="facts__row" key={r.term}>
          <dt>{r.term}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
