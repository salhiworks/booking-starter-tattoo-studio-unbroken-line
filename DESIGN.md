# Unbroken Line — the visual system

A fine-line artist's workroom in daylight. Single-line tattooing is a drawing made without lifting the
pen, transferred to skin through a violet stencil. The page is built from the same things — **a white
wall** with drawings taped to it, **tracing paper**, **a warm skin tone**, **black ink**, and **one
violet line that is never lifted**. No skulls, roses-and-daggers clip art, black-and-gold, neon,
grunge textures or "ink splatter"; no gradients; no stock icons.

## Tokens (src/styles/tokens.css — the only file with raw values)

| | |
|---|---|
| Wall `--paper` #fcfcfa | the reading pages |
| Tracing `--paper-2` #f2f1ed | flash boards, the questions band; and `--tracing` rgb(250 250 247 / 0.8) + 14 px blur — the translucent sheets laid over photographs |
| Skin `--skin` #ece4da | the process band (ink on it 15:1, `--on-skin-soft` 7.4:1) |
| Ink `--night` #141414 | the footer and the booking sheet's header; `--button` (every button is ink) |
| Ink text `--ink` #141414 | type (18:1 on the wall) |
| Line `--accent` #4c3cc0 | stencil violet — owner-editable: the line ornament, the flash tracing, emphasised words, section numbers, links, selected choices (white on it 7.6:1, as text 7.3:1 on the wall, 6:1 on skin). On ink it is lifted to `--line-on-night` #b9b1f2 (10:1) |
| Muted `--muted` #5f5d58 | secondary text (≥ 5.3:1 on every light field) |

The skin band, the ink buttons and the ink footer are fixed, so their contrast is known. The owner's
line colour never fills a large area: it draws.

Type:

- **Syne** (variable) for headings, the name mark and appointment names — wide, set at medium weight
  (500) with tight tracking (−0.03 to −0.045 em); 600 for card titles, 700 for the name mark.
- A heading's *emphasised* words are **the same face in the line colour, with one fine line pulled
  under them** as the heading arrives (`.hl`).
- **Familjen Grotesk** for reading text and every figure — prices, minutes, times, the booking sheet
  (`--font-mono` points at it for booking.css).
- **Spline Sans Mono** (`--font-label`) for small capital labels only — section names, "Good for",
  flash numbers (F-03), print numbers (S·01, P·07).

Shape: photographs cut square, like prints taped to a wall; buttons with a 2 px corner; thin ink
rules (1.5 px) at the top of lists, hairlines between rows. Tracing sheets sit 1–2° off square with a
soft shadow and two registration marks (+) at their corners.

## The one ornament: the line

One stroke in the stencil colour (`--line-w` 1.5 px), never lifted:

- **the first screen** — a figure (the fern from the flash sheet) draws itself on the tracing sheet
  over the photograph (`LineDrawing`, `pathLength` 1, 2.6 s);
- **every section label** — "01 WORK ——————∿——" — the line runs out of the label to the edge of the
  text with one loop in it (a rule that grows, then a fixed-size loop that is drawn, so it never
  stretches) (`SectionLabel`);
- **the process** — one line threading the four steps, a loop at each, drawn left to right;
- **the flash sheet** — each design is one continuous line in ink; on hover or focus the stencil copy
  traces itself in violet, offset 3 px like a transfer;
- **the header** — the line follows the page as it is read (scroll progress);
- **the footer** — the line crosses the name mark once, drawn as the footer arrives.

## Composition

- **First screen** (`#top`): headline left at `--text-hero` (by width and by height), the
  introduction, Book an appointment, *See the flash*, and a ledger of live facts (consultation · flash
  from · custom work). The upright photograph on the right takes the screen's height (4:5); the
  tracing sheet overlaps its lower left corner, reaching into the gutter. Phones: copy, then the
  photograph with the sheet over its foot.
- **Work** (`#work`): level rows of prints — each print grows in proportion to its own shape
  (`flex: r 1 r·row-h`), so a row shares one height whatever the photographs' shapes. All · On skin ·
  On paper filter; a print opens the viewer (a modal `<dialog>` on the wall: ← →, Esc).
- **Flash** (`#flash`): the heading, introduction and a stencil photograph sticky on the left (≥ 1080);
  the sheet of cards (2 columns on phones, 3, then 4 from 1280).
- **Process** (`#process`): the skin band; four steps in a row (≥ 1080), two (≥ 640); on phones each
  step's text stands beside a smaller photograph.
- **Prices** (`#prices`): the ledger (talks first, then tattoo appointments) and, sticky beside it, a
  photograph with a tracing sheet laid over it: *custom work is quoted in person*.
- **Before you book** (`#questions`): the heading sticky beside numbered questions.
- **Book** (`#book`): a wide studio photograph with the booking tracing sheet laid across its right
  side.
- **Visit** (`#visit`), then the **ink footer** with the name mark across the page.

Every section sits in one centred shell (`--page-max` 104rem). From 1600 px the reading sizes step up
and the first screen splits evenly; from 2200 px the flash cards and the tracing sheet grow.

## Motion

The hero's figure drawn on load; section lines drawn as each section arrives; prints, flash cards and
price rows settle in (`data-reveal`, only while `html.js-reveal` is set); the flash stencil traced on
hover/focus; print photos lean in on hover; buttons turn from ink to the line colour. Under
`prefers-reduced-motion` nothing is hidden and every line is already drawn.
