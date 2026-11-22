# Tattoo Artist Studio "Unbroken Line" Starter — project rules

A one-page booking website for an independent tattoo artist who works with one client at a time,
shipped as **Ligne Tattoo** (a fictional one-artist single-line and fine-line studio in Providence,
RI: a free consultation, a free design review, small and medium flash, and a custom tattoo session —
one client per appointment, at the studio) for the owner to make their own. Its identity lives in
`src/site.config.ts`; `CUSTOMIZE.md` is the prompt that personalizes it. Built around
**@profitstudio/booking-engine** **2.0.0-beta.4** (pinned; lock in `booking-engine.lock.json`). The
engine owns booking; this project owns the public design.

Read before changing anything:
- `BOOKING_ENGINE.md` — the engine's rules (engine-owned; `npx booking-engine sync` replaces it).
- `node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` — the full contract. It wins on technical points.
- `DESIGN.md` — the visual system. `PHOTOS.md` — photo sources and licences.

## The Live Demo layer — leave it alone

- `src/demo/` is the public Live Demo's in-browser engine and sample data. Only
  `npm run dev:demo` / `npm run build:demo` use it (`vite --mode demo` defines
  `__BOOKING_DEMO__`); in every other build it is compiled out. Never read, edit
  or "fix" it while customizing the website.
- Keep the `__BOOKING_DEMO__ ? … : …` branches as they are: the demo wording
  (no email is sent) must stay true in the demo, and the real wording in production.
- `src/demo/engine/` is vendored from the Niche Pack workspace — edit it there.
- `src/admin-main.tsx` passes `emailDelivery={__BOOKING_DEMO__ ? 'none' : undefined}`:
  only the demo's dashboard says no email is sent. Never set it on a real site.

## Engine boundaries (from BOOKING_ENGINE.md)

- All booking data goes through the ONE instance in `src/lib/engine.ts`. Never import
  `@supabase/supabase-js` for booking data, call `booking_*` RPCs or write SQL for booking tables.
- Never edit `supabase/migrations/*_booking_engine_*.sql`, `supabase/functions/booking-mailer/`,
  `booking-engine.lock.json` or `node_modules`.
- Only the publishable key may reach the website (`VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`,
  both or neither). Never a secret/`service_role` key, never an email provider key, in any file or `VITE_` variable.
- Show only the slots `getAvailability()` returns; send `slot.startsAt` back unchanged; show dates and
  times in `business.timezone`. Never compute availability in the browser — the calendar only reshapes
  engine data with the engine's helpers (`monthGrid`, `groupSlotsByPartOfDay`, `isFewLeft`, `nextAvailableDay`…).
- Label slot times with the server's business-local `slot.time` / `confirmation.time` via `formatClockTime`.
- Book in two steps: `requestBooking()` → code step → `verifyBooking()`. "Send a new code" =
  `resendVerificationCode()`; "Choose another time" = await `cancelBookingRequest()`, then reload availability.
- Handle `ok: false` on every call. Show success only after `verifyBooking()` returned `ok: true`
  (pending → "Request received — we'll review your appointment and confirm the time shortly.",
  confirmed → "Your appointment is booked."). Preview answers `PREVIEW_MODE`: say so honestly, never a success screen.
- Read the engine's answer strictly (`src/lib/bookingStatus.ts`): say "booked" only when `status === 'confirmed'`
  and "request received" only when it is `'pending'` — never treat "not pending" as booked. `BOOKING_INACTIVE`
  (the code was accepted earlier, but the request was declined, cancelled or not confirmed in time) is never a
  success: show "This request is no longer active. Please choose a new time or contact the business." with the
  reference, go back to the times, and forget the remembered code so no recovery path verifies it again.
- `business.policies.onlineBookingEnabled === false` (or `BOOKING_DISABLED`) → contact details instead of the flow.
- The engine sends every booking email. Never add an email service to the website.
- Keep the packaged dashboard on `/admin/` (`admin/index.html` → `src/admin-main.tsx`). Never fork or restyle it:
  `src/admin-theme.css` sets only `--pbe-accent` / `--pbe-accent-text` per mode.

## What the engine does not do — never fake it

**One booking = one appointment: a reserved block of the artist's time with ONE client, for one
service, on one calendar (one artist, one chair), at the studio.** Its length is the time in the
chair (or at the desk, for a talk); the buffer after it is cleaning down and setting up. Prices are
paid at the studio — never online, no deposits. The artist reviews and confirms every request
(`autoConfirm: false`).

**Custom work is quoted in person.** A custom piece starts with a free consultation; the site never
prices a custom design, never estimates sessions from a form, and labels the custom session's price
as a **session rate — not the price of a piece** (`priceTerms` kind `rate`). Larger pieces take
several sessions, each booked on its own — never presented as a package, a project or a combined price.

**Kinds are read from names.** "Consultation", "Design Review", "Small Flash Tattoo", "Medium Flash
Tattoo", "Custom Tattoo Session" are ordinary engine services; the website only reads their KIND
(consult · review · flash · custom) and a flash SIZE (small · medium · large) from the words in the
name (`src/lib/services.ts`) — to list the talks first, to link each flash design to the flash
appointment of its size (else any flash appointment; with none, the card has no Book button), and to
mark the custom session as a session rate.

**Flash.** A flash card's Book button opens its flash appointment and writes "Flash F-03 · Crescent &
star" into the booking note — replacing only a note an earlier card wrote, never what the client
typed (`BookingFlow`, `intent.note`). The design is a note, not a reservation: the engine does not
hold a design for one client.

**Honest tattooing.** Never invent the artist's name, training, licences, years, awards, press,
guest spots, reviews, testimonials or healed results; never call fresh work healed; never promise how
a tattoo will heal, age or look; never show another artist's work as the studio's. The *Good for:*
line names a placement or a situation ("wrists, ankles and a first tattoo") — never an outcome.

**Health and age.** The studio tattoos adults 18 and over with photo ID (the name field's hint says
so). The booking form never asks for health, medical, allergy, pregnancy or medication details, and
the notes field tells clients not to write them — they talk to the artist in person. The booking
system screens nobody and the site never implies it does.

A new booking feature needs a new engine version — never custom database code or browser-side logic:

- deposits, cancellation fees, gift cards or any online payment;
- consent or medical intake forms, ID checks, file uploads (reference images);
- linked or multi-session bookings, projects, series;
- several artists, guest artists or calendars; rooms or chairs;
- holding a flash design for one client, waitlists.

The booking notes field is **Anything the artist should know? (optional)** with the helper "For
example the flash design (F-03), the placement you have in mind and a rough size. Please don't
include health or medical details here — talk to the artist in person." Proposed engine work:
`docs/ENGINE-PROPOSAL-tattoo-studio.md` in the Niche Pack workspace.

## Where things live

| What | Where |
|---|---|
| Engine instance (preview: name, `America/New_York`, placeholder contact) | `src/lib/engine.ts` |
| This site's preset (sample appointments, hours, policies; "clients"/"appointments") — also the dashboard's starter set | `src/lib/preset.ts` (`sitePreset`) |
| Kind (consult · review · flash · custom · other) and flash size from the name, page order (talks first), booking-sheet groups (`kinds`), `flashFor`, "Good for:" parsing, length and price terms (session rate), `cheapest`, `lengthRange` | `src/lib/services.ts` |
| The eight sample flash designs, each one continuous line (generated — `concepts/tattoo-studio-unbroken-line/flash-lines/generate.mjs`) | `src/lib/flashLines.ts` |
| What the owner can edit (every text and photo — hero photo and tracing-sheet note, ten work photos and captions, the flash list (name, size, placement, drawing) and its photo, the four process steps and photos, the custom-work panel and photo, questions & policies, booking words and photo, finding-us note and photo, logo, line colour) | `src/content/site.ts` (`defineSiteContent`) |
| Content store + brand → CSS variable (`--accent`) | `src/lib/content.ts` |
| Design tokens — the ONLY file with raw colours, fonts, sizes, spacing | `src/styles/tokens.css` |
| Base / page / booking styles (tokens only) | `src/styles/base.css`, `site.css`, `booking.css` (note: booking.css owns `.sheet` (the booking dialog), `.rail`, `.parts`, `.part`, `.pick`, `.time`, `.summary` — the page uses its own names: `.tracing`, `.print`, `.flash-card`, `.step`, `.row`, `.custom`) |
| Sections | `src/components/*.tsx` (Header (the line as scroll progress), Hero `#top` (live facts, open-now, tracing sheet with a drawing), Work `#work` (level rows, filter, viewer dialog), Flash `#flash`, Process `#process` (skin band, the threaded line), Prices `#prices` (ledger + custom work), GoodToKnow `#questions`, BookingSection `#book`, Visit `#visit`, Footer); the section label and its line `SectionLabel.tsx`; one-line drawings `LineDrawing.tsx`; scroll reveals `src/lib/reveal.ts` (`data-reveal`); the section list for header, phone menu and footer is `src/lib/nav.ts` |
| Booking sheet (a modal `<dialog>` at `#book`; Back/Esc/✕ close it) + the `#book` band | `src/App.tsx` (open/close + history, `startBooking(serviceId, note)`), `src/components/booking/BookingSheet.tsx`, `BookingSection.tsx`, `src/lib/dialog.ts` |
| Booking flow | `src/components/booking/` (BookingFlow = state + engine calls, root `#book-flow`; DayPicker, TimePicker, DetailsForm, CodeStep, Summary, Done) |
| "Open now" + hours changes | `src/lib/useOpening.ts`, `src/lib/hours.ts` |
| Photo variant map | `public/photos/`, `src/content/photoVariants.ts` (generated by `concepts/tattoo-studio-unbroken-line/photo-pipeline/photos.mjs`) |
| Content baked into `index.html` at build | `vite.config.ts` (`publishedSiteContent`) |

## Rules for future changes

- **Content fields:** render values as text (never `dangerouslySetInnerHTML`), images from the resolved
  `src`/`alt`. Never rename or reuse a field id on a live site — add a new id. Services, prices,
  lengths, hours, the address, phone and email are NOT content: they come from the engine.
- `src/content/site.ts` is also imported by `vite.config.ts` (Node): keep it free of local imports.
- **Every Book button** calls `startBooking()` (App): it opens the sheet, or — while online booking is off,
  unconfigured or failing — leads to the `#book` section and its contact details. An appointment's or a
  flash card's Book button passes THAT service's engine id — never a stored price or id.
- **Lengths and prices:** always from the engine (`minutesLabel`, `durationLabel`, `priceLabel`, `priceTerms`).
  Never hard-code an appointment, length, price or id in copy (questions and process steps included).
- **Sample photos and designs:** every photo carries a "Sample photo" label until the owner replaces that
  field (`ownerFields`); the flash sheet says "Sample designs" until the owner sets `flash.items`. Never
  present a stock photograph as the studio's artist, a client or the studio's work.
- **Default photos:** add variants to `public/photos/` via the photo pipeline, keep the default `src`
  in `site.ts` equal to a key in `photoVariants.ts`, record the source in `PHOTOS.md`. If the
  first-screen default changes, update the `<link rel="preload">` in `index.html` (`imagesizes` must
  match `HERO_SIZES` in `src/components/Hero.tsx`).
- **Policies:** Before you book shows a "Sample policies" label until the owner edits `faq.items`.
- **Copy:** calm, precise, plain ("one line, never lifted"); no "best tattoo shop", "award-winning",
  "guaranteed", "flawless healing", "ink addicts", no pressure, no healing promises.
- **Style:** plain CSS with the tokens; no UI kit. 44 px tap targets, visible focus, the
  `prefers-reduced-motion` path, every text/background pair at 4.5:1 (`contrast.mjs` in the concept
  folder). The line colour is owner-editable and always carries white text where it fills (selected
  choices); buttons are ink and turn to the line colour on hover; the skin band and the ink footer are
  fixed so their contrast is known.
- **Composition (DESIGN.md):** wall white, tracing paper, skin, ink and one stencil-violet line; Syne
  headings with the emphasised words in the line colour and a line drawn under them; Familjen Grotesk
  for text and every figure, Spline Sans Mono for small labels only; the line as the one ornament (the
  hero's drawing, each section label's loop, the process thread, the flash tracing, the header
  progress, the footer); every section inside the one centred shell (`.shell`, `--page-max`). Motion
  — lines drawn, prints settling, the stencil traced on hover — is off under `prefers-reduced-motion`;
  never hide content without `html.js-reveal`.
- The public site stays one page (sections + in-page booking flow); no client-side path routes.

## Commands

```bash
npm run dev                              # http://localhost:5253 (preview mode without a backend)
npm run build                            # tsc -b && vite build (multi-page: / and /admin/)
npm run lint                             # oxlint (supabase/functions is ignored)
npm run dev:demo                         # the Live Demo: in-browser engine + dashboard, nothing sent
npm run build:demo                       # the public Live Demo build — never the production site
npx booking-engine doctor                # project check
npx booking-engine doctor --dist dist    # after a build: scans the output for secrets
```

Connecting a backend (Supabase, email) follows INTEGRATION.md §11 — only with the owner's go-ahead.
