# Make this starter yours — the Claude Code prompt

Fill in the four lines at the top, then paste the whole prompt into a Claude Code session opened in
this folder. It changes identity and words only, so it finishes in one short session.

```text
Customize this tattoo artist studio starter for my business.

Studio name: <YOUR STUDIO NAME>
City and area: <CITY, AREA>
Time zone (IANA): <e.g. America/Denver>
My style and how I work, in a few words: <e.g. fine-line botanicals and blackwork, custom pieces and a small flash sheet>

Follow CLAUDE.md (already loaded in this session — no need to open it again).
Open and change only these files; don't explore the rest of the project:
1. src/site.config.ts — name, timezone, and fictional previewContact details in my city.
2. index.html and admin/index.html — the studio name, city and description in <title>,
   the meta description and the og tags.
3. src/content/site.ts — rewrite every DEFAULT text for my studio: the name mark and the line
   beside it, what I am and where, the headline (short — it is set very large), introduction, main
   button and the note on the tracing sheet, the work heading, introduction and ten captions, the
   flash heading, introduction, small print and the names, sizes (Small or Medium) and placements
   of the designs, the process heading, introduction and four steps, the prices heading,
   introduction, the custom-work text and what a quote depends on, the questions & policies (my
   real policies), the booking heading and introduction, the finding-us note, the footer line and
   the search title and description. Keep field ids, types, limits and photos. Keep the sample
   photos (they stay labelled "Sample photo" until I upload my own).
   Keep the honesty rules: one booking is one appointment with one client — no guest spots, group
   bookings, packages or memberships; custom work is quoted in person and a custom session's price
   is a session rate, never the price of a piece; no invented awards, certifications, years of
   experience, press, reviews, testimonials or healed results; the booking form never asks for
   health or medical details; adults 18 and over with photo ID; nothing is paid online and there
   are no deposits; no appointment lengths or prices written into the copy.
4. Only if stencil violet clearly doesn't fit my brand (otherwise skip this step): change the
   default of brand.accent in src/content/site.ts (a deep colour that keeps white text at 4.5:1 —
   ink blue, oxblood, forest, graphite) and the light colour in src/admin-theme.css. The skin
   band, the ink buttons and the ink footer are part of the design and stay.

Do not change the layout, the booking flow, src/lib/engine.ts, src/lib/preset.ts,
src/lib/services.ts, src/lib/flashLines.ts, src/demo/, supabase/, booking-engine.lock.json or
package.json. Do not invent appointments, prices, opening hours or credentials I haven't told you
about — appointments, prices and hours are set in the dashboard. When done, run npm run build and
fix any error, then show me the result with npm run dev.
```

## After the prompt

- **Your appointments:** dashboard → Services. One booking is one appointment with you, for one
  service, with one client.
  - **Kinds.** The page reads each appointment's kind from the words in its name (then its
    description): *consultation, conversation, chat, intro* → **Consultation**; *review, drawing,
    stencil check, placement* → **Design review** (both listed first, as "Talk first — no
    tattooing"); *flash* → **Flash**, with its size from *small / mini* or *medium* or *large*;
    *custom, session, sitting, half-day, tattoo* → **Custom session**. Anything else is a plain
    appointment.
  - **Custom sessions.** The price of a custom session is shown as a **session rate** ("$450 per
    session — not the price of a piece"). Keep it that way: custom work is quoted at the consultation.
  - **Who it's for.** End a description with `Good for:` — `Good for: wrists, ankles and a first
    tattoo`. Describe a placement or a situation, never a promised result.
  - **Free talks.** A price of 0 shows as **Free** everywhere, including the first screen.
- **Flash:** Website → Flash. Each design has a name, a size (**Small** or **Medium**) and where it
  sits well; its Book button opens the flash appointment of that size and writes "Flash F-03 ·
  Crescent & star" into the booking note. Add a square photo or scan of your own drawing to each
  design. Until you set your own list, the site shows its eight sample line drawings, labelled
  "Sample designs".
- **Work:** Website → Work — photos 1–6 are shown under *On skin*, 7–10 under *On paper*. Never call
  fresh work healed, and never show another artist's tattoo as yours.
- **Headings:** wrap a word or two in *asterisks* to set them in the line colour with a line drawn
  under them.
- **Photos:** Website → each section. Use only your own work and studio, and clients only with
  written permission. The "Sample photo" label disappears from each one you replace.
- **Online booking:** dashboard → Settings, once email sending works (see BOOKING_ENGINE.md).
