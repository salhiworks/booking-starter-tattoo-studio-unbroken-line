import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import type { Resource } from '../lib/resource';
import { durationSpoken, firstOfKind, kinds, minutesLabel, priceTerms, shortName, splitDescription, timeTerms } from '../lib/services';
import { Emphasis } from './Emphasis';
import { Notice } from './Notice';
import { Photo } from './Photo';
import { SectionLabel } from './SectionLabel';

interface PricesProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  onRetry: () => void;
  onBook: StartBooking;
}

/**
 * What it costs: every appointment the engine lists, as a ledger — the talks first ("no tattooing"),
 * then the tattoo appointments — each with its name, what it is, who it suits, its length and its
 * price (a custom session's price is labelled a session rate), and its own Book. Beside it, on a sheet
 * of tracing paper with a photograph, "Custom work is quoted in person": how a quote is made, what it
 * depends on, and a way to book the consultation. Nothing here is a stored price.
 */
export function Prices({ values, ownerFields, services, business, onRetry, onBook }: PricesProps) {
  const locale = business?.locale ?? 'en-US';
  const factors = values['prices.factors'];
  const photo = values['prices.photo'];
  const consult = services.status === 'ready' ? firstOfKind(services.data, 'consult') : null;
  return (
    <section className="prices section" id="prices" aria-labelledby="prices-title">
      <div className="shell">
        <SectionLabel n="04">Prices</SectionLabel>
        <header className="prices__head">
          <h2 id="prices-title" className="section-title" data-reveal="">
            <Emphasis text={values['prices.title']} />
          </h2>
          {values['prices.intro'] && <p className="section-intro">{values['prices.intro']}</p>}
        </header>
        <div className="prices__layout">
          <div className="prices__ledger">
            <Ledger services={services} locale={locale} onRetry={onRetry} onBook={onBook} />
            {values['prices.footnote'] && <p className="footnote">{values['prices.footnote']}</p>}
          </div>
          <aside className="custom" aria-labelledby="custom-title">
            {photo && (
              <figure className="custom__photo">
                <Photo image={photo} sizes="(min-width: 1080px) 30vw, (min-width: 640px) 60vw, 92vw" />
                {!ownerFields.includes('prices.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
              </figure>
            )}
            <div className="custom__sheet tracing">
              <span className="tracing__reg tracing__reg--tl" aria-hidden="true" />
              <h3 id="custom-title" className="custom__title">
                {values['prices.customTitle']}
              </h3>
              {values['prices.customText'] && <p className="custom__text prewrap">{values['prices.customText']}</p>}
              {factors.length > 0 && (
                <>
                  <p className="custom__label">A quote depends on</p>
                  <ul className="custom__factors" role="list">
                    {factors.map((f, i) => (
                      <li key={`${i}-${f.text}`}>{f.text}</li>
                    ))}
                  </ul>
                </>
              )}
              {consult && (
                <a className="btn btn--ink custom__book" href="#book" onClick={bookLink(onBook, consult.id)}>
                  Book a {consult.name.toLowerCase().startsWith('consult') ? consult.name.toLowerCase() : 'consultation'}
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Ledger({ services, locale, onRetry, onBook }: { services: Resource<Service[]>; locale: string; onRetry: () => void; onBook: StartBooking }) {
  if (services.status === 'loading') {
    return (
      <div className="ledger" aria-busy="true">
        <p className="sr-only" role="status">
          Loading appointments…
        </p>
        {[0, 1, 2].map((k) => (
          <span key={k} className="skeleton skeleton--row" aria-hidden="true" />
        ))}
      </div>
    );
  }
  if (services.status === 'error') {
    if (services.error.code === 'NOT_CONFIGURED') {
      return <p className="quiet-state">Appointments and prices will be listed here soon.</p>;
    }
    return (
      <Notice tone="error" action={{ label: 'Try again', onClick: onRetry }}>
        <p>We couldn’t load the appointments just now.</p>
      </Notice>
    );
  }
  if (services.data.length === 0) return <p className="quiet-state">Appointments will be listed here soon — call or email the studio meanwhile.</p>;
  return (
    <div className="ledger">
      {kinds(services.data).map((group) => (
        <div className="ledger__group" key={group.id}>
          <h3 className="ledger__label">{group.label}</h3>
          <ul className="ledger__list" role="list">
            {group.services.map((s) => {
              const { lead, goodFor } = splitDescription(s.description);
              const price = priceTerms(s, locale);
              const time = timeTerms(s);
              return (
                <li className="row" key={s.id} data-reveal="">
                  <div className="row__main">
                    <h4 className="row__name">{shortName(s.name)}</h4>
                    {shortName(s.name) !== s.name && <p className="sr-only">{s.name}</p>}
                    {lead && <p className="row__lead">{lead}</p>}
                    {goodFor && (
                      <p className="row__good">
                        <span className="row__good-label">Good for</span> {goodFor}
                      </p>
                    )}
                  </div>
                  <div className="row__figures">
                  <dl>
                    <div>
                      <dt>{time.label}</dt>
                      <dd>
                        <span aria-hidden="true">{minutesLabel(s.durationMinutes)}</span>
                        <span className="sr-only">{durationSpoken(s.durationMinutes)}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>{price.label}</dt>
                      <dd className={`row__price row__price--${price.kind}`}>{price.amount}</dd>
                    </div>
                  </dl>
                    {(price.note && price.kind !== 'free') || time.note ? (
                      <p className="row__note">{price.kind === 'rate' ? price.note : (time.note ?? price.note)}</p>
                    ) : null}
                  </div>
                  <a className="btn btn--line btn--small row__book" href="#book" onClick={bookLink(onBook, s.id)}>
                    Book<span className="sr-only"> {s.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
