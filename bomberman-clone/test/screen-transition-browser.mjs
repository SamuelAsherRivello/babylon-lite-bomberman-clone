import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-webgpu'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const url = new URL(process.env.GAME_URL || 'http://127.0.0.1:5180/babylon-lite-bomberman-clone/');
url.searchParams.set('mute', '1');
url.searchParams.set('mode', 'offline');

try {
  await page.goto(url.href);
  await page.locator('.arena-stage').waitFor();
  await page.waitForFunction(() => {
    const transition = document.querySelector('.screen-transition');
    return transition?.dataset.phase && transition.dataset.phase !== 'idle';
  });
  const layout = await page.evaluate(() => {
    const stage = document.querySelector('.arena-stage');
    const transition = document.querySelector('.screen-transition');
    const left = document.querySelector('.screen-door-left');
    const right = document.querySelector('.screen-door-right');
    return {
      stage: stage.getBoundingClientRect().toJSON(),
      transition: transition.getBoundingClientRect().toJSON(),
      left: left.getBoundingClientRect().toJSON(),
      right: right.getBoundingClientRect().toJSON(),
      phase: transition.dataset.phase,
      parent: transition.dataset.parent,
      type: transition.dataset.type,
      parentIsStage: transition.parentElement === stage,
      pointerEvents: getComputedStyle(transition).pointerEvents,
      zIndex: getComputedStyle(transition).zIndex,
      leftArt: getComputedStyle(left, '::before').backgroundImage,
      rightArt: getComputedStyle(right, '::before').backgroundImage,
      rightArtFlip: getComputedStyle(right, '::before').transform,
    };
  });
  assert.equal(layout.parent, 'game-world');
  assert.equal(layout.type, 'screen-door');
  assert.equal(layout.parentIsStage, true);
  assert.equal(layout.pointerEvents, 'none');
  assert.equal(layout.zIndex, '3');
  assert.match(layout.leftArt, /door-half\.png/);
  assert.match(layout.rightArt, /door-half\.png/);
  assert.notEqual(layout.rightArtFlip, 'none');
  assert.equal(layout.transition.width, layout.stage.width);
  assert.equal(layout.transition.height, layout.stage.height);
  assert.ok(Math.abs(layout.left.width + layout.right.width - (layout.transition.width + 2)) <= 1);

  await page.waitForFunction(
    () => ['opening', 'idle'].includes(document.querySelector('.screen-transition')?.dataset.phase),
    null,
    { timeout: 1500 },
  );
} finally {
  await browser.close();
}
