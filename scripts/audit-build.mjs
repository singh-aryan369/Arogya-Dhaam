#!/usr/bin/env node
// Bundle-size audit. Fails if initial JS exceeds budget defined in medical-ui SKILL.md.
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist/assets';
const BUDGETS = {
  initialJsGzip: 120 * 1024,   // SKILL.md target
  initialCssGzip: 30 * 1024,
  totalJsGzip: 280 * 1024
};

const files = readdirSync(DIST).map(f => {
  const path = join(DIST, f);
  const raw = readFileSync(path);
  return {
    name: f,
    size: statSync(path).size,
    gzip: gzipSync(raw).length
  };
});

const fmt = (n) => n < 1024 ? `${n} B` : `${(n/1024).toFixed(2)} KB`;

const isInitial = (n) => /^index-/.test(n) || /^react-vendor-/.test(n);
const initialJs = files.filter(f => f.name.endsWith('.js') && isInitial(f.name));
const initialCss = files.filter(f => f.name.endsWith('.css') && f.name.startsWith('index-'));
const allJs = files.filter(f => f.name.endsWith('.js'));

const initialJsGzip = initialJs.reduce((s, f) => s + f.gzip, 0);
const initialCssGzip = initialCss.reduce((s, f) => s + f.gzip, 0);
const totalJsGzip = allJs.reduce((s, f) => s + f.gzip, 0);

console.log('\n  📦 Build audit\n');
console.log('  Initial chunks:');
[...initialJs, ...initialCss].forEach(f => {
  console.log(`    ${f.name.padEnd(46)} ${fmt(f.size).padStart(10)}  gzip ${fmt(f.gzip)}`);
});
console.log('\n  Per-route chunks:');
allJs.filter(f => !isInitial(f.name)).forEach(f => {
  console.log(`    ${f.name.padEnd(46)} ${fmt(f.size).padStart(10)}  gzip ${fmt(f.gzip)}`);
});

const checks = [
  { label: 'Initial JS (gzip)', actual: initialJsGzip, budget: BUDGETS.initialJsGzip },
  { label: 'Initial CSS (gzip)', actual: initialCssGzip, budget: BUDGETS.initialCssGzip },
  { label: 'Total JS (gzip)', actual: totalJsGzip, budget: BUDGETS.totalJsGzip }
];

console.log('\n  Budgets:');
let failed = 0;
for (const c of checks) {
  const ok = c.actual <= c.budget;
  if (!ok) failed++;
  console.log(`    ${ok ? '✓' : '✗'} ${c.label.padEnd(22)} ${fmt(c.actual).padStart(10)} / ${fmt(c.budget)} ${ok ? '' : '  OVER BUDGET'}`);
}

if (failed) {
  console.log(`\n  ${failed} budget violation(s).\n`);
  process.exit(1);
}
console.log('\n  ✓ All bundle budgets passed.\n');
