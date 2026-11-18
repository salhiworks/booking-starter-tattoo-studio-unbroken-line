import type { DemoConfig } from './engine';
import { sitePreset } from '../lib/preset';

/**
 * The public Live Demo's sample studio (`npm run dev:demo` / `npm run build:demo`).
 * Only demo builds read this file. Customizing the real website? Leave src/demo/ alone.
 * Sample notes name a flash design, a placement and a size — never health details.
 */
export const demoConfig: DemoConfig = {
  id: 'tattoo-studio-unbroken-line',
  preset: sitePreset,
  business: {
    name: 'Ligne Tattoo',
    timezone: 'America/New_York',
    email: 'hello@ligne.example',
    phone: '+1 401-555-0136',
    address: '88 Wickenden St, Studio 3, Providence, RI 02903',
  },
  ownerEmail: 'owner@ligne.example',
  referencePrefix: 'LG',
  sampleNotes: [
    'Flash F-01 · Fern frond — inner forearm, about 5 cm.',
    'A single-line portrait of my grandmother, from a photo I’ll bring. Shoulder blade?',
    'Flash F-06 · Tulip, left ankle. My first tattoo.',
  ],
  // The site caches published content under this key (createSiteContentStore's default).
  resetKeys: ['pbe-site-content'],
  customers: [
    { name: 'Nadia Farouk', email: 'nadia.farouk@example.com', phone: '+1 401 555 0112' },
    { name: 'Theo Brandt', email: 'theo.brandt@example.com', phone: '+1 401 555 0126' },
    { name: 'Camila Reyes', email: 'camila.reyes@example.com', phone: '+1 401 555 0133' },
    { name: 'Owen MacLeod', email: 'owen.macleod@example.com', phone: '+1 401 555 0148' },
    { name: 'Ingrid Solberg', email: 'ingrid.solberg@example.com', phone: '+1 401 555 0150' },
    { name: 'Jae Park', email: 'jae.park@example.com', phone: '+1 401 555 0161' },
    { name: 'Lucia Bianchi', email: 'lucia.bianchi@example.com', phone: '+1 401 555 0174' },
    { name: 'Samuel Adeyemi', email: 'samuel.adeyemi@example.com', phone: '+1 401 555 0187' },
    { name: 'Mara Kowalczyk', email: 'mara.kowalczyk@example.com', phone: '+1 401 555 0195' },
    { name: 'Eli Rosen', email: 'eli.rosen@example.com', phone: '+1 401 555 0109' },
  ],
};
