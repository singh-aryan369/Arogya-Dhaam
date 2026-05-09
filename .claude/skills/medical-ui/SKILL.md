---
name: medical-ui
description: UI/UX guidelines for hospital, clinic, and other healthcare websites. Use when designing or reviewing patient-facing medical interfaces — covers color, typography, accessibility (WCAG AA), trust signals, emergency-pathway patterns, and form best-practices. Trigger when the user asks for clinic/hospital/doctor/medical UI work.
---

# Medical UI / UX guidelines

A reusable design system + checklist for building patient-facing healthcare websites. Healthcare sites carry higher trust and accessibility expectations than typical marketing sites — these rules encode the non-obvious decisions.

## Core principles (in priority order)

1. **Reduce anxiety.** Patients arrive worried. Calm color, generous whitespace, no aggressive marketing copy, no dark patterns.
2. **Make emergency paths impossible to miss.** Every page must surface emergency phone + ambulance within one tap.
3. **Build trust through evidence.** Show credentials, accreditation, doctor qualifications, real metrics (years in service, specialists, beds).
4. **Be reachable.** Multiple contact methods (phone, WhatsApp, online form, address with map). Hours always visible.
5. **WCAG 2.1 AA, no exceptions.** Healthcare audiences include older users, vision-impaired users, and users on poor connections.

## Color system

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Primary | `--c-primary` | `#0B5394` | Trust, navigation, primary CTA |
| Primary dark | `--c-primary-dark` | `#07385F` | Hover, headers |
| Secondary | `--c-secondary` | `#0F766E` | Wellness accents, success-adjacent |
| Accent | `--c-accent` | `#C49A3F` | Premium / specialist highlights (use sparingly) |
| Emergency | `--c-emergency` | `#DC2626` | ONLY for emergency CTAs, never decorative |
| Success | `--c-success` | `#15803D` | Confirmations, positive outcomes |
| Ink | `--c-ink` | `#0F172A` | Primary text |
| Ink-2 | `--c-ink-2` | `#334155` | Body text on light backgrounds |
| Surface | `--c-surface` | `#FFFFFF` | Default background |
| Surface-2 | `--c-surface-2` | `#F8FAFC` | Section alternation |

**Rules:**
- Avoid pure red/orange anywhere except emergency. Patients associate red with danger.
- No more than two brand colors visible at once on any screen.
- All text must hit ≥4.5:1 contrast on its background (≥3:1 for ≥18px or bold ≥14px).

## Typography

- **Headings:** humanist serif (Fraunces, Lora, Source Serif). Conveys care, longevity, gravitas. Avoid display/decorative serifs.
- **Body:** modern geometric sans (Inter, Plus Jakarta Sans). Optimized for screen reading.
- **Body size:** never below 16px. 17–18px is better for older audiences.
- **Line-height:** 1.5–1.65 for body. 1.1–1.2 for headings.
- **Line length:** cap at 65–75 characters for body text.

## Layout & spacing

- Generous padding. Healthcare sites should feel uncluttered. Use an 8px grid; section vertical padding ≥64px on mobile, ≥96px on desktop.
- Container max-width ~1200px. Long-form text container ~720–920px.
- **Sticky emergency contact bar** at the top of every page with phone + ambulance numbers as `tel:` links.
- Header simplified — patients should reach a doctor or department in ≤2 clicks.

## Components — required patterns

### Emergency bar
- Top of viewport, always visible (or sticky).
- Format: "Emergency · `<tel link>` · Ambulance: `<108>` · Open 24/7"
- Use `--c-emergency` background or red-tinted strip; minimum 44px tall (touch target).

### Doctor cards
- Photo (or initial avatar fallback), name, role, qualifications, years of experience, languages, OPD timing, "Book appointment" CTA.
- Qualifications must be the actual abbreviations (MBBS, MD, DM, etc.) — patients check for these.

### Specialty / department cards
- Icon + name + 1-line summary + 3–4 procedure bullets.
- Tap target ≥48px minimum.

### Trust strip
- Display NABH / NABL / JCI / ISO badges with full names tooltipped or below.
- Stats bar: years of service, specialists, beds, patients treated. Animate count-up only if `prefers-reduced-motion` is not set.

### Appointment form
- 5–7 fields max on initial step. Defer non-essential fields.
- Required: name, phone, department/doctor, preferred date.
- Optional: notes, email.
- Phone field: `inputmode="tel"`, `autocomplete="tel"`. Use international format hint.
- Submit button width = field width on mobile.
- Show privacy notice: "Your information is confidential and used only for appointment coordination."

## Accessibility checklist (must pass before ship)

- [ ] Every interactive element has a visible focus state (`:focus-visible` outline ≥3px).
- [ ] Skip-to-content link as the first focusable element.
- [ ] All `<img>` have meaningful `alt` (or `alt=""` for decorative).
- [ ] Color is never the only means of conveying state (use icons + text).
- [ ] Form inputs have associated `<label>` (not placeholder-only).
- [ ] Errors announced via `role="alert"` and visible.
- [ ] Heading hierarchy logical (one `<h1>` per page; no skips).
- [ ] Touch targets ≥44×44px (Apple HIG) — prefer 48×48px (WCAG AAA).
- [ ] `prefers-reduced-motion` respected — disable autoplay, parallax, decorative animation.
- [ ] All `<a>` and `<button>` reachable by keyboard with logical tab order.
- [ ] Emergency phone numbers as `tel:` links.
- [ ] `lang` attribute on `<html>`.

## Performance targets

- Lighthouse Performance ≥90 (mobile)
- LCP <2.5s, CLS <0.1, INP <200ms
- Bundle: critical JS <120KB gzipped initial route
- Images: lazy-load below-the-fold, use modern formats (WebP/AVIF) with fallbacks
- Fonts: `display=swap`, preconnect to font CDN, subset to Latin

## Trust patterns — always include

1. **Accreditation badges** in header or footer
2. **Doctor credentials** — qualifications shown verbatim
3. **Real metrics** with units (e.g., "28+ years", "350 beds") — never vague claims
4. **Patient testimonials** with name + condition treated (no fabricated testimonials)
5. **Privacy/HIPAA-style notice** wherever data is collected
6. **Physical address** with map on contact page
7. **Hours of operation** including emergency 24/7 distinction
8. **Multiple ways to contact** — phone, email, form, ambulance

## Anti-patterns — never do

- Auto-playing audio or video with sound
- Pop-ups asking for marketing consent before content is reachable
- Stock-photo "happy doctors with crossed arms" — instantly erodes trust
- Vague claims ("the best hospital", "world-class") without evidence
- Red anywhere except emergency
- Carousel-only content — important information must be statically reachable
- Forms that ask for medical history before basic contact info
- Lock contact info behind login/forms

## Page templates

A complete medical site has at minimum:
1. **Home** — hero (with appointment CTA + emergency number), trust strip, specialties grid, featured doctors, stats, testimonials, contact CTA
2. **About** — mission, history, leadership, accreditations, facilities
3. **Services / Specialties** — full list with detail expansion
4. **Doctors** — searchable/filterable directory
5. **Departments** — department cards + facilities
6. **Appointments** — booking form
7. **Contact** — address + map, phones, hours, emergency, form

## Audit before shipping

Run these in order:
1. `npm run build` — bundle size sanity check (initial JS <120KB gzipped)
2. Lighthouse mobile run — Performance, Accessibility, Best Practices, SEO each ≥90
3. Manual keyboard test — tab through every page, every CTA reachable
4. Screen-reader smoke test — VoiceOver / NVDA on Home and Appointment form
5. Color-contrast audit — Stark / axe DevTools, no AA failures
6. Mobile device test — 360px width minimum, no horizontal scroll
7. Form test — submit empty, submit invalid, submit valid; errors announced

If any fails, fix root cause (don't suppress) and re-run the full audit.
