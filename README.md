# Tattoo Artist Studio Booking Website — "Unbroken Line" Starter

A finished, premium booking website for an independent tattoo artist who works one client at a time,
ready to make your own with Claude Code and publish on Hostinger. It ships as **Ligne Tattoo**, a
fictional one-artist single-line and fine-line studio on Wickenden Street in Providence, Rhode Island:

- a one-page studio website set like the artist's own workroom — white walls, drawings taped up,
  sheets of tracing paper and one violet stencil line. A first screen with a very large headline
  ("One line, *never lifted.*"), **Book an appointment**, a ledger of live facts from the booking
  system (the free consultation, flash from, the custom session rate) and a photograph of the artist
  at work with a sheet of tracing paper laid over it, a figure drawing itself on it in one line;
  **recent work** as level rows of prints — on skin and on paper — with a filter and a viewer;
  **flash, ready to book**: eight sample designs, each drawn in one continuous line, that trace
  themselves in stencil violet as you point at them, each with its size, length and price and a Book
  button that writes the design into your booking note; **from paper to skin** — talk, draw, stencil,
  tattoo — on a skin-tone band with one line threading the four steps; **what it costs**, with every
  appointment's real length and price and *custom work is quoted in person* beside it; questions and
  sample policies (labelled); the booking band; directions — from 320 px phones to ultrawide
  monitors, with booking in a sheet over the page;
- online booking — **one appointment per booking**, a day and time, contact details and an optional
  note, and an emailed 6-digit code; the artist confirms each request;
- the owner dashboard at `/admin/` — requests to confirm, appointments and prices, hours and
  closures, email health, and the website's own text, photos, flash and line colour.

The look — *Unbroken Line*: wall white, tracing paper, a warm skin band and ink, with one stencil-violet
line as the only colour; Syne (wide, quiet at medium weight) for headings, Familjen Grotesk for
reading and every figure, Spline Sans Mono for small labels; one ornament, the line — never lifted.

Booking runs on [`@profitstudio/booking-engine`](https://www.npmjs.com/package/@profitstudio/booking-engine)
**2.0.0-beta.4** (pinned) with your own Supabase project and Resend for email.

## 1. Try it (no accounts needed)

```bash
npm install
npm run dev:demo   # the full Live Demo: book, then manage it at /admin/
npm run dev        # preview mode: the website with sample times, nothing saved
```

In the Live Demo everything stays in your browser — nothing is sent anywhere.

## 2. Make it yours with Claude Code

Open this folder in a Claude Code session and paste the prompt in
[`CUSTOMIZE.md`](CUSTOMIZE.md), filled in with your studio. Claude edits a short list of files
(name, city, words, colours) — the booking system, the dashboard and the layout stay as they are.

Appointments, prices, hours and contact details are **not** code: you set them in the dashboard once
the booking backend is connected. The page reads each appointment's kind from the words in its name
(consultation · design review · flash, with its size · custom session — see `CUSTOMIZE.md`). **Your
own photographs and flash drawings** go in the dashboard → Website. Each sample photo stays labelled
"Sample photo" (the flash "Sample designs") until you replace it; use only your own work and studio,
and photos of clients only with their written permission. Your name, training, years and awards are
yours to add: the starter invents none, and it never shows a healed result it doesn't have.

**A booking is one appointment.** The booking engine books single appointments on one calendar — one
artist's time, one client, one service. It does not take deposits or payments, collect health or
consent forms, link bookings into multi-session projects, run guest artists' or several calendars,
or price custom work automatically (see *What the engine does not do* in `CLAUDE.md`). Custom pieces
start with a free consultation and are quoted in person; a custom session's price is a **session
rate**, not the price of a piece. Everything is paid at the studio. The studio tattoos adults 18 and
over.

## 3. Connect real bookings

You need a free Supabase project and a Resend account for booking emails.

```bash
cp .env.example .env.local    # your Supabase Project URL + Publishable key
npx supabase@2 login          # once, in your own terminal
npx booking-engine connect --admin you@example.com
```

`connect` links the project, sets up the database and the booking-email function, and tells you
exactly what is left for you to do (your dashboard login and the two email secrets). Full steps:
the Profit Studio guide *Build a Premium Booking Website with Claude Code*, Step 3, or
`node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` §11.

Never put a Supabase **Secret** key or your Resend API key in `.env.local`, in a prompt or in
Hostinger — the Resend key lives only in Supabase's Edge Function secrets.

## 4. Publish on Hostinger

Push this project to a private GitHub repository, then in Hostinger create a **Web App** from it
(Websites → Create site → Web App → Import Git Repository):

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` (never `build:demo`) |
| Output directory | `dist` |
| Node.js | 22 or newer |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (public values only) |

`dist/` contains the website and `dist/admin/` the dashboard. Every push to `main` redeploys.

## What is in this folder

| | |
|---|---|
| `src/site.config.ts` | The business name, time zone and preview contact details |
| `src/content/site.ts` | Everything the owner can edit in the dashboard → Website, with its default text and photos |
| `src/styles/tokens.css` | The design's colours, type and spacing (one file); `DESIGN.md` explains the system |
| `src/components/` | The website (`Hero`, `Work` (rows of prints, filter, viewer), `Flash`, `Process`, `Prices`, `GoodToKnow`, `Visit`…), the line ornaments (`SectionLabel.tsx`, `LineDrawing.tsx`) and the booking flow (`src/components/booking/`) |
| `src/lib/flashLines.ts` | The eight sample flash designs, each one continuous line (generated) |
| `src/lib/preset.ts` | The sample appointments and hours used by preview mode and offered in a new dashboard |
| `src/lib/services.ts` | How appointments find their kind and flash size (by the words in their names), "Good for:", lengths and prices |
| `admin/` + `src/admin-main.tsx` | The packaged dashboard, mounted at `/admin/` |
| `src/demo/` | The Live Demo's in-browser engine and sample data — used only by `dev:demo` / `build:demo`; a normal build contains none of it |
| `supabase/` | The engine's database migrations and email function (managed by `npx booking-engine`; do not edit) |
| `CLAUDE.md`, `BOOKING_ENGINE.md` | Rules Claude Code follows in this project |
| `PHOTOS.md` | The Pexels photos (Pexels License), credited file by file |

## Commands

```bash
npm run dev          # preview mode (sample data) until .env.local exists — http://localhost:5253
npm run dev:demo     # the Live Demo (in-browser data, dashboard included)
npm run build        # production build → dist/
npm run build:demo   # the public Live Demo build → dist/ (never deploy this as your site)
npx booking-engine doctor             # checks versions, engine files and keys
npx booking-engine doctor --dist dist # after a build: also scans the output for secrets
```

## Licence

The code is MIT-licensed — see [`LICENSE`](LICENSE) (Copyright (c) 2026 Youssef Es-salhi).
Photographs and other third-party assets keep their own terms, listed in [`ASSETS.md`](ASSETS.md)
(the photographs file by file in [`PHOTOS.md`](PHOTOS.md)). The eight sample flash drawings were generated for this starter
(`src/lib/flashLines.ts`) and are MIT-licensed with the code.
