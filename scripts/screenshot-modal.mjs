#!/usr/bin/env node
// Screenshot the home page team section with a doctor modal open.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:4188';
const OUT = 'audit-screenshots';

const launch = async () => {
  try { return await chromium.launch({ channel: 'chrome', headless: true }); }
  catch { return await chromium.launch({ headless: true }); }
};

const browser = await launch();

for (const vp of [{ tag: 'desktop', width: 1280, height: 900 }, { tag: 'mobile', width: 390, height: 844 }]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 12000 });

  // Scroll to the team section so it's in view
  await page.evaluate(() => {
    const head = [...document.querySelectorAll('h2')].find(h => /Expert Team/i.test(h.textContent));
    head?.scrollIntoView({ block: 'start', behavior: 'instant' });
    window.scrollBy(0, -100);
  });
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${OUT}/${vp.tag}--home-team.png`, fullPage: false, animations: 'disabled' });
  console.log(`  ✓ ${vp.tag} team cards captured`);

  // Click the first team card to open modal
  await page.click('button.team__card');
  await page.waitForSelector('.doc-modal', { state: 'visible', timeout: 5000 });
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${OUT}/${vp.tag}--home-doctor-modal.png`, fullPage: false, animations: 'disabled' });
  console.log(`  ✓ ${vp.tag} doctor modal captured`);

  await ctx.close();
}

await browser.close();
console.log('  Done.');
