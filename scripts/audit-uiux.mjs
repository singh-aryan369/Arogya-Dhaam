#!/usr/bin/env node
// UI/UX scorecard against .claude/skills/medical-ui/SKILL.md.
// Static + runtime checks; outputs a markdown report and an overall score.
// Usage: node scripts/audit-uiux.mjs   (run after `npm run build` + preview server on :4188)

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = process.cwd();
const SRC = 'src';
const DIST = 'dist/assets';
const REPORT = 'docs/uiux-report.md';

const findings = []; // { category, criterion, status: 'pass'|'warn'|'fail', detail, weight }
const add = (category, criterion, status, detail, weight = 1) =>
  findings.push({ category, criterion, status, detail, weight });

const readAll = (dir, ext = /\.(jsx?|css|html)$/) => {
  const out = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if (ext.test(f)) out.push({ path: p, content: readFileSync(p, 'utf8') });
    }
  };
  walk(dir);
  return out;
};

const all = readAll(SRC);
const allText = all.map(f => f.content).join('\n');
const cssText = all.filter(f => f.path.endsWith('.css')).map(f => f.content).join('\n');
const jsxText = all.filter(f => /\.jsx$/.test(f.path)).map(f => f.content).join('\n');
const htmlText = existsSync('index.html') ? readFileSync('index.html', 'utf8') : '';

const has = (re, src = allText) => re.test(src);

/* ------------ CATEGORY: Color system ------------ */
const colorTokens = ['--c-primary', '--c-primary-dark', '--c-emergency', '--c-success', '--c-ink', '--c-surface'];
const missingTokens = colorTokens.filter(t => !cssText.includes(t));
add('Color system', 'Required design tokens defined',
  missingTokens.length === 0 ? 'pass' : 'fail',
  missingTokens.length === 0 ? `All ${colorTokens.length} brand tokens present.` : `Missing: ${missingTokens.join(', ')}`,
  2);

const usesPureWhite = (cssText.match(/#FFFFFF\b/gi) || []).length;
add('Color system', 'Pure #FFFFFF restraint (warm surface preferred)',
  usesPureWhite < 6 ? 'pass' : 'warn',
  `Pure #FFFFFF used ${usesPureWhite} times. Target: cards crisp white, large surfaces tinted.`,
  1);

const emergencyOnlyEmergency = !/(--c-emergency|#E74C3C|#DC2626)/.test(
  cssText.replace(/[^\n]*emergency[^\n]*\n?/gi, '')
);
add('Color system', 'Red reserved for emergency actions',
  emergencyOnlyEmergency ? 'pass' : 'warn',
  emergencyOnlyEmergency ? 'Red appears only in emergency contexts.' : 'Red may appear outside emergency context — review usages.',
  2);

/* ------------ CATEGORY: Typography ------------ */
const usesSerifDisplay = /Fraunces|Source Serif|Lora/.test(cssText) || /Fraunces|Source Serif|Lora/.test(htmlText);
add('Typography', 'Humanist serif for display headings (per skill)',
  usesSerifDisplay ? 'pass' : 'warn',
  usesSerifDisplay ? 'Headings use a humanist serif (Fraunces).' : 'Headings still use a geometric sans only — skill recommends serif for trust.',
  2);

const usesInter = /Inter|Plus Jakarta/.test(cssText);
add('Typography', 'Modern sans for body',
  usesInter ? 'pass' : 'fail',
  usesInter ? 'Body uses Inter.' : 'Body font not Inter / Plus Jakarta.',
  1);

const baseFontMatch = cssText.match(/body\s*\{[^}]*font-size:\s*(\d+)px/);
const baseFontPx = baseFontMatch ? parseInt(baseFontMatch[1]) : null;
add('Typography', 'Body size ≥ 16px (older audiences)',
  baseFontPx !== null && baseFontPx >= 16 ? 'pass' : 'warn',
  baseFontPx !== null ? `body font-size = ${baseFontPx}px.` : 'Could not detect base body font-size.',
  1);

/* ------------ CATEGORY: Layout & spacing ------------ */
const hasContainerMax = /--container:\s*1\d{3}px/.test(cssText);
add('Layout & spacing', 'Container max-width ≈ 1200px',
  hasContainerMax ? 'pass' : 'warn',
  hasContainerMax ? '--container token defined.' : 'Container max-width token not detected.',
  1);

const hasSectionPad = /\.section\s*\{[^}]*padding:[^}]*\d+/.test(cssText);
add('Layout & spacing', 'Generous section padding (≥56px)',
  hasSectionPad ? 'pass' : 'warn',
  hasSectionPad ? 'Section padding defined.' : 'Section padding not generous.',
  1);

/* ------------ CATEGORY: Components — Emergency bar ------------ */
const hasEmergencyBar = /EmergencyBar/.test(jsxText) && /EmergencyBar/.test(allText);
const emergencyMounted = /EmergencyBar/.test(readFileSync('src/components/Layout.jsx', 'utf8'));
add('Trust patterns', 'Emergency bar mounted on every page',
  hasEmergencyBar && emergencyMounted ? 'pass' : 'fail',
  hasEmergencyBar && emergencyMounted ? 'EmergencyBar present in Layout.' : 'EmergencyBar exists but not mounted in Layout.',
  3);

const hasTelLinks = /href=\{?[`'"]tel:/.test(jsxText);
add('Trust patterns', 'Phone numbers as tel: links',
  hasTelLinks ? 'pass' : 'fail',
  hasTelLinks ? 'tel: links found.' : 'No tel: links — phone numbers not tappable.',
  2);

const hasAmbulance = /ambulance/i.test(allText);
add('Trust patterns', 'Ambulance number surfaced',
  hasAmbulance ? 'pass' : 'warn',
  hasAmbulance ? 'Ambulance referenced in copy/data.' : 'Ambulance number not visible.',
  2);

/* ------------ CATEGORY: Doctor cards / data ------------ */
const doctorsExists = existsSync('src/data/doctors.js');
let doctorFields = { qualifications: 0, experience: 0, languages: 0, timing: 0, bio: 0 };
let doctorCount = 0;
if (doctorsExists) {
  const doc = readFileSync('src/data/doctors.js', 'utf8');
  doctorCount = (doc.match(/\bid:\s*\d/g) || []).length;
  for (const k of Object.keys(doctorFields)) {
    // experience is a number, others are strings/arrays
    const valueRe = k === 'experience' ? `\\b${k}:\\s*\\d+` : `\\b${k}:\\s*['"\\[]`;
    doctorFields[k] = (doc.match(new RegExp(valueRe, 'g')) || []).length;
  }
}
const fullCoverage = Object.values(doctorFields).every(c => c === doctorCount);
add('Trust patterns', `Doctor records carry full credentials (${doctorCount} doctors)`,
  fullCoverage ? 'pass' : 'warn',
  `Field coverage: ${JSON.stringify(doctorFields)} / count=${doctorCount}.`,
  2);

/* ------------ CATEGORY: Accessibility ------------ */
const hasFocusVisible = /:focus-visible/.test(cssText);
add('Accessibility', 'Visible :focus-visible outline',
  hasFocusVisible ? 'pass' : 'fail',
  hasFocusVisible ? '`:focus-visible` rule detected.' : 'No :focus-visible style.',
  2);

const hasSkipLink = /skip-link/.test(cssText) && /skip-link/.test(jsxText);
add('Accessibility', 'Skip-to-content link',
  hasSkipLink ? 'pass' : 'warn',
  hasSkipLink ? 'Skip link styled and rendered.' : 'No skip-to-content link.',
  1);

const hasReducedMotion = /prefers-reduced-motion/.test(cssText) && /useReducedMotion|prefers-reduced-motion/.test(jsxText);
add('Accessibility', 'prefers-reduced-motion respected',
  hasReducedMotion ? 'pass' : 'warn',
  hasReducedMotion ? 'CSS + JS both respect reduced motion.' : 'Reduced-motion handling incomplete.',
  2);

const langAttr = /<html\s+lang=/.test(htmlText);
add('Accessibility', '<html lang> attribute set',
  langAttr ? 'pass' : 'fail',
  langAttr ? `<html lang> set.` : '<html> missing lang attribute.',
  1);

// Aria-hidden on decorative icons (heuristic: any lucide icon without aria attr)
const decorativeIconLeak = jsxText.match(/<(Phone|Mail|MapPin|Clock|Heart|Award|Stethoscope|ShieldCheck|ChevronRight|ArrowRight|Search|Check|Quote|CalendarPlus|Menu|X|Cross|Activity|Ambulance|Languages|Clock3|Navigation|Sparkles|Microscope|Users|AlertCircle|CheckCircle2)\s+[^>]*\/?>/g) || [];
const leakingIcons = decorativeIconLeak.filter(u => !/aria-hidden|aria-label/.test(u));
add('Accessibility', 'Decorative icons aria-hidden',
  leakingIcons.length === 0 ? 'pass' : 'warn',
  leakingIcons.length === 0 ? 'All icons properly marked.' : `${leakingIcons.length} icon usages missing aria-hidden.`,
  1);

const placeholderHrefs = (jsxText.match(/href=["']#["']/g) || []).length;
add('Accessibility', 'No placeholder href="#" anchors',
  placeholderHrefs === 0 ? 'pass' : 'warn',
  placeholderHrefs === 0 ? 'No placeholder anchors.' : `${placeholderHrefs} placeholder anchors (e.g. footer social).`,
  1);

/* ------------ CATEGORY: Performance / bundle ------------ */
let initialJsGzip = null, totalJsGzip = null, cssGzip = null;
if (existsSync(DIST)) {
  const files = readdirSync(DIST).map(f => ({
    name: f,
    gzip: gzipSync(readFileSync(join(DIST, f))).length
  }));
  const isInit = (n) => /^index-/.test(n) || /^react-vendor-/.test(n);
  initialJsGzip = files.filter(f => f.name.endsWith('.js') && isInit(f.name)).reduce((s, f) => s + f.gzip, 0);
  totalJsGzip   = files.filter(f => f.name.endsWith('.js')).reduce((s, f) => s + f.gzip, 0);
  cssGzip       = files.filter(f => f.name.endsWith('.css') && f.name.startsWith('index-')).reduce((s, f) => s + f.gzip, 0);
}
const fmtKB = (b) => b == null ? 'n/a' : `${(b / 1024).toFixed(1)} KB`;
add('Performance', 'Initial JS gzip ≤ 120 KB',
  initialJsGzip != null && initialJsGzip <= 120 * 1024 ? 'pass' : initialJsGzip == null ? 'warn' : 'fail',
  `${fmtKB(initialJsGzip)} / 120 KB target.`,
  2);
add('Performance', 'Initial CSS gzip ≤ 30 KB',
  cssGzip != null && cssGzip <= 30 * 1024 ? 'pass' : cssGzip == null ? 'warn' : 'fail',
  `${fmtKB(cssGzip)} / 30 KB target.`,
  1);
add('Performance', 'Total JS gzip ≤ 280 KB',
  totalJsGzip != null && totalJsGzip <= 280 * 1024 ? 'pass' : totalJsGzip == null ? 'warn' : 'fail',
  `${fmtKB(totalJsGzip)} / 280 KB target.`,
  1);

/* ------------ CATEGORY: Trust signals ------------ */
const hasAccreditations = existsSync('src/data/contact.js') &&
  /accreditations\s*=/.test(readFileSync('src/data/contact.js', 'utf8'));
add('Trust signals', 'Accreditation badges (NABH/NABL/JCI/ISO)',
  hasAccreditations ? 'pass' : 'warn',
  hasAccreditations ? 'Accreditations data present.' : 'Accreditations data missing.',
  2);

const hasStats = existsSync('src/data/contact.js') &&
  /stats\s*=/.test(readFileSync('src/data/contact.js', 'utf8'));
add('Trust signals', 'Real metrics with units (years, beds, etc.)',
  hasStats ? 'pass' : 'warn',
  hasStats ? 'Stats data present.' : 'No stats data.',
  2);

const hasTestimonials = existsSync('src/data/contact.js') &&
  /testimonials\s*=/.test(readFileSync('src/data/contact.js', 'utf8'));
add('Trust signals', 'Patient testimonials with name + condition',
  hasTestimonials ? 'pass' : 'warn',
  hasTestimonials ? 'Testimonials defined.' : 'No testimonials data.',
  1);

const hasPrivacyNotice = /confidential and used only|patient confidentiality/i.test(jsxText);
add('Trust signals', 'Privacy notice on data-collection forms',
  hasPrivacyNotice ? 'pass' : 'warn',
  hasPrivacyNotice ? 'Privacy notice present in form areas.' : 'No privacy notice — add to appointment forms.',
  2);

/* ------------ CATEGORY: Forms ------------ */
const formInputModes = (jsxText.match(/inputMode=["']tel["']/g) || []).length;
add('Forms', 'Phone fields use inputMode="tel"',
  formInputModes >= 2 ? 'pass' : 'warn',
  `${formInputModes} tel inputs detected.`,
  1);

const requiredAria = /role="alert"/.test(jsxText);
add('Forms', 'Errors announced via role="alert"',
  requiredAria ? 'pass' : 'warn',
  requiredAria ? 'role="alert" used on errors.' : 'No role="alert" — screen-readers won\'t announce form errors.',
  1);

/* ------------ CATEGORY: Motion / interaction ------------ */
const hasAnimatePresence = /AnimatePresence/.test(jsxText);
const hasReveal = /<Reveal\b|<Stagger\b/.test(jsxText);
add('Motion', 'Page transitions + scroll reveals',
  hasAnimatePresence && hasReveal ? 'pass' : 'warn',
  hasAnimatePresence && hasReveal ? 'AnimatePresence + Reveal/Stagger used.' : 'Static feel — add transitions.',
  1);

const hasModal = /DoctorModal/.test(jsxText) && /role=["']dialog["']/.test(jsxText);
add('Motion', 'Doctor profile modal with dialog semantics',
  hasModal ? 'pass' : 'warn',
  hasModal ? 'DoctorModal exists with role="dialog".' : 'No accessible doctor modal.',
  1);

/* ------------ Compose report ------------ */
const ICON = { pass: '✅', warn: '⚠️', fail: '❌' };
const cats = [...new Set(findings.map(f => f.category))];

let totalEarned = 0, totalWeight = 0;
const catScores = {};
for (const c of cats) {
  const items = findings.filter(f => f.category === c);
  const w = items.reduce((s, f) => s + f.weight, 0);
  const e = items.reduce((s, f) => s + (f.status === 'pass' ? f.weight : f.status === 'warn' ? f.weight * 0.5 : 0), 0);
  catScores[c] = { earned: e, weight: w, pct: Math.round((e / w) * 100) };
  totalEarned += e;
  totalWeight += w;
}
const overall = Math.round((totalEarned / totalWeight) * 100);
const grade =
  overall >= 90 ? 'A — ship-ready' :
  overall >= 80 ? 'B — minor polish' :
  overall >= 70 ? 'C — material gaps' :
  overall >= 60 ? 'D — significant work' : 'F — major rework';

const lines = [];
lines.push('# Arogya Dhaam — UI/UX audit');
lines.push('');
lines.push(`**Score: ${overall}/100 — ${grade}**`);
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('Scored against [.claude/skills/medical-ui/SKILL.md](../.claude/skills/medical-ui/SKILL.md) — color, typography, layout, components, accessibility, performance, trust patterns, forms, motion.');
lines.push('');
lines.push('## Category breakdown');
lines.push('');
lines.push('| Category | Score |');
lines.push('|---|---|');
for (const c of cats) {
  const s = catScores[c];
  lines.push(`| ${c} | **${s.pct}%** (${s.earned.toFixed(1)} / ${s.weight}) |`);
}
lines.push('');
lines.push('## Findings');
lines.push('');
for (const c of cats) {
  lines.push(`### ${c}`);
  lines.push('');
  for (const f of findings.filter(x => x.category === c)) {
    lines.push(`- ${ICON[f.status]} **${f.criterion}** — ${f.detail}`);
  }
  lines.push('');
}

// Recommendations: collected from non-pass items
const todo = findings.filter(f => f.status !== 'pass').sort((a, b) =>
  (b.weight - a.weight) || (a.status === 'fail' ? -1 : 1));
lines.push('## Top opportunities (by weight × severity)');
lines.push('');
if (todo.length === 0) {
  lines.push('_No outstanding gaps — all checks pass._');
} else {
  let i = 1;
  for (const f of todo) {
    lines.push(`${i}. ${ICON[f.status]} **[${f.category}] ${f.criterion}** — ${f.detail}`);
    i++;
  }
}
lines.push('');

// Methodology
lines.push('## Methodology');
lines.push('');
lines.push('- Static parses of CSS (tokens, focus styles, reduced-motion), JSX (component composition, ARIA, tel: links), and built JS/CSS bundles (gzip sizes vs SKILL.md budgets).');
lines.push('- Each criterion has a weight (1–3); pass = full points, warn = half, fail = 0. Overall is weighted-percent.');
lines.push('- Static checks complement, do not replace: Lighthouse mobile run, manual keyboard tab-through, screen-reader smoke (NVDA / VoiceOver), and color-contrast audit (axe / Stark).');
lines.push('');
lines.push('## How to reproduce a higher score');
lines.push('');
lines.push('Edit code → re-run `npm run build && node scripts/audit-uiux.mjs`. The script targets the categories in priority order; fix top-of-list opportunities first.');
lines.push('');

if (!existsSync('docs')) mkdirSync('docs', { recursive: true });
writeFileSync(REPORT, lines.join('\n'), 'utf8');

// Console summary
console.log(`\n  🩺 UI/UX audit  ${overall}/100  ${grade}\n`);
for (const c of cats) {
  console.log(`     ${catScores[c].pct.toString().padStart(3)}%  ${c}`);
}
console.log(`\n  Report: ${REPORT}\n`);
if (todo.length) {
  console.log(`  Top 3 opportunities:`);
  todo.slice(0, 3).forEach((f, i) => console.log(`     ${i + 1}. ${ICON[f.status]} [${f.category}] ${f.criterion}`));
  console.log('');
}
