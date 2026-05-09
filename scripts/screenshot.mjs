#!/usr/bin/env node
// Drive system Chrome via Playwright (no Chromium download). Captures every route at
// desktop + mobile widths, both above-the-fold and full-page, into ./audit-screenshots.
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4188';
const OUT = 'audit-screenshots';
const ROUTES = [
  ['home',         '/'],
  ['about',        '/about'],
  ['specialties',  '/specialties'],
  ['doctors',      '/doctors'],
  ['departments',  '/departments'],
  ['appointments', '/appointments'],
  ['contact',      '/contact'],
  ['blog',         '/blog'],
  ['blogpost',     '/blog/heart-health-40s'],
  ['notfound',     '/this-route-does-not-exist']
];
const VIEWPORTS = [
  { tag: 'desktop', width: 1280, height: 800 },
  { tag: 'mobile',  width: 390,  height: 844 }
];

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const launch = async () => {
  // Try system Chrome first (avoids chromium download); fall back to bundled.
  try {
    return await chromium.launch({ channel: 'chrome', headless: true });
  } catch (err) {
    console.warn('  ! Chrome channel failed, falling back to default:', err.message);
    return await chromium.launch({ headless: true });
  }
};

const browser = await launch();
const results = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'   // skips count-up animation so screenshots show final values
  });
  const page = await ctx.newPage();

  for (const [name, path] of ROUTES) {
    const url = `${BASE}${path}`;
    const startedAt = Date.now();
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 12000 });
      // wait one frame for transitions/fonts
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const status = resp ? resp.status() : 0;
      const file = join(OUT, `${vp.tag}--${name}.png`);
      await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
      const elapsed = Date.now() - startedAt;
      results.push({ ok: status === 200, vp: vp.tag, name, status, file, ms: elapsed });
      console.log(`  ${status === 200 ? '✓' : '✗'} ${vp.tag.padEnd(7)} ${name.padEnd(13)} ${String(status).padStart(3)}  ${elapsed}ms  →  ${file}`);
    } catch (err) {
      results.push({ ok: false, vp: vp.tag, name, error: err.message });
      console.log(`  ✗ ${vp.tag.padEnd(7)} ${name.padEnd(13)} ERR  ${err.message}`);
    }
  }
  await ctx.close();
}

await browser.close();

const failed = results.filter(r => !r.ok);
console.log(`\n  Screenshots: ${results.length - failed.length}/${results.length} ok`);
if (failed.length) process.exit(1);
