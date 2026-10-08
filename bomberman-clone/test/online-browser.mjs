import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { MultiplayerClient } from '@rmc/multiplayer-client';
import { decode } from '@colyseus/schema';
import { unpack } from '@colyseus/msgpackr';
import { Protocol } from '@colyseus/shared-types';

// A separate integration command: requires the running application and public backend.
const url = process.env.GAME_URL || 'http://127.0.0.1:5173/babylon-lite-bomberman-clone/';
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-webgpu'],
});
const pages = [],
  errors = [];
let observer, fourth, touchObserver, expiryProbe;
async function until(fn, label, timeout = 10000) {
  const end = Date.now() + timeout;
  while (!(await fn())) {
    if (Date.now() > end) throw Error(label);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}
function inputPacket(bytes) {
  try {
    const it = { offset: 1 },
      buffer = new Uint8Array(bytes);
    if (
      buffer[0] !== Protocol.ROOM_DATA ||
      !decode.stringCheck(buffer, it) ||
      decode.string(buffer, it) !== 'input'
    )
      return null;
    return unpack(buffer.subarray(it.offset));
  } catch {
    return null;
  }
}
async function page(options = {}, destination = url) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...options });
  const p = await context.newPage();
  pages.push(p);
  p.on('console', (message) => {
    const text = message.text();
    if (
      /Socket closed:|min uptime|No more retries|Network offline|will retry|reconnection successful/.test(
        text,
      )
    )
      console.log(text);
  });
  await p.addInitScript(() => {
    const Socket = window.WebSocket;
    window.WebSocket = new Proxy(Socket, {
      construct(Target, args) {
        const socket = new Target(...args);
        socket.addEventListener('close', (event) =>
          console.info('Socket closed:', event.code, event.reason),
        );
        return socket;
      },
    });
  });
  p.on('pageerror', (e) => errors.push(e.message));
  const target = new URL(destination);
  target.searchParams.set('mute', '1');
  await p.goto(target.href);
  if (target.searchParams.has('room'))
    await p
      .getByRole('heading', { name: `Room ${target.searchParams.get('room')}` })
      .waitFor({ timeout: 30000 });
  else if (target.searchParams.get('mode') !== 'online')
    await p.getByRole('button', { name: 'Play online', exact: true }).click();
  else await p.getByRole('heading', { name: 'Battle with friends' }).waitFor();
  await p.waitForFunction(
    () => document.querySelector('canvas')?.getBoundingClientRect().height > 0,
    null,
    { timeout: 15000 },
  );
  await checkLayout(p);
  if (process.env.EXPECTED_VERSION)
    assert.ok(
      (await p.locator('footer.corner_bottom_right').innerText()).includes(
        `v${process.env.EXPECTED_VERSION}`,
      ),
      'browser displays the expected deployed release',
    );
  return p;
}
async function checkLayout(p) {
  const fit = await p.evaluate(() => {
    const box = document.querySelector('#viewport').getBoundingClientRect(),
      canvas = document.querySelector('canvas').getBoundingClientRect();
    const corners = [...document.querySelectorAll('#ui_layer .corner')].map((n) =>
      n.getBoundingClientRect(),
    );
    const panel = document.querySelector('.game-panel'),
      panelBox = panel.getBoundingClientRect(),
      arena = document.querySelector('.arena-square').getBoundingClientRect(),
      coarse = matchMedia('(pointer: coarse)').matches;
    const grid = getComputedStyle(document.querySelector('.game-layout'));
    return {
      ratio: box.width / box.height,
      gutters: document.querySelectorAll('.gutter').length,
      coarse,
      canvasFits: canvas.height > 0 && canvas.top >= box.top && canvas.bottom <= box.bottom,
      cornersFit:
        corners.length === 4 &&
        corners.every(
          (n) =>
            n.left >= box.left &&
            n.right <= box.right &&
            n.top >= box.top &&
            n.bottom <= box.bottom,
        ),
      rows: grid.gridTemplateRows.split(' ').length,
      columns: grid.gridTemplateColumns.split(' ').length,
      square: Math.abs(arena.width - arena.height) < 1,
      panelFits:
        panel.scrollHeight <= panel.clientHeight + 1 &&
        panel.querySelector('.panel-content').scrollHeight <=
          panel.querySelector('.panel-content').clientHeight + 1,
    };
  });
  if (fit.coarse) {
    assert.ok(Math.abs(fit.ratio - 9 / 16) < 0.001);
    assert.equal(fit.rows, 2, 'mobile stays stacked');
  } else {
    assert.ok(Math.abs(fit.ratio - 16 / 9) < 0.001);
    assert.equal(fit.columns, 2, 'PC stays side by side');
  }
  assert.equal(fit.gutters, 4);
  assert.ok(
    fit.square && fit.panelFits && fit.canvasFits && fit.cornersFit,
    `arena, panel and corner roles fit within viewport: ${JSON.stringify(fit)}`,
  );
}
async function mintPosition(p) {
  const screenshot = await p.locator('canvas').screenshot();
  return p.evaluate(
    async (bytes) => {
      const image = await createImageBitmap(
        new Blob([new Uint8Array(bytes)], { type: 'image/png' }),
      );
      const c = new OffscreenCanvas(image.width, image.height),
        ctx = c.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, c.width, c.height).data;
      let x = 0,
        y = 0,
        n = 0;
      for (let i = 0; i < pixels.length; i += 4)
        if (pixels[i] === 121 && pixels[i + 1] === 222 && pixels[i + 2] === 208) {
          x += (i / 4) % c.width;
          y += Math.floor(i / 4 / c.width);
          n++;
        }
      assertPixel(n);
      function assertPixel(n) {
        if (!n) throw Error('Mint player was not rendered');
      }
      return { x: x / n, y: y / n };
    },
    [...screenshot],
  );
}
try {
  const a = await page();
  let b = await page();
  await a.getByRole('button', { name: 'Create room', exact: true }).click();
  const heading = a.getByRole('heading', { name: /^Room [A-Z0-9]{6}$/ });
  await heading.waitFor({ timeout: 30000 });
  const code = (await heading.innerText()).split(' ')[1];
  await b.getByLabel('Room code').fill(code);
  await b.getByRole('button', { name: 'Join room', exact: true }).click();
  await b.getByRole('heading', { name: `Room ${code}` }).waitFor({ timeout: 30000 });
  await a.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await a.getByRole('button', { name: 'Copy room link', exact: true }).click();
  await a.getByText('Room link copied.', { exact: true }).waitFor();
  const invite = new URL(await a.evaluate(() => navigator.clipboard.readText()));
  assert.equal(invite.searchParams.get('room'), code);
  assert.equal(invite.searchParams.get('mode'), 'online');
  await b.close();
  b = await page({}, invite.href);
  await b.getByRole('heading', { name: `Room ${code}` }).waitFor();
  await until(async () => {
    const rows = await b.locator('.overlay ul li').allInnerTexts();
    return rows.filter((row) => !row.includes('CPU')).length === 3;
  }, 'invite link joins as a new browser while the disconnected seat is reserved');
  await a.getByRole('button', { name: 'Amber', exact: true }).click();
  await a.getByText('Player 1 · Amber').waitFor();
  await a.getByRole('button', { name: 'Mint', exact: true }).click();
  await a.getByText('Player 1 · Mint').waitFor();
  assert.equal(
    await b.getByRole('button', { name: 'Mint', exact: true }).isDisabled(),
    true,
    'occupied colors cannot be selected',
  );
  observer = new MultiplayerClient(
    process.env.BACKEND_URL || 'https://rmc-colyseus-multiplayer-server.vercel.app',
    'bomberman',
    { code },
  );
  fourth = new MultiplayerClient(
    process.env.BACKEND_URL || 'https://rmc-colyseus-multiplayer-server.vercel.app',
    'bomberman',
    { code },
  );
  void observer.connect();
  await until(() => observer.state.status === 'connected', 'third human admission');
  void fourth.connect();
  await until(() => fourth.state.status === 'connected', 'fourth human admission');
  observer.send('ready');
  fourth.send('ready');
  await a.getByRole('button', { name: 'Ready up', exact: true }).click();
  await b.getByRole('button', { name: 'Ready up', exact: true }).click();
  for (const p of [a, b]) await p.getByText(/s · ALIVE/).waitFor({ timeout: 10000 });
  const first = observer.state.gameState.people.find((p) => p.number === 0);
  assert.equal(observer.state.gameState.players.length, 4);
  // Delay outbound WebSocket traffic and add bounded deterministic jitter. The
  // transport instance already exists; patch its prototype without touching admission.
  await a.evaluate(() => {
    const original = WebSocket.prototype.send;
    window.restoreTransport = () => {
      WebSocket.prototype.send = original;
    };
    window.outgoingInputs = [];
    let packet = 0,
      delivery = 0;
    WebSocket.prototype.send = function (data) {
      const copy = ArrayBuffer.isView(data)
        ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice()
        : data instanceof ArrayBuffer
          ? data.slice(0)
          : data;
      window.outgoingInputs.push({
        time: performance.now(),
        bytes: Array.from(copy instanceof ArrayBuffer ? new Uint8Array(copy) : copy),
      });
      const ws = this;
      delivery = Math.max(delivery + 1, performance.now() + 180 + (packet++ % 4) * 20);
      setTimeout(
        () => {
          if (ws.readyState === WebSocket.OPEN) original.call(ws, copy);
        },
        Math.max(0, delivery - performance.now()),
      );
    };
  });
  const before = await mintPosition(a);
  await a.keyboard.down('ArrowRight');
  await a.waitForTimeout(80);
  const immediate = await mintPosition(a);
  assert.ok(
    immediate.x > before.x + 2,
    'movement renders before delayed outbound input can reach server',
  );
  await a.waitForTimeout(220);
  await a.keyboard.up('ArrowRight');
  await a.waitForTimeout(1000);
  const local = await mintPosition(a),
    remote = await mintPosition(b);
  assert.ok(
    Math.abs(local.x - remote.x) < 8,
    'reconciled local and interpolated remote positions converge',
  );
  await a.keyboard.down('ArrowDown');
  await a.waitForTimeout(100);
  const menuTime = await a.evaluate(() => performance.now());
  await a.getByRole('button', { name: 'Settings' }).click();
  let neutral;
  const neutralDeadline = Date.now() + 10000;
  while (!neutral) {
    const sent = await a.evaluate(
      (since) => window.outgoingInputs.filter((p) => p.time >= since),
      menuTime,
    );
    neutral = sent
      .map((p) => inputPacket(p.bytes))
      .find((p) => p && p.x === 0 && p.y === 0 && !p.bomb);
    if (Date.now() > neutralDeadline) throw Error('settings emits neutral input');
    await a.waitForTimeout(30);
  }
  await until(
    () => observer.state.gameState.players.find((p) => p.id === first.id).ack >= neutral.seq,
    'server acknowledges settings neutralization',
  );
  const stopped = structuredClone(observer.state.gameState.players.find((p) => p.id === first.id));
  await a.waitForTimeout(350);
  const still = observer.state.gameState.players.find((p) => p.id === first.id);
  assert.ok(
    Math.hypot(still.x - stopped.x, still.y - stopped.y) < 0.01,
    'settings neutralizes held movement while shared server continues',
  );
  await a.getByRole('button', { name: 'Resume', exact: true }).click();
  await a.keyboard.up('ArrowDown');
  await a.evaluate(() => window.restoreTransport());
  await a.waitForTimeout(350);
  const actorState = () => observer.state.gameState.players.find((p) => p.id === first.id);
  await a.keyboard.down('ArrowRight');
  await a.waitForTimeout(100);
  await a.evaluate(() => window.dispatchEvent(new Event('blur')));
  await a.waitForTimeout(350);
  const blurredX = actorState().x;
  await a.waitForTimeout(250);
  assert.ok(
    Math.abs(actorState().x - blurredX) < 0.01,
    'simulated focus loss clears held movement',
  );
  await a.keyboard.up('ArrowRight');
  async function walk(axis, target) {
    const start = actorState()[axis];
    if (Math.abs(start - target) < 0.15) return;
    const positive = target > start,
      key =
        axis === 'x' ? (positive ? 'ArrowRight' : 'ArrowLeft') : positive ? 'ArrowDown' : 'ArrowUp';
    await a.keyboard.down(key);
    try {
      await until(
        () =>
          positive ? actorState()[axis] >= target - 0.08 : actorState()[axis] <= target + 0.08,
        `walk ${axis} to ${target}`,
        5000,
      );
    } finally {
      await a.keyboard.up(key);
    }
    await a.waitForTimeout(50);
  }
  async function center(axis, target) {
    await a.waitForTimeout(600);
    for (let n = 0; n < 12 && Math.abs(actorState()[axis] - target) > 0.12; n++) {
      const delta = target - actorState()[axis],
        key =
          axis === 'x'
            ? delta > 0
              ? 'ArrowRight'
              : 'ArrowLeft'
            : delta > 0
              ? 'ArrowDown'
              : 'ArrowUp';
      await a.keyboard.down(key);
      await a.waitForTimeout(Math.min(100, (Math.abs(delta) / actorState().speed) * 1000));
      await a.keyboard.up(key);
      await a.waitForTimeout(600);
    }
    assert.ok(Math.abs(actorState()[axis] - target) < 0.2, `center ${axis} at ${target}`);
  }
  // Legal keyboard actions reveal and collect the first seeded bomb-slot item,
  // then place two bombs with unequal deadlines and verify a real chain.
  await walk('y', 1.5);
  await walk('x', 3.5);
  await center('x', 3.5);
  await center('y', 1.5);
  await a.keyboard.press('Space');
  await until(
    () => observer.state.gameState.bombs.some((b) => b.owner === first.id),
    'upgrade excavation bomb',
  );
  const excavation = observer.state.gameState.bombs.find((b) => b.owner === first.id);
  console.log('Excavation bomb', JSON.stringify(excavation));
  assert.deepEqual([excavation.x, excavation.y], [3, 1], 'excavation opens the escape corridor');
  await walk('x', 1.5);
  await walk('y', 2.5);
  await until(
    () =>
      observer.state.gameState.powerups.some((item) => item.cell === 19 && item.type === 'bomb'),
    'hidden bomb upgrade reveals after flames',
    7000,
  );
  assert.equal(
    observer.state.gameState.board[33],
    0,
    'excavation clears tile 3,2 before the chain escape',
  );
  await walk('y', 1.5);
  await walk('x', 4.5);
  await until(() => actorState().capacity === 2, 'server confirms collected bomb slot');
  // Feedback-controlled walking can overshoot by a network round trip. Settle
  // before the fuse starts, then use ordered, timed keyboard commands at the
  // authoritative base speed, rather than chasing delayed position snapshots.
  await center('x', 4.5);
  await center('y', 1.5);
  async function timedMove(key, ms) {
    await a.keyboard.down(key);
    await a.waitForTimeout(ms);
    await a.keyboard.up(key);
  }
  await a.keyboard.press('Space');
  await timedMove('ArrowLeft', 650);
  await a.keyboard.press('Space');
  await timedMove('ArrowRight', 380);
  await timedMove('ArrowDown', 600);
  await until(
    () => observer.state.gameState.bombs.filter((b) => b.owner === first.id).length === 2,
    'upgraded capacity allows two simultaneous bombs',
  );
  const chain = observer.state.gameState.bombs
    .filter((b) => b.owner === first.id)
    .map((b) => ({ id: b.id, x: b.x, y: b.y, range: b.range, deadline: b.deadline }));
  console.log(
    'Authoritative chain setup',
    JSON.stringify({ chain, actor: actorState(), tick: observer.state.gameState.tick }),
  );
  assert.notEqual(
    chain[0].deadline,
    chain[1].deadline,
    'the later bomb has a different natural fuse deadline',
  );
  assert.deepEqual(
    chain.map((b) => [b.x, b.y]).sort((a, b) => a[0] - b[0]),
    [
      [2, 1],
      [4, 1],
    ],
    'keyboard route places bombs within chain range',
  );
  await until(
    () => chain.every((b) => observer.state.gameState.blasts.some((blast) => blast.id === b.id)),
    'earlier bomb chains the later bomb',
    5000,
  );
  const chainBlasts = observer.state.gameState.blasts.filter((blast) =>
    chain.some((b) => b.id === blast.id),
  );
  assert.equal(
    chainBlasts[0].until,
    chainBlasts[1].until,
    'chain explosions resolve on the same authoritative tick',
  );
  assert.ok(actorState().alive, 'escaping keyboard-controlled player survives both blasts');
  await until(() => observer.state.gameState.blasts.length === 0, 'chain flames clear', 3000);
  observer.send('input', { seq: 1, x: 0, y: 0, bomb: true });
  fourth.send('input', { seq: 1, x: 0, y: 0, bomb: true });
  await a.keyboard.press('Space');
  await until(
    () => observer.state.gameState.bombs.some((b) => b.owner === first.id),
    'server confirms bomb placement',
  );
  await until(() => observer.state.gameState.phase === 'results', 'first round resolves');
  const firstWinner = observer.state.gameState.people.find(
    (p) => p.id === observer.state.gameState.winner,
  );
  for (const p of [a, b])
    await p
      .getByRole('heading', {
        name: `${['Mint', 'Amber', 'Violet', 'Rose'][firstWinner.color]} wins!`,
      })
      .waitFor({ timeout: 8000 });
  await a.screenshot({ path: 'bomberman-clone/documentation/multiplayer-round.png' });
  await a.evaluate(() => window.restoreTransport());
  await a.waitForTimeout(300);
  // Real network loss, then recovery before the reserved-seat deadline.
  await a.context().setOffline(true);
  await a.waitForTimeout(1200);
  await a.context().setOffline(false);
  await a.getByText(/s · ALIVE/).waitFor({ timeout: 15000 });
  assert.ok(
    observer.state.gameState.people.some((p) => p.id === first.id),
    'recovery preserved the original identity',
  );
  await until(
    () => observer.state.gameState.people.some((p) => p.score === 1),
    'first round score is visible',
  );
  for (let round = 2; round <= 3; round++) {
    await until(
      () =>
        observer.state.gameState.phase === 'playing' && observer.state.gameState.round === round,
      `round ${round} advances automatically`,
      15000,
    );
    await a.keyboard.press('Space');
    observer.send('input', { seq: round, x: 0, y: 0, bomb: true });
    fourth.send('input', { seq: round, x: 0, y: 0, bomb: true });
    await until(
      () => observer.state.gameState.people.some((p) => p.score === round),
      `round ${round} has one common winner`,
      10000,
    );
  }
  const matchWinner = observer.state.gameState.people.find(
    (p) => p.id === observer.state.gameState.matchWinner,
  );
  for (const p of [a, b])
    await p
      .getByRole('heading', {
        name: `${['Mint', 'Amber', 'Violet', 'Rose'][matchWinner.color]} takes the match!`,
      })
      .waitFor();
  await a.screenshot({ path: 'bomberman-clone/documentation/multiplayer-match.png' });
  await a.getByRole('button', { name: 'Ready for rematch', exact: true }).click();
  await a.waitForTimeout(200);
  assert.equal(observer.state.gameState.phase, 'matchResults', 'one vote cannot restart the match');
  await b.getByRole('button', { name: 'Ready for rematch', exact: true }).click();
  observer.send('rematch');
  fourth.send('rematch');
  await until(
    () => observer.state.gameState.phase === 'playing' && observer.state.gameState.match === 2,
    'fresh rematch starts',
    15000,
  );
  assert.ok(observer.state.gameState.people.every((p) => p.score === 0));
  assert.ok(
    observer.state.gameState.players.every(
      (p) => p.capacity === 1 && p.range === 2 && p.speedLevel === 0,
    ),
  );
  fourth.disconnect();
  await a.waitForTimeout(200);
  const mobile = await page({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1.5,
    isMobile: true,
    hasTouch: true,
  });
  await mobile.getByLabel('Room code').fill(code);
  await mobile.getByRole('button', { name: 'Join room', exact: true }).click();
  await mobile.getByText(/s · ALIVE/).waitFor({ timeout: 30000 });
  await checkLayout(mobile);
  await mobile.screenshot({ path: 'bomberman-clone/documentation/multiplayer-mobile.png' });
  await mobile.setViewportSize({ width: 844, height: 390 });
  await checkLayout(mobile);
  await mobile.setViewportSize({ width: 390, height: 844 });
  await checkLayout(mobile);
  const extra = await page();
  await extra.getByLabel('Room code').fill(code);
  await extra.getByRole('button', { name: 'Join room', exact: true }).click();
  await extra
    .getByText('This room is full. Try again when someone leaves.')
    .waitFor({ timeout: 20000 });
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    unknownCode = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join('');
  await extra.getByLabel('Room code').fill(unknownCode);
  await extra.getByRole('button', { name: 'Join room', exact: true }).click();
  await extra
    .getByText('Room expired or code not found. Create a new room.')
    .waitFor({ timeout: 20000 });
  await extra.getByRole('button', { name: 'Create room', exact: true }).click();
  const isolated = extra.getByRole('heading', { name: /^Room [A-Z0-9]{6}$/ });
  await isolated.waitFor({ timeout: 20000 });
  assert.notEqual(await isolated.innerText(), `Room ${code}`, 'new room is isolated');
  const touchCode = (await isolated.innerText()).split(' ')[1];
  await mobile.getByRole('button', { name: 'Local practice', exact: true }).click();
  await mobile.getByRole('button', { name: 'Play online', exact: true }).click();
  await mobile.getByLabel('Room code').fill(touchCode);
  await mobile.getByRole('button', { name: 'Join room', exact: true }).click();
  await mobile.getByRole('heading', { name: `Room ${touchCode}` }).waitFor();
  await extra.getByRole('button', { name: 'Ready up', exact: true }).click();
  await mobile.getByRole('button', { name: 'Ready up', exact: true }).click();
  await mobile.getByText(/s · ALIVE/).waitFor({ timeout: 10000 });
  await checkLayout(mobile);
  touchObserver = new MultiplayerClient(
    process.env.BACKEND_URL || 'https://rmc-colyseus-multiplayer-server.vercel.app',
    'bomberman',
    { code: touchCode },
  );
  void touchObserver.connect();
  await until(() => touchObserver.state.status === 'connected', 'touch verification observer');
  const mobileId = touchObserver.state.gameState.people.find((p) => p.number === 1).id;
  const panelBox = await mobile.locator('.game-panel').boundingBox(),
    arenaBox = await mobile.locator('.arena-square').boundingBox();
  const touchSession = await mobile.context().newCDPSession(mobile),
    startX = touchObserver.state.gameState.players.find((p) => p.id === mobileId).x;
  const panelX = panelBox.x + panelBox.width * 0.5,
    panelY = panelBox.y + panelBox.height * 0.55,
    arenaX = arenaBox.x + arenaBox.width * 0.5,
    arenaY = arenaBox.y + arenaBox.height * 0.5;
  await touchSession.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { id: 11, x: panelX, y: panelY },
      { id: 12, x: arenaX, y: arenaY },
    ],
  });
  await touchSession.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { id: 11, x: panelX - 50, y: panelY },
      { id: 12, x: arenaX, y: arenaY },
    ],
  });
  await until(
    () =>
      touchObserver.state.gameState.bombs.some((b) => b.owner === mobileId) &&
      touchObserver.state.gameState.players.find((p) => p.id === mobileId).x < startX - 0.15,
    'simultaneous touch movement and bomb',
  );
  await touchSession.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await mobile.waitForTimeout(400);
  const stoppedTouch = touchObserver.state.gameState.players.find((p) => p.id === mobileId).x;
  await mobile.waitForTimeout(250);
  assert.ok(
    Math.abs(
      touchObserver.state.gameState.players.find((p) => p.id === mobileId).x - stoppedTouch,
    ) < 0.01,
    'touch cancellation clears held movement',
  );
  await mobile.screenshot({ path: 'bomberman-clone/documentation/multiplayer-mobile.png' });
  expiryProbe = new MultiplayerClient(
    process.env.BACKEND_URL || 'https://rmc-colyseus-multiplayer-server.vercel.app',
    'bomberman',
    { create: true },
  );
  void expiryProbe.connect();
  await until(() => expiryProbe.state.status === 'connected', 'create expiry probe');
  const expiredCode = expiryProbe.state.code;
  expiryProbe.disconnect();
  await extra.waitForTimeout(16500);
  await extra.getByRole('button', { name: 'Local practice', exact: true }).click();
  await extra.getByRole('button', { name: 'Play online', exact: true }).click();
  await extra.getByLabel('Room code').fill(expiredCode);
  await extra.getByRole('button', { name: 'Join room', exact: true }).click();
  await extra
    .getByText('Room expired or code not found. Create a new room.')
    .waitFor({ timeout: 20000 });
  await extra.getByRole('button', { name: 'Create room', exact: true }).click();
  await extra.getByRole('heading', { name: /^Room [A-Z0-9]{6}$/ }).waitFor({ timeout: 20000 });
  assert.deepEqual(errors, []);
  console.log(
    'PASS: two-browser complete first-to-three and fresh rematch, immediate movement with 180–240ms latency/jitter, converged remote motion, legal keyboard pickup and chain, common winner, offline recovery, simultaneous mobile movement/bomb and cancellation, full-room/invalid-code/isolation and no page errors.',
  );
} catch (error) {
  console.error('Original browser failure:', error);
  for (let n = 0; n < pages.length; n++) {
    try {
      console.error(
        `Browser ${n + 1}:`,
        (await pages[n].locator('body').innerText({ timeout: 1000 })).slice(0, 900),
      );
      await pages[n].screenshot({ path: `.tmp/online-failure-${n + 1}.png`, timeout: 3000 });
    } catch (diagnostic) {
      console.error(`Browser ${n + 1} diagnostic unavailable:`, diagnostic.message);
    }
  }
  throw error;
} finally {
  observer?.disconnect();
  fourth?.disconnect();
  touchObserver?.disconnect();
  expiryProbe?.disconnect();
  await browser.close();
}
