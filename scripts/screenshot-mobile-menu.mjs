#!/usr/bin/env node
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:4188';

const launch = async () => {
  try { return await chromium.launch({ channel: 'chrome', headless: true }); }
  catch { return await chromium.launch({ headless: true }); }
};

const browser = await launch();

// Capture both Home (over-hero teal nav) and a subpage (white nav)
const targets = [
  ['home',     '/'],
  ['contact',  '/contact']
];

for (const [name, path] of targets) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  // Open menu
  await page.click('button.nav__toggle');
  await page.waitForSelector('.nav__drawer.is-open', { state: 'visible' });
  await page.waitForTimeout(400);

  await page.screenshot({
    path: `audit-screenshots/mobile--menu-open-${name}.png`,
    fullPage: false,
    animations: 'disabled'
  });
  console.log(`  ✓ mobile menu open on ${name}`);

  await ctx.close();
}

await browser.close();
console.log('  Done.');
