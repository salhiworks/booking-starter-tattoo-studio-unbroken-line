import type { CSSProperties } from 'react';
import type { SiteValues } from '../lib/content';
import { Emphasis } from './Emphasis';
import { Photo } from './Photo';
import { SectionLabel } from './SectionLabel';

const PHOTOS = ['process.photo1', 'process.photo2', 'process.photo3', 'process.photo4'] as const;

/**
 * From paper to skin, on the skin band: four steps side by side on wide screens (stacked on phones),
 * each a photograph, a number and a few lines. One line runs through all four — a straight run with a
 * loop at every step — drawn left to right as the steps arrive (a rule that grows, a fixed-size loop
 * that is drawn), so the loops never stretch. Under reduced motion it is simply there.
 */
export function Process({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const steps = values['process.steps'];
  if (steps.length === 0) return null;
  return (
    <section className="process section on-skin" id="process" aria-labelledby="process-title">
      <div className="shell">
        <SectionLabel n="03">Process</SectionLabel>
        <header className="process__head">
          <h2 id="process-title" className="section-title" data-reveal="">
            <Emphasis text={values['process.title']} />
          </h2>
          {values['process.intro'] && <p className="section-intro">{values['process.intro']}</p>}
        </header>
        <ol className="process__steps" role="list" data-reveal="">
          {steps.map((step, i) => {
            const field = PHOTOS[i];
            const photo = field ? values[field] : null;
            return (
              <li className="step" key={`${i}-${step.title}`} style={{ '--i': i } as CSSProperties}>
                <span className="step__line" aria-hidden="true">
                  <span className="step__run" />
                  <svg className="step__loop" viewBox="0 0 48 40" focusable="false">
                    <path pathLength={1} d="M0 30C10 30 16 29 22 24C30 17 31 5 24 5C17 5 17 18 25 25C31 30 38 30 48 30" />
                  </svg>
                  <span className="step__run step__run--end" />
                </span>
                <p className="step__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>
                {photo && field && (
                  <figure className="step__photo">
                    <Photo image={photo} sizes="(min-width: 1080px) 22vw, (min-width: 640px) 44vw, 88vw" />
                    {!ownerFields.includes(field) && <figcaption className="photo-label">Sample photo</figcaption>}
                  </figure>
                )}
                <h3 className="step__title">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                {step.text && <p className="step__text">{step.text}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
