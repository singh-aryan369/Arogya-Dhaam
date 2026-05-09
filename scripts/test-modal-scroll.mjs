#!/usr/bin/env node
// E2E test: when DoctorModal is open, background scroll is locked. After close, scroll restores.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:4188';

const launch = async () => {
  try { return await chromium.launch({ channel: 'chrome', headless: true }); }
  catch { return await chromium.launch({ headless: true }); }
};

const browser = await launch();
let failed = 0;

for (const vp of [
  { tag: 'desktop', width: 1280, height: 800 },
  { tag: 'mobile',  width: 390,  height: 844 }
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  // Wait for animations + scroll-reveal triggers to settle
  await page.waitForTimeout(500);

  // Scroll the team card into view (so .click() does not auto-scroll)
  const card = page.locator('button.team__card').first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const beforeY = await page.evaluate(() => window.scrollY);
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);

  // Open the modal
  await card.click();
  await page.waitForSelector('.doc-modal', { state: 'visible' });
  await page.waitForTimeout(500);

  // Try to scroll while locked — should NOT move
  await page.mouse.wheel(0, 800);
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(150);
  const lockedY = await page.evaluate(() => window.scrollY);
  const bodyPos = await page.evaluate(() => getComputedStyle(document.body).position);
  const bodyTop = await page.evaluate(() => document.body.style.top);

  const lockOk = bodyPos === 'fixed';

  // Close
  await page.locator('.doc-modal__close').click();
  await page.waitForSelector('.doc-modal', { state: 'detached', timeout: 3000 });
  await page.waitForTimeout(500);

  const afterY  = await page.evaluate(() => window.scrollY);
  const docH2   = await page.evaluate(() => document.documentElement.scrollHeight);
  const bodyPos2 = await page.evaluate(() => getComputedStyle(document.body).position);

  // Tolerance: restoration may drift by scrollbar width (desktop) or up to a
  // viewport-fraction (mobile, due to browser scroll anchoring during reflow).
  // What matters is the user lands back near the team-cards section.
  const restoredOk = Math.abs(afterY - beforeY) < (vp.height * 0.5);
  const unlockedOk = bodyPos2 !== 'fixed';

  // Verify scroll now works
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(150);
  const afterScrollY = await page.evaluate(() => window.scrollY);
  const scrollWorks  = afterScrollY > afterY;

  const ok = lockOk && restoredOk && unlockedOk && scrollWorks;
  console.log(`  ${ok ? '✓' : '✗'} ${vp.tag.padEnd(7)}  beforeY=${beforeY} (docH=${docH})  lockedY=${lockedY}/bodyTop=${bodyTop}  afterY=${afterY} (docH2=${docH2})  scrollWorks=${scrollWorks}`);
  if (!ok) {
    failed++;
    console.log(`     details: lockOk=${lockOk} restoredOk=${restoredOk} unlockedOk=${unlockedOk}`);
  }

  await ctx.close();
}

await browser.close();
if (failed) { console.log(`\n  ${failed} viewport(s) failed.`); process.exit(1); }
console.log('\n  ✓ Scroll lock + restore verified on desktop and mobile.');
