import { formatMoney } from '@profitstudio/booking-engine';
import type { Service } from '@profitstudio/booking-engine';

/**
 * The studio's appointments. The engine (2.0.0) has no service categories and no per-service
 * metadata, and a service's id is a database UUID this site cannot know when it is built — so
 * everything is read from the service's own engine data:
 *
 *   1. its KIND (consultation · review · flash · custom), from its NAME, else its description, else
 *      "other" — it orders the list (the talks first) and places the custom session beside
 *      "quoted in person";
 *   2. for flash, its SIZE (small · medium · large) from the name — each flash design links to the
 *      first flash appointment of its size, else to any flash appointment;
 *   3. who it is GOOD FOR: the part after "Good for:" in the description;
 *   4. its LENGTH: the time in the chair; its PRICE: paid at the studio, never online; zero is free.
 *
 * The site never invents an appointment: an owner who renames, removes or adds services sees exactly
 * the engine's list, in the dashboard's order. Stable categories need an engine version — see
 * docs/ENGINE-PROPOSAL-tattoo-studio.md in the Niche Pack workspace.
 */
export type SessionKind = 'consult' | 'review' | 'flash' | 'custom' | 'other';
export type FlashSize = 'small' | 'medium' | 'large';

/** Checked in this order: "Design Review" is a review, "Small Flash Tattoo" flash, "Custom Tattoo Session" custom. */
const KINDS: { id: Exclude<SessionKind, 'other'>; test: RegExp }[] = [
  { id: 'consult', test: /\b(consult\w*|conversation|first (?:meeting|visit|talk)|chat|intro\w*)\b/i },
  { id: 'review', test: /\b(review|design (?:check|meeting|discussion)|drawing|stencil (?:test|check)|placement)\b/i },
  { id: 'flash', test: /\b(flash)\b/i },
  { id: 'custom', test: /\b(custom|session|half[- ]day|full[- ]day|sitting|tattoo)\b/i },
];

export const KIND_LABEL: Record<SessionKind, string> = {
  consult: 'Consultation',
  review: 'Design review',
  flash: 'Flash',
  custom: 'Custom session',
  other: 'Appointment',
};

const norm = (s: string | null | undefined) => (s ?? '').trim().replace(/\s+/g, ' ');

function kindFromText(text: string): SessionKind | null {
  for (const k of KINDS) if (k.test.test(text)) return k.id;
  return null;
}

/** "Small Flash Tattoo" → flash; "Consultation" → consult; "Cover-up" → other. */
export function kindOf(service: Pick<Service, 'name' | 'description'>): SessionKind {
  return kindFromText(service.name) ?? kindFromText(lead(service.description)) ?? 'other';
}

/** "Small Flash Tattoo" → small; "Medium Flash" → medium; "Flash — Large" → large; "Flash Tattoo" → null. */
export function flashSize(service: Pick<Service, 'name'>): FlashSize | null {
  const n = service.name;
  if (/\b(small|tiny|mini|little)\b/i.test(n)) return 'small';
  if (/\b(medium|mid)\b/i.test(n)) return 'medium';
  if (/\b(large|big)\b/i.test(n)) return 'large';
  return null;
}

/** True for the appointments that are a talk, never a tattoo. */
export const isTalk = (s: Pick<Service, 'name' | 'description'>) => {
  const k = kindOf(s);
  return k === 'consult' || k === 'review';
};

/**
 * The name the page sets large: without the word every appointment shares
 * ("Small Flash Tattoo" → "Small Flash"; "Custom Tattoo Session" → "Custom Session").
 * The full name stays in the booking sheet, the summary and every email.
 */
export function shortName(name: string): string {
  const stripped = norm(name.replace(/\b(tattoo|appointment)\b/gi, ' ').replace(/\s*[—–\-·:|/(),&]+\s*$/g, ''));
  return stripped || norm(name);
}

/** For the booking sheet: the talks first, then the tattoo appointments, each in the owner's order. */
export interface Kind {
  id: 'start' | 'sessions';
  label: string;
  services: Service[];
}

export function kinds(services: readonly Service[]): Kind[] {
  const start = services.filter(isTalk);
  const rest = services.filter((s) => !isTalk(s));
  const groups: Kind[] = [];
  if (start.length) groups.push({ id: 'start', label: 'Talk first — no tattooing', services: start });
  if (rest.length) groups.push({ id: 'sessions', label: start.length ? 'Tattoo appointments' : 'Appointments', services: rest });
  return groups;
}

/** The services in page order: the talks first, then the owner's order. */
export function indexOrder(services: readonly Service[]): Service[] {
  return kinds(services).flatMap((k) => k.services);
}

/** The first service of a kind, in page order. */
export function firstOfKind(services: readonly Service[], kind: SessionKind): Service | null {
  return indexOrder(services).find((s) => kindOf(s) === kind) ?? null;
}

/** The flash appointment for a design of this size: that size first, else the first flash of any size. */
export function flashFor(services: readonly Service[], size: FlashSize): Service | null {
  const flash = indexOrder(services).filter((s) => kindOf(s) === 'flash');
  return flash.find((s) => flashSize(s) === size) ?? flash[0] ?? null;
}

export interface Described {
  lead: string;
  /** "Wrists, ankles…" — the part after "Good for:", or null. */
  goodFor: string | null;
}

const GOOD_FOR = /(?:^|[\s.])(?:good for|best for|ideal for)\s*:\s*/i;

function lead(description: string | null | undefined): string {
  return splitDescription(description).lead;
}

/** "…included in the time. Good for: wrists" → { lead: "…included in the time.", goodFor: "Wrists" }. */
export function splitDescription(description: string | null | undefined): Described {
  const text = (description ?? '').trim();
  const m = GOOD_FOR.exec(text);
  if (!m) return { lead: text, goodFor: null };
  const raw = text.slice(m.index + m[0].length).trim().replace(/\.$/, '');
  return {
    lead: text.slice(0, m.index + (m[0].startsWith('.') ? 1 : 0)).trim(),
    goodFor: raw ? raw[0].toUpperCase() + raw.slice(1) : null,
  };
}

/** Kept for the shared booking flow: every appointment is at the studio, so there is no format to show. */
export function formatOf(_service: Pick<Service, 'description'>): { kind: 'studio'; label: string } | null {
  return null;
}

/** The booking sheet shows the appointment's full name. */
export function splitName(name: string): { base: string; size: string | null } {
  return { base: name, size: null };
}

export type Role = SessionKind;
export function roleOf(service: Pick<Service, 'name'>): Role {
  return kindOf({ name: service.name, description: null });
}

/** "45 min", "1 h 20 min", "2 h" — the appointment's length, straight from the engine. */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** "30 min", "60 min", then "2 h", "3 h". */
export function minutesLabel(minutes: number): string {
  return minutes <= 90 ? `${minutes} min` : durationLabel(minutes);
}

/** The same, for screen readers. */
export function durationSpoken(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${minutes} minutes`;
  const hours = `${h} hour${h > 1 ? 's' : ''}`;
  return m ? `${hours} ${m} minutes` : hours;
}

/** What the booking's LENGTH means: the time in the chair (or at the desk, for a talk). */
export interface TimeTerms {
  role: Role;
  label: string;
  note: string | null;
}

export function timeTerms(service: Pick<Service, 'name' | 'description'>): TimeTerms {
  const role = kindOf(service);
  if (role === 'custom') return { role, label: 'Session', note: 'Larger pieces take more than one session' };
  return { role, label: 'Length', note: null };
}

type PriceInput = Pick<Service, 'priceCents' | 'priceFrom' | 'currency' | 'name' | 'description'>;

/** Whole dollars print without ".00" — "$140", not "$140.00". */
const money = (cents: number, currency: string, locale: string) => formatMoney(cents, currency, locale).replace(/([.,])00(?!\d)/, '');

/**
 * What the engine's price MEANS on this site:
 *   free    → no charge
 *   rate    → a custom session: the price of the time, not of a piece
 *   from    → a starting price; the artist confirms it before the appointment
 *   fixed   → the price of this appointment, paid at the studio — not online
 *   request → no price shown: ask the studio
 */
export interface PriceTerms {
  kind: 'free' | 'from' | 'fixed' | 'rate' | 'request';
  label: string;
  amount: string;
  note: string | null;
}

export function priceTerms(service: PriceInput, locale: string): PriceTerms {
  if (service.priceCents === null) return { kind: 'request', label: 'Price', amount: 'Ask the studio', note: null };
  if (service.priceCents === 0) return { kind: 'free', label: 'Price', amount: 'Free', note: 'No charge' };
  const amount = money(service.priceCents, service.currency, locale);
  if (service.priceFrom) return { kind: 'from', label: 'From', amount, note: 'Confirmed with you before the appointment' };
  if (kindOf(service) === 'custom') return { kind: 'rate', label: 'Per session', amount, note: 'A session rate — not the price of a piece' };
  return { kind: 'fixed', label: 'Price', amount, note: null };
}

/** One line: "$140", "from $140", "$450 per session", "Free", "Ask the studio". */
export function priceLabel(service: PriceInput, locale: string): string {
  const t = priceTerms(service, locale);
  if (t.kind === 'from') return `from ${t.amount}`;
  if (t.kind === 'rate') return `${t.amount} per session`;
  return t.amount;
}

/** The lowest priced service in a list (for "Flash from $140"), or null. */
export function cheapest(services: readonly Service[]): Service | null {
  const priced = services.filter((s) => s.priceCents !== null && s.priceCents > 0);
  priced.sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0));
  return priced[0] ?? null;
}

/** The shortest and longest appointment lengths ("30 min–3 h"), or null. */
export function lengthRange(services: readonly Service[]): string | null {
  if (services.length === 0) return null;
  const mins = services.map((s) => s.durationMinutes);
  const lo = Math.min(...mins);
  const hi = Math.max(...mins);
  return lo === hi ? minutesLabel(lo) : `${minutesLabel(lo)}–${minutesLabel(hi)}`;
}
