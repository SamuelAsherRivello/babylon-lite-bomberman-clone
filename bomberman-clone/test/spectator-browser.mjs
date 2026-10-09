import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { MultiplayerClient } from '@rmc/multiplayer-client';
import { requireBrowserBackend } from './browser-backend.mjs';

const url = process.env.GAME_URL || 'http://127.0.0.1:5173/babylon-lite-bomberman-clone/';
const backend = requireBrowserBackend();
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-webgpu'],
});
let observer;

async function until(check, label, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (!(await check())) {
    if (Date.now() > deadline) throw new Error(label);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}

async function player() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const target = new URL(url);
  target.searchParams.set('mute', '1');
  target.searchParams.set('server', backend);
  target.searchParams.set('mode', 'online');
  await page.goto(target.href);
  await page.getByRole('heading', { name: 'Battle with friends' }).waitFor();
  return page;
}

try {
  const a = await player();
  const b = await player();
  await a.getByRole('button', { name: 'Create room', exact: true }).click();
  const heading = a.getByRole('heading', { name: /^Room [A-Z0-9]{6}$/ });
  await heading.waitFor({ timeout: 30000 });
  const code = (await heading.innerText()).split(' ')[1];
  await b.getByLabel('Room code').fill(code);
  await b.getByRole('button', { name: 'Join room', exact: true }).click();
  await b.getByRole('heading', { name: `Room ${code}` }).waitFor({ timeout: 30000 });

  observer = new MultiplayerClient(backend, 'bomberman', { code });
  void observer.connect();
  await until(() => observer.state.status === 'connected', 'observer joins the room');
  observer.send('ready');
  await a.getByRole('button', { name: 'Ready up', exact: true }).click();
  await b.getByRole('button', { name: 'Ready up', exact: true }).click();
  await until(() => observer.state.gameState?.phase === 'playing', 'round starts');
  await a.getByText(/s · ALIVE/).waitFor();
  await b.getByText(/s · ALIVE/).waitFor();

  const bColor = Number(
    (await b.locator('.scoreboard .seat').filter({ hasText: /^YOU / }).getAttribute('class')).match(
      /seat_(\d+)/,
    )[1],
  );
  const bId = observer.state.gameState.people.find((p) => p.color === bColor).id;
  const aId = observer.state.gameState.people.find((p) => p.number === 0).id;
  await b.keyboard.press('Space');
  await until(
    () =>
      observer.state.gameState.phase === 'playing' &&
      observer.state.gameState.players.find((p) => p.id === bId)?.alive === false,
    'player dies while the room continues',
    6000,
  );
  await b.getByText(/s · SPECTATING/).waitFor({ timeout: 2000 });
  await b.waitForTimeout(150);
  const frozenFrame = await b.locator('canvas').screenshot();
  const beforeX = observer.state.gameState.players.find((p) => p.id === aId).x;
  await a.keyboard.down('ArrowRight');
  await a.waitForTimeout(300);
  await a.keyboard.up('ArrowRight');
  await until(
    () => observer.state.gameState.players.find((p) => p.id === aId).x > beforeX + 0.15,
    'survivor moves after elimination',
  );
  await until(
    async () => !frozenFrame.equals(await b.locator('canvas').screenshot()),
    'spectator canvas stays frozen after the survivor moves',
    1700,
  );
  assert.equal(observer.state.gameState.phase, 'playing');
  console.log('PASS: eliminated player immediately sees the live multiplayer arena.');
} finally {
  observer?.disconnect();
  await browser.close();
}
