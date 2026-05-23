# Strength Tracker

Offline-first Progressive Web App for logging strength training. No backend — all data lives in IndexedDB on your device.

## Tech stack

- React + Vite
- Tailwind CSS
- Dexie.js (IndexedDB)
- Chart.js
- vite-plugin-pwa

## Getting started

```bash
npm install --registry https://registry.npmjs.org/
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Features

- Categories, exercises, and workout logs
- Personal records and weight-over-time chart
- Weekly summary (last 7 days)
- JSON export / import (replace or merge)
- Dark mode and kg/lb unit toggle
- PWA: installable and works offline

## Data

Stored locally in IndexedDB (`StrengthTracker` database). Export regularly from Settings to back up your data.
