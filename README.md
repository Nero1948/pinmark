# Pinmark — Aotearoa Explorer

A NZ geography photo-guessing game for Year 8-9 students, built as a Next.js web app.

## What it is

Look at a photo. Drop a pin on the map. How well do you know Aotearoa?

Six curriculum-aligned game packs, six locations each, covering landforms, coastlines, cities, cultural history, climate, and a grand tour. Every fact is verified against two sources (Wikipedia + a NZ government source). Designed for classroom use, with a For Teachers page including a printable worksheet.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building for production

```bash
npm run build
npm start
```

## Deploying to Vercel

Import this repo in the Vercel dashboard. It auto-detects Next.js and deploys with zero configuration.

## Tech stack

- Next.js 16, React 19, TypeScript 5
- Leaflet for the interactive map
- canvas-confetti for celebrations
- Static JSON data — no database or API

## Photos

All photos are sourced from the Postmark NZ photo bank. All are production-safe with Creative Commons or Public Domain licences (CC BY, CC BY-SA, or Public Domain). Full credit and licence information is stored in `data/locations.json` and displayed in-game under every photo.

## Curriculum alignment

Aligned to the New Zealand Curriculum Social Sciences / Geography, Levels 4-5 (Year 8-9). See [/for-teachers](/for-teachers) for the full alignment table.

## Content sources

All location facts are verified against two sources:
1. Wikipedia
2. An official NZ source — DOC, Te Ara, GeoNet, NIWA, NZ History, or LINZ

Source URLs are stored in `data/locations.json` for full auditability.
