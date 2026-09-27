# Sneha Kumaran — Data Analyst

**Live site:** https://snehaakumaran.github.io/

An interactive data intelligence lab: one set of data points reorganizes as you scroll. It moves from raw data to a connected network, a data pipeline, a project universe, a dashboard, an analytical model, relational tables and an insight surface. Built with React, TypeScript and Three.js (React Three Fiber).

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Editing content

Every fact on the site lives in **`src/content.ts`** (profile, experience, projects, skills, education and certifications). Components only render it.

- Add an email, Tableau Public URL or GitHub profile in `links`. Empty values are not shown.
- Project descriptions are kept to what the LinkedIn profile documents. Add richer notes to each project's `overview` and `tech` when available.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. The site is a user site served from the domain root, so `vite.config.ts` uses `base: '/'`.

## Performance and accessibility

- The 3D engine loads as a separate chunk, and only on devices with WebGL. Point counts scale by device (1,800 / 3,600 / 6,000), and the pixel ratio drops automatically if the frame rate falls.
- `prefers-reduced-motion`, or the motion toggle in the nav, stills the scene and shows all content at once. Without WebGL the full content still renders.
- Test switches: `?nogl` (no-WebGL fallback), `?calm` (reduced motion), `?tier=low|mid|high` (quality tier).
