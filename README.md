# Arogya Dhaam — Hospital & Clinic website

Multi-specialty hospital website built with **Vite + React 18**, **react-router-dom**, **framer-motion**, and **lucide-react**. Implements the in-repo [medical-ui skill](.claude/skills/medical-ui/SKILL.md) — design system, WCAG 2.1 AA accessibility, and trust patterns for patient-facing healthcare interfaces.

🌐 **Live:** https://arogya-dhaam.web.app

## Develop

```bash
npm install
npm run dev          # http://localhost:5181
```

## Build & audit

```bash
npm run build        # production build
npm run audit:build  # bundle-size budgets (initial JS gzip ≤ 120 KB)
npm run audit:a11y   # static a11y checks
```

## Deploy

Hosted on Firebase Hosting. After changes:

```bash
npm run build
firebase deploy --only hosting
```

## Pages

- `/` — Home (hero, services strip, about split, expert team with profile modal, appointment form, news)
- `/about` — Mission, animated stats, values, timeline, accreditations
- `/specialties` — All specialties with procedures
- `/doctors` — Searchable / filterable doctor directory with animated filters
- `/departments` — Department cards
- `/appointments` — Booking form with validation, success state, privacy notice
- `/contact` — Contact cards, hours, map link
- `/blog`, `/blog/:id` — Articles
- `*` — 404

## Notable features

- **Animated SPA** — every page transition uses `AnimatePresence`; sections reveal on scroll via `IntersectionObserver`-backed framer-motion variants
- **Top route progress bar** — gradient bar on every navigation
- **Doctor profile modal** — click any expert card on Home to open full credentials + Book CTA
- **Sticky emergency bar** — phone + ambulance numbers (`tel:` links) on every page
- **`prefers-reduced-motion`** respected throughout
- **Bundle budgets** enforced (initial JS ≤ 120 KB gzip)
