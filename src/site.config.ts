/**
 * This website's identity — the ONE place for its name, time zone and the
 * placeholder contact details shown in preview mode (`npm run dev` without
 * Supabase). Everything the owner manages (services, prices, hours, real
 * contact details, text and photos) lives in the dashboard at /admin/.
 */
export const SITE = {
  /** The business name. The dashboard's Business page overrides it once connected. */
  name: 'Ligne Tattoo',
  /** IANA time zone of the business. */
  timezone: 'America/New_York',
  /** Fictional contact details for preview mode only. */
  previewContact: {
    email: 'hello@ligne.example',
    phone: '+1 401-555-0136',
    address: '88 Wickenden St, Studio 3, Providence, RI 02903',
  },
};
