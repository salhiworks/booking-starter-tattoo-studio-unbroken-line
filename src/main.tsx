import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Syne (variable, 400–800): headings, the name mark and the flash names — wide, quiet at medium
// weight. Familjen Grotesk (variable): reading text and every figure. Spline Sans Mono: small labels.
import '@fontsource-variable/syne';
import '@fontsource-variable/familjen-grotesk';
import '@fontsource-variable/spline-sans-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import './styles/booking.css';
import { App } from './App';
import { engine } from './lib/engine';
import type { DemoEngine } from './demo/engine';

if (__BOOKING_DEMO__) void import('./demo/engine/DemoBar').then((m) => m.mountDemoBar(engine as DemoEngine, 'site'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
