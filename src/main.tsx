import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles.css';
import App from './App';

// A small hello for anyone who opens the console.
console.log(
  '%cSELECT%c name, role, focus FROM portfolio.owner;\n%c→ Sneha Kumaran | Data Analyst | Data analytics · BI · Tableau · ML\n→ LinkedIn  https://www.linkedin.com/in/snehakumaran/\n→ Tableau   https://public.tableau.com/app/profile/sneha.kumaran',
  'color:#c9b6ff;font-weight:700;font-family:monospace',
  'color:#4cc9f0;font-family:monospace',
  'color:#b8bdd9;font-family:monospace;line-height:1.6',
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
