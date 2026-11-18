import { defineSiteContent } from '@profitstudio/booking-engine';

/**
 * What the owner may change in the dashboard (Website). The defaults are the
 * website's own copy and photos: until the owner publishes, the page shows
 * exactly these. Services, prices, lengths, hours, the address, phone and
 * email are NOT here — they come from the engine.
 *
 * Never rename or reuse a field id once the site is live: the owner's text is
 * stored under it. Add a new id instead.
 *
 * This file is also imported by vite.config.ts (Node), so it imports nothing
 * local. Default photo `src` values are keys of src/content/photoVariants.ts.
 *
 * Headings may wrap words in *asterisks*: those words are set in the line colour,
 * with one hand-drawn line pulled under them (Emphasis).
 *
 * Copy rules (CLAUDE.md): honest tattooing — no invented qualifications, years,
 * awards, press, reviews, testimonials or healed results; custom work is never
 * priced online (a session rate is the price of the time, not of a piece); the
 * booking form never asks for health or medical details.
 */
const SAMPLE_HELP =
  'A “Sample photo” label stays on it until you replace it with your own photo — use only photos of your own work and studio, of clients only with their written permission, or photos you have the right to use. Never show another artist’s tattoo as yours, and never call fresh work healed.';

type Img = { src: string; alt: string; width: number; height: number };
const P = (name: string, alt: string): Img => ({ src: `/photos/${name}-800.webp`, alt, width: 800, height: 1000 });
const T = (name: string, alt: string): Img => ({ src: `/photos/${name}-800.webp`, alt, width: 800, height: 1200 });
const L = (name: string, alt: string): Img => ({ src: `/photos/${name}-960.webp`, alt, width: 960, height: 640 });
const EMPHASIS = 'Wrap a word or two in *asterisks* to set them in the line colour, with a hand-drawn line under them.';
const WORK_PHOTO = `Shown in the work grid; its frame keeps its shape, so any photo fits. ${SAMPLE_HELP}`;

export const siteContent = defineSiteContent({
  sections: [
    {
      id: 'brand',
      label: 'Brand',
      description: 'Your name mark or logo and the colour of the line.',
      fields: [
        {
          type: 'text',
          id: 'brand.wordmark',
          label: 'Name mark',
          help: 'The name in the header and, very large, in the footer. One short word reads best.',
          default: 'Ligne',
          maxLength: 20,
          required: true,
        },
        {
          type: 'text',
          id: 'brand.descriptor',
          label: 'Line beside the name mark',
          help: 'What you are, in two or three words. Shown small beside the name.',
          default: 'Tattoo studio',
          maxLength: 28,
        },
        {
          type: 'image',
          id: 'brand.logo',
          label: 'Logo',
          help: 'Optional. A wide logo on a transparent background, drawn for a light background (the header is white). It replaces the name mark in the header.',
          default: null,
          aspectRatio: 4,
        },
        {
          type: 'color',
          id: 'brand.accent',
          label: 'Line colour',
          help: 'The stencil’s colour: the one continuous line, the flash drawings when they are traced, emphasised words, links and selected choices. Selected choices carry white text, so pick a deep colour — stencil violet (the original), ink blue, oxblood, forest, graphite. Light colours are refused because white text would not read on them.',
          default: '#4c3cc0',
          contrastWith: '#ffffff',
          minContrast: 4.5,
        },
      ],
    },
    {
      id: 'hero',
      label: 'First screen',
      description: 'The headline, a short introduction, the main photograph and the note on the tracing sheet.',
      fields: [
        { type: 'text', id: 'hero.kicker', label: 'What you are', default: 'Single-line & fine-line tattoo', maxLength: 40 },
        { type: 'text', id: 'hero.place', label: 'Where you are', help: 'A neighbourhood and city.', default: 'Fox Point, Providence', maxLength: 40 },
        {
          type: 'text',
          id: 'hero.title',
          label: 'Headline',
          help: `Short — it is set very large. ${EMPHASIS}`,
          default: 'One line, *never lifted.*',
          maxLength: 44,
          required: true,
        },
        {
          type: 'longText',
          id: 'hero.lede',
          label: 'Introduction',
          default:
            'A one-artist studio for single-line and fine-line tattoos. Custom pieces start with a free consultation; designs from the flash sheet can be booked straight away.',
          maxLength: 220,
          rows: 3,
        },
        { type: 'text', id: 'hero.cta', label: 'Main button', default: 'Book an appointment', maxLength: 28, required: true },
        {
          type: 'text',
          id: 'hero.note',
          label: 'Note on the tracing sheet',
          help: 'One short line, set on the sheet of tracing paper over the photo. Leave empty for none.',
          default: 'Every design is drawn here first — on paper, then as a stencil.',
          maxLength: 72,
        },
        {
          type: 'image',
          id: 'hero.photo',
          label: 'Main photo (upright)',
          help: `Upright (4:5), shown tall beside the headline. The artist at work reads best. ${SAMPLE_HELP}`,
          default: {
            src: '/photos/hero-artist-960.webp',
            alt: 'A tattoo artist with a dark fringe leans in close, a wrapped tattoo machine in her gloved hand, concentrating on the line.',
            width: 960,
            height: 1200,
          },
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'work',
      label: 'Work',
      description:
        'Ten photographs in two groups — photos 1 to 6 are shown under “On skin”, photos 7 to 10 under “On paper”. Each opens large in a viewer with its caption.',
      fields: [
        { type: 'text', id: 'work.title', label: 'Heading', help: EMPHASIS, default: 'Recent *work.*', maxLength: 40, required: true },
        {
          type: 'longText',
          id: 'work.intro',
          label: 'Introduction',
          default: 'Fine, single-needle lines, mostly small, mostly black. Everything starts as a drawing on the wall of the studio.',
          maxLength: 220,
          rows: 2,
        },
        { type: 'image', id: 'work.photo1', label: 'On skin — photo 1 (upright)', help: WORK_PHOTO, default: P('work-ribs', 'A fresh single-line tattoo of two abstract figures on the side of a torso, just above the waistband of dark jeans.'), aspectRatio: 4 / 5 },
        { type: 'text', id: 'work.caption1', label: 'Caption 1', default: 'Two figures, one line · ribs', maxLength: 60 },
        { type: 'image', id: 'work.photo2', label: 'On skin — photo 2 (tall)', help: WORK_PHOTO, default: T('work-forearm', 'An inner forearm with three small fine-line tattoos: a face in profile, a reclining figure and a hand holding a vase.'), aspectRatio: 2 / 3 },
        { type: 'text', id: 'work.caption2', label: 'Caption 2', default: 'Three small pieces · forearm', maxLength: 60 },
        { type: 'image', id: 'work.photo3', label: 'On skin — photo 3 (wide)', help: WORK_PHOTO, default: L('work-shoulder', 'A gloved hand resting beside a new fine-line drawing on a shoulder blade, the skin still slightly pink.'), aspectRatio: 3 / 2 },
        { type: 'text', id: 'work.caption3', label: 'Caption 3', default: 'Fresh line · shoulder blade', maxLength: 60 },
        { type: 'image', id: 'work.photo4', label: 'On skin — photo 4 (tall)', help: WORK_PHOTO, default: T('work-arm', 'A woman in an olive knit vest seen in profile, small black line tattoos running down her arm.'), aspectRatio: 2 / 3 },
        { type: 'text', id: 'work.caption4', label: 'Caption 4', default: 'A sleeve of small things · arm', maxLength: 60 },
        { type: 'image', id: 'work.photo5', label: 'On skin — photo 5 (wide)', help: WORK_PHOTO, default: L('work-side', 'A client holding up their T-shirt to show a small new line tattoo on the side, drawings pinned to the white wall behind.'), aspectRatio: 3 / 2 },
        { type: 'text', id: 'work.caption5', label: 'Caption 5', default: 'Just finished · side', maxLength: 60 },
        { type: 'image', id: 'work.photo6', label: 'On skin — photo 6 (upright)', help: WORK_PHOTO, default: P('work-fresh', 'A gloved hand wiping a new line tattoo on a shoulder blade with a folded paper towel.'), aspectRatio: 4 / 5 },
        { type: 'text', id: 'work.caption6', label: 'Caption 6', default: 'Wiped down, before the covering', maxLength: 60 },
        { type: 'image', id: 'work.photo7', label: 'On paper — photo 7 (tall)', help: WORK_PHOTO, default: T('paper-wall', 'Line drawings taped to a white wall: legs in a skirt, a thin vertical figure with one red dot, a seated nude.'), aspectRatio: 2 / 3 },
        { type: 'text', id: 'work.caption7', label: 'Caption 7', default: 'The wall, this month', maxLength: 60 },
        { type: 'image', id: 'work.photo8', label: 'On paper — photo 8 (tall)', help: WORK_PHOTO, default: T('paper-portrait', 'A single-line portrait of a woman with straight hair, drawn in black ink on white paper pinned to the wall.'), aspectRatio: 2 / 3 },
        { type: 'text', id: 'work.caption8', label: 'Caption 8', default: 'Portrait, one line', maxLength: 60 },
        { type: 'image', id: 'work.photo9', label: 'On paper — photo 9 (upright)', help: WORK_PHOTO, default: P('paper-shapes', 'Geometric drawings of circles, bars and dotted squares taped beside a line portrait.'), aspectRatio: 4 / 5 },
        { type: 'text', id: 'work.caption9', label: 'Caption 9', default: 'Shapes, for a series', maxLength: 60 },
        { type: 'image', id: 'work.photo10', label: 'On paper — photo 10 (upright)', help: WORK_PHOTO, default: P('paper-stencils', 'A sheet of violet transfer stencils of the same small figure, printed in rows on thin paper.'), aspectRatio: 4 / 5 },
        { type: 'text', id: 'work.caption10', label: 'Caption 10', default: 'Stencils, printed in violet', maxLength: 60 },
      ],
    },
    {
      id: 'flash',
      label: 'Flash',
      description:
        'Ready-drawn designs anyone can book. Each design names its size — Small or Medium — and its Book button opens the flash appointment of that size with the design written into the booking note. Until you set your own list, the site shows its eight sample line drawings; add a photo or scan of your own drawing to each design you list.',
      fields: [
        { type: 'text', id: 'flash.title', label: 'Heading', help: EMPHASIS, default: 'Flash, *ready to book.*', maxLength: 44, required: true },
        {
          type: 'longText',
          id: 'flash.intro',
          label: 'Introduction',
          default:
            'Designs drawn for the sheet, each in one continuous line. Choose one, book its size, and it’s written into your note — the time includes the stencil and placement.',
          maxLength: 240,
          rows: 3,
        },
        {
          type: 'list',
          id: 'flash.items',
          label: 'Designs',
          help: 'Up to twelve. Size is “Small” or “Medium” (anything else books the first flash appointment). Leave the drawing empty to show the sample drawing in that place, or a plain card if there is none.',
          itemLabel: 'Design',
          maxItems: 12,
          fields: [
            { type: 'text', id: 'title', label: 'Name', default: '', maxLength: 32, required: true },
            { type: 'text', id: 'size', label: 'Size (Small or Medium)', default: 'Small', maxLength: 12, required: true },
            { type: 'text', id: 'where', label: 'Where it sits well', default: '', maxLength: 48 },
            { type: 'image', id: 'drawing', label: 'Drawing (square)', default: null },
          ],
          default: [
            { title: 'Fern frond', size: 'Medium', where: 'Forearm, calf, along the spine' },
            { title: 'Butterfly', size: 'Small', where: 'Wrist, ankle, behind the ear' },
            { title: 'Crescent & star', size: 'Small', where: 'Wrist, collarbone, finger side' },
            { title: 'Garden snake', size: 'Medium', where: 'Inner arm, ribs, shin' },
            { title: 'Small sun', size: 'Small', where: 'Ankle, shoulder, hip' },
            { title: 'Tulip', size: 'Small', where: 'Ankle, inner arm, sternum' },
            { title: 'Garden snail', size: 'Small', where: 'Ankle, forearm, back of the arm' },
            { title: 'Open eye', size: 'Medium', where: 'Forearm, back of the neck, thigh' },
          ],
        },
        {
          type: 'text',
          id: 'flash.footnote',
          label: 'Small print under the flash',
          default: 'Size and placement can be adjusted on the day. A changed design is custom work, and starts with a consultation.',
          maxLength: 200,
        },
        {
          type: 'image',
          id: 'flash.photo',
          label: 'Photo beside the flash (upright)',
          help: `Upright (4:5). A stencil being traced or printed reads best. ${SAMPLE_HELP}`,
          default: P('flash-stencil', 'Gloved hands tracing a small figure onto violet transfer paper on a pale wooden desk.'),
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'process',
      label: 'Process',
      description: 'How a custom tattoo comes together, in four steps, each beside a photograph.',
      fields: [
        { type: 'text', id: 'process.title', label: 'Heading', help: EMPHASIS, default: 'From paper *to skin.*', maxLength: 44, required: true },
        {
          type: 'longText',
          id: 'process.intro',
          label: 'Introduction',
          default: 'A custom piece is never rushed into one appointment. It goes through four hands-on steps, and you can stop after any of them.',
          maxLength: 240,
          rows: 3,
        },
        {
          type: 'list',
          id: 'process.steps',
          label: 'Steps',
          help: 'Four steps, in order: a short title and a sentence or two each. Each is shown beside the photo with the same number.',
          itemLabel: 'Step',
          maxItems: 4,
          fields: [
            { type: 'text', id: 'title', label: 'Title', default: '', maxLength: 28, required: true },
            { type: 'longText', id: 'text', label: 'Text', default: '', maxLength: 240, rows: 3 },
          ],
          default: [
            { title: 'Talk', text: 'A free consultation at the desk. Bring references, a photo, a feeling. We talk about placement, size and how many sessions it is likely to need.' },
            { title: 'Draw', text: 'The artist draws your piece by hand and on the tablet — in one line where the design allows. You can see it at a design review before the day.' },
            { title: 'Stencil', text: 'The final drawing is printed as a violet stencil and placed on the skin. We move it until it sits right; nothing starts until you say so.' },
            { title: 'Tattoo', text: 'One client, one artist, one chair. You leave with the covering on and written aftercare, and a line to the studio if anything looks wrong.' },
          ],
        },
        { type: 'image', id: 'process.photo1', label: 'Photo — step 1 (upright)', help: `Upright (4:5). ${SAMPLE_HELP}`, default: P('step-talk', 'The artist crouches beside a seated client, photographing the placement on his side with a phone; drawings cover the wall behind.'), aspectRatio: 4 / 5 },
        { type: 'image', id: 'process.photo2', label: 'Photo — step 2 (upright)', help: `Upright (4:5). ${SAMPLE_HELP}`, default: P('step-draw', 'A hand with a stylus drawing a line figure on a tablet at a wooden desk, a sketchbook open beside it.'), aspectRatio: 4 / 5 },
        { type: 'image', id: 'process.photo3', label: 'Photo — step 3 (upright)', help: `Upright (4:5). ${SAMPLE_HELP}`, default: P('step-stencil', 'Gloved fingers peeling back a violet transfer stencil from a client’s back, the line left on the skin.'), aspectRatio: 4 / 5 },
        { type: 'image', id: 'process.photo4', label: 'Photo — step 4 (upright)', help: `Upright (4:5). ${SAMPLE_HELP}`, default: P('step-tattoo', 'The artist bent close over a client’s back, a wrapped machine in her gloved hand, following the stencil line.'), aspectRatio: 4 / 5 },
      ],
    },
    {
      id: 'prices',
      label: 'Prices',
      description:
        'The words around your appointments and prices. The appointments themselves — names, descriptions, lengths and prices — are edited in Services. A description can end with “Good for: wrists and ankles”, shown as its own line.',
      fields: [
        { type: 'text', id: 'prices.title', label: 'Heading', help: EMPHASIS, default: 'What it *costs.*', maxLength: 44, required: true },
        {
          type: 'longText',
          id: 'prices.intro',
          label: 'Introduction',
          default: 'Talks are free. Flash has one price for its size. Custom work is drawn for you, so it is quoted in person — never guessed online.',
          maxLength: 240,
          rows: 3,
        },
        { type: 'text', id: 'prices.customTitle', label: 'Custom work — heading', default: 'Custom work is quoted in person', maxLength: 48, required: true },
        {
          type: 'longText',
          id: 'prices.customText',
          label: 'Custom work — text',
          default:
            'At your consultation the artist looks at the idea and tells you how many sessions it is likely to need. Each session is charged at the session rate — the price of the time, not of the piece. The estimate is confirmed once the drawing is done, before your tattoo day.',
          maxLength: 400,
          rows: 4,
        },
        {
          type: 'list',
          id: 'prices.factors',
          label: 'What a custom quote depends on',
          itemLabel: 'Factor',
          maxItems: 5,
          fields: [{ type: 'text', id: 'text', label: 'Factor', default: '', maxLength: 48, required: true }],
          default: [{ text: 'Size, and where it sits' }, { text: 'How much detail and shading' }, { text: 'How the skin there takes a fine line' }, { text: 'How many sessions it needs' }],
        },
        {
          type: 'image',
          id: 'prices.photo',
          label: 'Photo beside custom work (upright)',
          help: `Upright (4:5). ${SAMPLE_HELP}`,
          default: P('custom-tablet', 'A tablet held at an angle showing a delicate drawing of a cupped hand and a flower, a stylus in the artist’s other hand.'),
          aspectRatio: 4 / 5,
        },
        {
          type: 'text',
          id: 'prices.footnote',
          label: 'Small print under the prices',
          default: 'Paid at the studio, by card or cash, after the appointment. Nothing is paid online, and there are no deposits.',
          maxLength: 200,
        },
      ],
    },
    {
      id: 'faq',
      label: 'Before you book',
      description: 'Practical answers and policies. Until you edit them they are labelled “Sample policies”.',
      fields: [
        { type: 'text', id: 'faq.title', label: 'Heading', help: EMPHASIS, default: 'Before *you book.*', maxLength: 44, required: true },
        {
          type: 'list',
          id: 'faq.items',
          label: 'Questions',
          itemLabel: 'Question',
          maxItems: 12,
          fields: [
            { type: 'text', id: 'question', label: 'Question', default: '', maxLength: 90, required: true },
            { type: 'longText', id: 'answer', label: 'Answer', default: '', maxLength: 600, rows: 4 },
          ],
          default: [
            {
              question: 'Do I need to be 18?',
              answer: 'Yes. The studio tattoos adults 18 and over only, and asks everyone for a photo ID on the day.',
            },
            {
              question: 'I have a health condition or take medication. What should I do?',
              answer:
                'Talk to the artist before you book — by phone or at a consultation — and ask your doctor if you are unsure whether to get tattooed. Please don’t write health details in the booking form: the studio never collects them online.',
            },
            {
              question: 'How is custom work priced?',
              answer:
                'At the consultation the artist looks at the size, placement and detail and tells you how many sessions it is likely to need. Each session is charged at the session rate. If the finished drawing changes that estimate, you hear before the day — never after.',
            },
            {
              question: 'Can I bring my own design?',
              answer: 'Bring references, photos and ideas — every custom piece is drawn here, in the artist’s own line. The studio doesn’t copy another artist’s tattoo.',
            },
            {
              question: 'How do I get ready for the appointment?',
              answer: 'Sleep well, eat beforehand and wear clothes that leave the placement easy to reach. Skip alcohol the day before. Bring your photo ID.',
            },
            {
              question: 'What about aftercare?',
              answer:
                'You leave with the covering on and written aftercare. Fine lines are delicate while they heal: follow the instructions, keep it out of the sun, and get in touch if anything looks wrong.',
            },
            {
              question: 'What if I need to cancel or move my time?',
              answer: 'Please let the studio know at least 48 hours before, so the time can go to someone else. Arriving late may mean a shorter appointment or a new date.',
            },
            {
              question: 'How do I pay?',
              answer: 'At the studio, after the appointment, by card or cash. Nothing is paid online and there are no deposits.',
            },
          ],
        },
      ],
    },
    {
      id: 'book',
      label: 'Booking',
      description: 'The closing booking band and the top of the booking sheet.',
      fields: [
        { type: 'text', id: 'book.title', label: 'Heading', help: EMPHASIS, default: 'Pick a time, *start the line.*', maxLength: 44, required: true },
        {
          type: 'longText',
          id: 'book.intro',
          label: 'Introduction',
          default: 'Choose an appointment and a time. Every request is read by the artist and confirmed by email, usually within two days.',
          maxLength: 240,
          rows: 3,
        },
        {
          type: 'image',
          id: 'book.photo',
          label: 'Photo (wide)',
          help: `Wide (3:2), shown in the closing booking band. Remove it for text only. ${SAMPLE_HELP}`,
          default: L('studio-desk', 'The artist drawing on a tablet at a pale wooden desk in a white room, line drawings pinned to the wall and a large plant beside her.'),
          aspectRatio: 3 / 2,
        },
      ],
    },
    {
      id: 'visit',
      label: 'Visit',
      description: 'Hours, address, phone and email come from your Business settings. Add how to find you.',
      fields: [
        { type: 'text', id: 'visit.title', label: 'Heading', help: EMPHASIS, default: 'Find *the studio.*', maxLength: 44, required: true },
        {
          type: 'longText',
          id: 'visit.note',
          label: 'Finding us',
          default:
            'Studio 3 is one flight up above the frame shop on Wickenden Street — ring the bell marked Ligne. Street parking on Wickenden and Brook Street, and the bus stops at the corner. Visits are by appointment only.',
          maxLength: 400,
          rows: 3,
        },
        {
          type: 'image',
          id: 'visit.photo',
          label: 'Photo (tall)',
          help: `Tall (2:3). The studio itself reads best. ${SAMPLE_HELP}`,
          default: T('studio-room', 'A white studio corner: a wooden desk and a white chair on a striped rug, plants, and drawings pinned to the wall.'),
          aspectRatio: 2 / 3,
        },
      ],
    },
    {
      id: 'footer',
      label: 'Footer',
      fields: [{ type: 'text', id: 'footer.tagline', label: 'Line under the name', default: 'Single-line & fine-line tattoo · by appointment · Providence', maxLength: 80 }],
    },
    {
      id: 'seo',
      label: 'Search & sharing',
      description: 'Search engines and link previews show new text after the website is next deployed.',
      fields: [
        {
          type: 'text',
          id: 'seo.title',
          label: 'Page title',
          help: 'Search engines and link previews show new text after the website is next deployed.',
          default: 'Ligne Tattoo — single-line & fine-line tattoos in Providence',
          maxLength: 80,
          required: true,
        },
        {
          type: 'longText',
          id: 'seo.description',
          label: 'Page description',
          help: 'One or two sentences for search results. Updated after the next deploy.',
          default:
            'A one-artist tattoo studio in Providence for single-line and fine-line work. Free consultations, flash ready to book, custom pieces quoted in person. Book online.',
          maxLength: 180,
          rows: 3,
          required: true,
        },
      ],
    },
  ],
});
