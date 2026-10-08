import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-webgpu'],
});
const url = new URL(process.env.GAME_URL || 'http://127.0.0.1:5180/babylon-lite-bomberman-clone/');
url.searchParams.set('mute', '1');
url.searchParams.delete('mode');
async function inspect(page, kind, orientation) {
  const layout = await page.evaluate(() => {
    const rect = (s) => {
      const r = document.querySelector(s).getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };
    const viewport = rect('#viewport'),
      arena = rect('.arena-square'),
      panel = rect('.game-panel'),
      grid = getComputedStyle(document.querySelector('.game-layout'));
    const content = document.querySelector('.panel-content'),
      section = document.querySelector('.game-panel');
    return {
      ratio: viewport.width / viewport.height,
      arena,
      panel,
      columns: grid.gridTemplateColumns.split(' ').length,
      rows: grid.gridTemplateRows.split(' ').length,
      coarse: matchMedia('(pointer: coarse)').matches,
      rotateNotice:
        getComputedStyle(document.querySelector('.orientation-notice')).display !== 'none',
      panelFits:
        section.scrollHeight <= section.clientHeight + 1 &&
        content.scrollHeight <= content.clientHeight + 1,
      sizes: {
        section: [section.clientHeight, section.scrollHeight],
        content: [content.clientHeight, content.scrollHeight],
        children: [...content.children].map((n) => [n.className, n.clientHeight, n.scrollHeight]),
      },
      corners: [...document.querySelectorAll('#ui_layer .corner')].every((n) => {
        const b = n.getBoundingClientRect();
        return (
          b.left >= viewport.x - 1 &&
          b.right <= viewport.right + 1 &&
          b.top >= viewport.y - 1 &&
          b.bottom <= viewport.bottom + 1
        );
      }),
    };
  });
  assert.ok(Math.abs(layout.ratio - 16 / 9) < 0.001, 'viewport stays landscape');
  assert.equal(layout.columns, 2, 'arena and panel stay side by side');
  if (kind === 'mobile' && orientation === 'portrait') {
    assert.ok(layout.rotateNotice, 'portrait-held phones show a rotate prompt');
    return layout;
  }
  assert.equal(layout.rotateNotice, false, 'landscape play has no rotate prompt');
  assert.ok(Math.abs(layout.arena.width - layout.arena.height) < 1, 'arena slot is square');
  assert.ok(
    layout.panelFits,
    `${kind} ${orientation}: information panel must fit without scrolling (${JSON.stringify(layout)})`,
  );
  assert.ok(layout.corners, 'all viewport corner roles remain inside the viewport');
  return layout;
}
async function load(context, kind) {
  const page = await context.newPage(),
    errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url.href);
  await page.getByText('Starting Babylon Lite…').waitFor({ state: 'hidden' });
  return { page, errors };
}
try {
  const pc = await browser.newContext({ viewport: { width: 1280, height: 900 } }),
    desktop = await load(pc, 'pc');
  await inspect(desktop.page, 'pc', 'landscape');
  await desktop.page.setViewportSize({ width: 800, height: 1000 });
  await inspect(desktop.page, 'pc', 'portrait-window');
  await desktop.page.getByRole('button', { name: 'Settings' }).click();
  await desktop.page.getByLabel('Mute all audio').waitFor();
  assert.equal(await desktop.page.getByLabel('Mute all audio').isChecked(), true);
  await desktop.page.getByRole('button', { name: 'Fullscreen', exact: true }).click();
  await desktop.page.waitForFunction(() => Boolean(document.fullscreenElement));
  await inspect(desktop.page, 'pc', 'fullscreen');
  await desktop.page.evaluate(() => document.exitFullscreen());
  await desktop.page.waitForTimeout(120);
  await desktop.page.getByRole('button', { name: 'Settings' }).click();
  await pc.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const phone = await load(mobile, 'mobile');
  await inspect(phone.page, 'mobile', 'portrait');
  await phone.page.setViewportSize({ width: 844, height: 390 });
  await phone.page.waitForTimeout(100);
  await inspect(phone.page, 'mobile', 'landscape-held');
  assert.deepEqual([...desktop.errors, ...phone.errors], []);
  await mobile.close();
  console.log(
    'PASS: one landscape composition for PC and mobile, portrait-held rotate prompt, square arena, no-scroll panel fit, corners, settings and fullscreen.',
  );
} finally {
  await browser.close();
}
