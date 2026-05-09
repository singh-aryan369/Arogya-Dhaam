# Arogya Dhaam — UI/UX audit

**Score: 100/100 — A — ship-ready**

Generated: 2026-05-09T12:16:46.650Z

Scored against [.claude/skills/medical-ui/SKILL.md](../.claude/skills/medical-ui/SKILL.md) — color, typography, layout, components, accessibility, performance, trust patterns, forms, motion.

## Category breakdown

| Category | Score |
|---|---|
| Color system | **100%** (5.0 / 5) |
| Typography | **100%** (4.0 / 4) |
| Layout & spacing | **100%** (2.0 / 2) |
| Trust patterns | **100%** (9.0 / 9) |
| Accessibility | **100%** (8.0 / 8) |
| Performance | **100%** (4.0 / 4) |
| Trust signals | **100%** (7.0 / 7) |
| Forms | **100%** (2.0 / 2) |
| Motion | **100%** (2.0 / 2) |

## Findings

### Color system

- ✅ **Required design tokens defined** — All 6 brand tokens present.
- ✅ **Pure #FFFFFF restraint (warm surface preferred)** — Pure #FFFFFF used 1 times. Target: cards crisp white, large surfaces tinted.
- ✅ **Red reserved for emergency actions** — Red appears only in emergency contexts.

### Typography

- ✅ **Humanist serif for display headings (per skill)** — Headings use a humanist serif (Fraunces).
- ✅ **Modern sans for body** — Body uses Inter.
- ✅ **Body size ≥ 16px (older audiences)** — body font-size = 16px.

### Layout & spacing

- ✅ **Container max-width ≈ 1200px** — --container token defined.
- ✅ **Generous section padding (≥56px)** — Section padding defined.

### Trust patterns

- ✅ **Emergency bar mounted on every page** — EmergencyBar present in Layout.
- ✅ **Phone numbers as tel: links** — tel: links found.
- ✅ **Ambulance number surfaced** — Ambulance referenced in copy/data.
- ✅ **Doctor records carry full credentials (8 doctors)** — Field coverage: {"qualifications":8,"experience":8,"languages":8,"timing":8,"bio":8} / count=8.

### Accessibility

- ✅ **Visible :focus-visible outline** — `:focus-visible` rule detected.
- ✅ **Skip-to-content link** — Skip link styled and rendered.
- ✅ **prefers-reduced-motion respected** — CSS + JS both respect reduced motion.
- ✅ **<html lang> attribute set** — <html lang> set.
- ✅ **Decorative icons aria-hidden** — All icons properly marked.
- ✅ **No placeholder href="#" anchors** — No placeholder anchors.

### Performance

- ✅ **Initial JS gzip ≤ 120 KB** — 75.5 KB / 120 KB target.
- ✅ **Initial CSS gzip ≤ 30 KB** — 8.7 KB / 30 KB target.
- ✅ **Total JS gzip ≤ 280 KB** — 100.8 KB / 280 KB target.

### Trust signals

- ✅ **Accreditation badges (NABH/NABL/JCI/ISO)** — Accreditations data present.
- ✅ **Real metrics with units (years, beds, etc.)** — Stats data present.
- ✅ **Patient testimonials with name + condition** — Testimonials defined.
- ✅ **Privacy notice on data-collection forms** — Privacy notice present in form areas.

### Forms

- ✅ **Phone fields use inputMode="tel"** — 2 tel inputs detected.
- ✅ **Errors announced via role="alert"** — role="alert" used on errors.

### Motion

- ✅ **Page transitions + scroll reveals** — AnimatePresence + Reveal/Stagger used.
- ✅ **Doctor profile modal with dialog semantics** — DoctorModal exists with role="dialog".

## Top opportunities (by weight × severity)

_No outstanding gaps — all checks pass._

## Methodology

- Static parses of CSS (tokens, focus styles, reduced-motion), JSX (component composition, ARIA, tel: links), and built JS/CSS bundles (gzip sizes vs SKILL.md budgets).
- Each criterion has a weight (1–3); pass = full points, warn = half, fail = 0. Overall is weighted-percent.
- Static checks complement, do not replace: Lighthouse mobile run, manual keyboard tab-through, screen-reader smoke (NVDA / VoiceOver), and color-contrast audit (axe / Stark).

## How to reproduce a higher score

Edit code → re-run `npm run build && node scripts/audit-uiux.mjs`. The script targets the categories in priority order; fix top-of-list opportunities first.
