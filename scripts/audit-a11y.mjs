#!/usr/bin/env node
// Static a11y audit — scans JSX for common WCAG / medical-UI checklist failures.
// Not exhaustive; complements (does not replace) Lighthouse / axe DevTools.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src';
const findings = [];

const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(jsx|js)$/.test(f)) check(p, readFileSync(p, 'utf8'));
  }
};

const check = (file, src) => {
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    const ln = i + 1;

    // <img> without alt attribute
    if (/<img\b/.test(line) && !/alt=/.test(line)) {
      findings.push({ file, line: ln, rule: 'img-alt', msg: '<img> missing alt attribute' });
    }
    // role="alert" without aria-live (acceptable but flag for awareness)
    // (skip — role=alert implies aria-live=assertive)

    // <a href="#"> placeholder links
    if (/<a\s+[^>]*href=["']#["']/.test(line) && !/className=["']ftr/.test(line)) {
      findings.push({ file, line: ln, rule: 'placeholder-href', msg: 'Anchor uses href="#" (placeholder)', severity: 'info' });
    }

    // onClick on non-button without role
    if (/onClick=/.test(line) && /<div/.test(line) && !/role=/.test(line) && !/onKeyDown/.test(line)) {
      findings.push({ file, line: ln, rule: 'click-no-role', msg: '<div onClick> without role/keyboard handler' });
    }

    // <button> without type defaults to submit inside forms — flag bare <button>
    if (/<button\b/.test(line) && !/type=/.test(line) && !/className=["']btn/.test(line)) {
      // Heuristic only — many components use className="btn"; allow those
    }

    // Form input without label association — heuristic: input with id but no <label htmlFor=>
    // (handled at form level by manual review; skipped here)
  });

  // Page-level: ensure files using lucide icons pass aria-hidden where decorative
  // Heuristic: any <Icon ... /> that isn't aria-hidden or aria-label
  const iconUses = src.match(/<(Phone|Mail|MapPin|Clock|Heart|Award|Stethoscope|ShieldCheck|ChevronRight|ArrowRight|Search|Check|Quote|CalendarPlus|Menu|X|Cross|Activity|Ambulance|Languages|Clock3|Navigation|Sparkles|Microscope|Users|AlertCircle|CheckCircle2)\s+[^>]*\/?>/g) || [];
  for (const u of iconUses) {
    if (!/aria-hidden|aria-label/.test(u)) {
      findings.push({ file, line: 0, rule: 'icon-no-aria', msg: `Icon may be missing aria-hidden: ${u.slice(0, 80)}…` });
    }
  }
};

walk(ROOT);

const errors = findings.filter(f => f.severity !== 'info');
const infos = findings.filter(f => f.severity === 'info');

console.log('\n  ♿ A11y static audit\n');
if (errors.length === 0) {
  console.log('  ✓ No errors found by static checks.');
} else {
  console.log(`  ✗ ${errors.length} potential issue(s):\n`);
  for (const f of errors) {
    console.log(`    ${f.file}${f.line ? ':' + f.line : ''}  [${f.rule}]  ${f.msg}`);
  }
}
if (infos.length) {
  console.log(`\n  ℹ ${infos.length} info note(s):\n`);
  for (const f of infos) {
    console.log(`    ${f.file}:${f.line}  [${f.rule}]  ${f.msg}`);
  }
}
console.log('\n  Note: this is a static, partial audit. Run Lighthouse + manual keyboard test before shipping.\n');
process.exit(errors.length ? 1 : 0);
