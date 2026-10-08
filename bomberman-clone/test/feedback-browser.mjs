import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-webgpu'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } }),
  errors = [];
page.on('pageerror', (e) => errors.push(e.message));
try {
  await page.goto(
    process.env.GAME_URL || 'http://127.0.0.1:5180/babylon-lite-bomberman-clone/?mute=1',
  );
  await page.getByText('Starting Babylon Lite…').waitFor({ state: 'hidden' });
  for (const name of ['Bomb', 'Range', 'Speed', 'Glove', 'Lightning'])
    await page
      .locator('.powerup-legend strong')
      .filter({ hasText: new RegExp(`^${name}$`) })
      .waitFor();
  await page.evaluate(async () => {
    const [{ createControls }, { createGame, stepGame }] = await Promise.all([
      import('./src/input/controls.js'),
      import('./src/game/rules.js'),
    ]);
    const controls = createControls();
    try {
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'D', shiftKey: true, bubbles: true }),
      );
      if (controls.read().x !== 1) throw Error('Caps Lock/Shift movement');
      document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'd', bubbles: true }));
      if (controls.read().x !== 0) throw Error('case-insensitive release');
    } finally {
      controls.dispose();
      window.dispatchEvent(new Event('blur'));
    }
    const g = createGame(),
      p = g.players[0];
    p.x = 1.5;
    p.y = 2.5;
    for (let n = 0; n < 20; n++) stepGame(g, { practice: { x: 1, y: 0 } });
    if (p.x !== 1.5) throw Error('corridor wiggle');
  });
  await page.getByLabel('CPU difficulty').selectOption('HARD');
  assert.equal(await page.getByLabel('CPU difficulty').inputValue(), 'HARD');
  for (const size of ['LOW', 'MED', 'HIGH']) {
    await page.getByLabel('Map size').selectOption(size);
    await page.waitForTimeout(100);
    assert.equal(await page.getByLabel('Map size').inputValue(), size);
  }
  await page.getByLabel('Plant:').check();
  await page.getByLabel('Bomb Flash:').uncheck();
  await page.reload();
  await page.getByText('Starting Babylon Lite…').waitFor({ state: 'hidden' });
  assert.equal(await page.getByLabel('Bomb Flash:').isChecked(), false);
  await page.getByLabel('Map size').selectOption('LOW');
  await page.keyboard.press('Space');
  const placed = Date.now();
  await page.getByText('● ELIMINATED', { exact: true }).waitFor();
  const died = Date.now();
  assert.ok(died - placed >= 2200);
  assert.equal(
    await page.getByRole('button', { name: 'Try again ↗' }).count(),
    0,
    'death cause remains unobscured before prompt',
  );
  await page.getByRole('button', { name: 'Try again ↗' }).waitFor();
  assert.ok(Date.now() - died >= 2800, 'prompt waits three seconds after elimination');
  await page.getByRole('button', { name: 'Try again ↗' }).click();
  await page.getByText('● READY TO BLAST', { exact: true }).waitFor();
  await page.screenshot({ path: 'bomberman-clone/documentation/screenshot01.png' });
  assert.deepEqual(errors, []);
  console.log(
    'PASS feedback menu, all pickup meanings, map selection, persisted bomb-flash preference and real death/retry delay.',
  );
} finally {
  await browser.close();
}
