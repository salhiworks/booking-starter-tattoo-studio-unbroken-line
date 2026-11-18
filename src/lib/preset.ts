import type { Preset } from '@profitstudio/booking-engine';

/**
 * Ligne Tattoo's own preset (INTEGRATION.md §5): the sample appointments, hours and policies preview
 * mode shows, and the starter set the dashboard offers an owner who has no services yet
 * (<BookingAdmin presets>). Prices are in US dollars, in cents.
 *
 * WHAT A BOOKING IS HERE. One booking = ONE appointment: a reserved block of the artist's time with ONE
 * client, at the studio, on the studio's one calendar (one artist, one chair), for ONE service. Its
 * length is the time in the chair (or at the desk, for a talk); the buffer after it is cleaning down
 * and setting up again. The artist reviews and confirms every request (`autoConfirm: false`).
 *
 * WHAT A PRICE IS HERE. The engine has one price per service:
 *   - consultation and design review: free (price 0) — talk, never a tattoo;
 *   - flash: the price of that flash size, one design from the flash sheet, paid at the studio;
 *   - custom session: a SESSION RATE for a block of time, paid at the studio — never the price of a
 *     piece. Custom work is drawn and quoted at a consultation; larger pieces take more than one
 *     session, booked one at a time. The site says so wherever the rate appears.
 * Nothing is paid online and there are no deposits (they need an engine with payments).
 *
 * Honest tattooing: a description never promises how a tattoo heals or ages, never claims a healed
 * result, and the booking form never asks for health or medical details (see CLAUDE.md).
 * A description may end with "Good for: …" — who it usually suits, in plain terms. The website shows
 * it as its own line.
 *
 * The website reads each appointment's KIND (consultation · review · flash · custom) and a flash
 * SIZE (small · medium) from its name (src/lib/services.ts) — to order the list, to link each flash
 * design to its size, and to place the custom session beside "quoted in person".
 */
export const sitePreset = {
  id: 'tattoo-studio',
  label: 'Tattoo Artist Studio',
  terminology: { customer: 'client', customers: 'clients', booking: 'appointment', bookings: 'appointments' },
  previewBusiness: {
    name: 'Sample Tattoo Studio',
    currency: 'USD',
    locale: 'en-US',
    contact: {
      email: 'hello@example.com',
      phone: '+1 401-555-0100',
      address: '100 Example Street, Providence, RI',
    },
  },
  policies: {
    slotIntervalMinutes: 30,
    minNoticeMinutes: 2880,
    maxAdvanceDays: 60,
    autoConfirm: false,
    requirePhone: true,
    pendingHoldMinutes: 1440,
    verificationWindowMinutes: 15,
  },
  // One artist: Tuesday to Saturday, a later Thursday; closed Sunday and Monday (drawing days).
  workingHours: [
    { weekday: 2, start: '11:00', end: '18:00' },
    { weekday: 3, start: '11:00', end: '18:00' },
    { weekday: 4, start: '13:00', end: '20:00' },
    { weekday: 5, start: '11:00', end: '18:00' },
    { weekday: 6, start: '10:00', end: '16:00' },
  ],
  services: [
    {
      name: 'Consultation',
      description:
        'Half an hour at the desk to talk through your idea, where it would sit and how big. You leave with an honest idea of how many sessions it needs and what a session costs — or the suggestion that a flash design would suit better. No tattooing, nothing to pay. Good for: every custom idea, and anyone with a first tattoo in mind',
      durationMinutes: 30,
      bufferAfterMinutes: 15,
      priceCents: 0,
      priceFrom: false,
    },
    {
      name: 'Design Review',
      description:
        'See the drawing for your custom piece before the tattoo day, try a test stencil on the skin for placement and size, and change what needs changing. No tattooing. Good for: clients whose custom piece was agreed at a consultation',
      durationMinutes: 30,
      bufferAfterMinutes: 15,
      priceCents: 0,
      priceFrom: false,
    },
    {
      name: 'Small Flash Tattoo',
      description:
        'One design from the flash sheet, up to about 5 cm (2 in) — stencil, placement and tattooing included in the time. Name the design in your booking note. Good for: wrists, ankles, inner arms and a first tattoo',
      durationMinutes: 60,
      bufferAfterMinutes: 30,
      priceCents: 14000,
      priceFrom: false,
    },
    {
      name: 'Medium Flash Tattoo',
      description:
        'One design from the flash sheet, up to about 10 cm (4 in) — stencil, placement and tattooing included in the time. Name the design in your booking note. Good for: forearms, calves, shoulder blades and ribs',
      durationMinutes: 120,
      bufferAfterMinutes: 30,
      priceCents: 26000,
      priceFrom: false,
    },
    {
      name: 'Custom Tattoo Session',
      description:
        'A three-hour session for a custom design agreed at your consultation. This is a session rate, not the price of a piece: larger work takes more than one session, each booked on its own, and the artist confirms every request. Good for: clients who have had their consultation',
      durationMinutes: 180,
      bufferAfterMinutes: 30,
      priceCents: 45000,
      priceFrom: false,
    },
  ],
} satisfies Preset;
