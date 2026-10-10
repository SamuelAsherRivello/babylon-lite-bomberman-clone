import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-webgpu'],
});
const base = new URL(process.env.GAME_URL || 'http://127.0.0.1:5180/babylon-lite-bomberman-clone/');
base.searchParams.set('mute', '1');
const github = 'https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone';

async function open(context, query = {}) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const url = new URL(base);
  url.searchParams.delete('mode');
  url.searchParams.delete('room');
  for (const [name, value] of Object.entries(query)) url.searchParams.set(name, value);
  await page.goto(url.href);
  await page.getByRole('button', { name: /^Mode: (Online|Offline)$/ }).waitFor();
  return { page, errors };
}

async function inspect(page, aspect, label) {
  await page.mouse.move(0, 0);
  const layout = await page.evaluate(() => {
    const bounds = (element) => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    };
    const element = (selector) => document.querySelector(selector);
    const viewport = bounds(element('#viewport'));
    const arena = bounds(element('.arena-square'));
    const arenaStage = element('.arena-stage');
    const layout = element('.game-layout');
    const playerLabels = [...document.querySelectorAll('.player-label')].map((node) => ({
      text: node.textContent,
      tag: node.tagName,
      bounds: bounds(node),
      imageSize: [
        node.querySelector('img')?.naturalWidth,
        node.querySelector('img')?.naturalHeight,
      ],
      background: getComputedStyle(node).backgroundColor,
      border: getComputedStyle(node).borderColor,
      local: node.classList.contains('player-label-local'),
    }));
    const settingsButton = element('.corner_bottom_left button');
    const panel = bounds(element('.game-panel'));
    const section = element('.game-panel');
    const content = element('.panel-content');
    const nav = element('.corner_top_right');
    const controls = [...nav.children].map((node) => ({
      label: node.getAttribute('aria-label'),
      visibleText: node.innerText.trim(),
      bounds: bounds(node),
      display: getComputedStyle(node).display,
      background: getComputedStyle(node).backgroundColor,
      border: getComputedStyle(node).borderColor,
    }));
    const grid = getComputedStyle(layout);
    const coarse = matchMedia('(pointer: coarse)').matches;
    return {
      viewport,
      arena,
      arenaSlot: bounds(element('.arena-slot')),
      arenaStage: {
        bounds: bounds(arenaStage),
        width: getComputedStyle(arenaStage).width,
        height: getComputedStyle(arenaStage).height,
        tilePixels: getComputedStyle(arenaStage).getPropertyValue('--tile-pixels'),
      },
      layout: bounds(layout),
      map: {
        columns: Number(arenaStage.style.getPropertyValue('--board-columns')),
        rows: Number(arenaStage.style.getPropertyValue('--board-rows')),
      },
      gap: Number.parseFloat(grid.columnGap),
      panelMinimum: coarse
        ? Math.min(290, viewport.width * 0.6)
        : Math.min(250, viewport.width * 0.45),
      playerLabels,
      settingsStyle: {
        background: getComputedStyle(settingsButton).backgroundColor,
        border: getComputedStyle(settingsButton).borderColor,
      },
      panel,
      header: bounds(element('.panel-header')),
      title: bounds(element('.panel-header h1')),
      navigation: bounds(nav),
      eyebrow: element('.panel-header .eyebrow') !== null,
      controls,
      columns: grid.gridTemplateColumns.split(' ').length,
      rows: grid.gridTemplateRows.split(' ').length,
      panelFits:
        section.scrollHeight <= section.clientHeight + 1 &&
        content.scrollHeight <= content.clientHeight + 1,
      sizes: {
        section: [section.clientHeight, section.scrollHeight],
        content: [content.clientHeight, content.scrollHeight],
        children: [...content.children].map((node) => [
          node.className,
          node.clientHeight,
          node.scrollHeight,
          [...node.children].map((child) => [
            child.className,
            child.clientHeight,
            child.scrollHeight,
          ]),
        ]),
      },
      corners: [...document.querySelectorAll('#ui_layer .corner')].every((node) => {
        const b = bounds(node);
        return (
          b.x >= viewport.x - 1 &&
          b.right <= viewport.right + 1 &&
          b.y >= viewport.y - 1 &&
          b.bottom <= viewport.bottom + 1
        );
      }),
      canvas: bounds(element('.arena-square canvas')),
      boardAspect:
        Number(arenaStage.style.getPropertyValue('--board-columns')) /
        Number(arenaStage.style.getPropertyValue('--board-rows')),
      debugOutlines: {
        viewport: getComputedStyle(element('#viewport')).outlineStyle,
        arena: getComputedStyle(element('.arena-square'), '::after').borderStyle,
      },
      documentFits:
        document.documentElement.scrollHeight <= document.documentElement.clientHeight + 1,
      github: nav.querySelector('a')?.href,
    };
  });
  const targetRatio = aspect === 'landscape' ? 16 / 9 : 9 / 16;
  assert.ok(
    Math.abs(layout.viewport.width / layout.viewport.height - targetRatio) < 0.001,
    `${label}: selected ${aspect} ratio (${JSON.stringify(layout)})`,
  );
  if (aspect === 'landscape') {
    assert.equal(layout.columns, 2, `${label}: arena and panel are side by side`);
    assert.ok(layout.arena.right <= layout.panel.x + 1, `${label}: arena is left of panel`);
    const maxArenaWidth = Math.min(
      layout.layout.height * layout.boardAspect,
      layout.layout.width - layout.gap - layout.panelMinimum,
    );
    const expectedArenaWidth = Math.floor(maxArenaWidth / layout.map.columns) * layout.map.columns;
    assert.ok(
      Math.abs(layout.arena.width - expectedArenaWidth) <= 2,
      `${label}: arena takes the largest board-aspect region while leaving usable menu width (${JSON.stringify(layout)})`,
    );
  } else {
    assert.equal(layout.rows, 2, `${label}: arena and panel are stacked`);
    assert.ok(
      layout.arena.bottom <= layout.panel.y + 1,
      `${label}: arena is above panel (${JSON.stringify(layout)})`,
    );
    assert.ok(layout.panel.height >= 282 - 1, `${label}: menu retains the compact panel minimum`);
  }
  assert.ok(
    Math.abs(layout.arena.width / layout.arena.height - layout.boardAspect) <= 0.01,
    `${label}: arena preserves the active board aspect`,
  );
  assert.ok(layout.panelFits, `${label}: panel fits without scrolling (${JSON.stringify(layout)})`);
  assert.ok(layout.documentFits, `${label}: document does not scroll`);
  assert.equal(
    layout.debugOutlines.viewport,
    'none',
    `${label}: viewport debug outline is removed`,
  );
  assert.equal(layout.debugOutlines.arena, 'none', `${label}: arena debug outline is removed`);
  assert.ok(layout.corners, `${label}: all four corners fit in viewport`);
  assert.equal(layout.eyebrow, false, `${label}: header eyebrow is removed`);
  assert.ok(
    layout.title.right <= layout.navigation.x + 1 || layout.title.bottom <= layout.navigation.y + 1,
    `${label}: title and controls do not overlap (${JSON.stringify(layout)})`,
  );
  assert.ok(
    layout.title.x >= layout.header.x - 1 &&
      layout.navigation.right <= layout.header.right + 1 &&
      layout.navigation.bottom <= layout.header.bottom + 1,
    `${label}: header fits the menu`,
  );
  assert.ok(layout.canvas.width > 0 && layout.canvas.height > 0, `${label}: canvas is visible`);
  assert.equal(layout.playerLabels.length, 4, `${label}: four player labels`);
  layout.playerLabels.forEach((player, index) => {
    assert.match(player.text, new RegExp(`^${index + 1} .+ \\(Human|CPU|Open\\)$`));
    assert.equal(player.tag, 'DIV', `${label}: player label is not a button`);
    assert.deepEqual(player.imageSize, [16, 16], `${label}: original player sprite is shown`);
    assert.equal(player.background, layout.settingsStyle.background);
    assert.equal(player.border, player.local ? 'rgb(240, 217, 162)' : layout.settingsStyle.border);
  });
  const [topLeft, topRight, bottomLeft, bottomRight] = layout.playerLabels.map((p) => p.bounds);
  const tilePixels = Math.floor(layout.arena.width / layout.map.columns);
  const outerLeft = layout.arena.x;
  const outerRight = layout.arena.right;
  const firstOuterRow = layout.arena.y;
  const lastOuterRow = layout.arena.bottom - tilePixels;
  for (const player of [topLeft, topRight]) {
    assert.ok(
      Math.abs(player.y - (firstOuterRow + tilePixels * 0.176)) <= 2 &&
        player.height <= tilePixels * 0.648 + 1,
      `${label}: top player label is 64.8% tall and centered in the outer corner row`,
    );
  }
  for (const player of [bottomLeft, bottomRight]) {
    assert.ok(
      Math.abs(player.y - (lastOuterRow + tilePixels * 0.176)) <= 2 &&
        player.height <= tilePixels * 0.648 + 1,
      `${label}: bottom player label is 64.8% tall and centered in the outer corner row`,
    );
  }
  assert.ok(
    Math.abs(topLeft.x - (outerLeft + 8)) <= 2,
    `${label}: top-left label has the requested 8px left margin`,
  );
  assert.ok(
    Math.abs(topRight.right - (outerRight - 8)) <= 2,
    `${label}: top-right label has the requested 8px right margin`,
  );
  assert.ok(
    Math.abs(bottomLeft.x - (outerLeft + 8)) <= 2,
    `${label}: bottom-left label has the requested 8px left margin`,
  );
  assert.ok(
    Math.abs(bottomRight.right - (outerRight - 8)) <= 2,
    `${label}: bottom-right label has the requested 8px right margin`,
  );
  assert.ok(topLeft.x < topRight.x && bottomLeft.x < bottomRight.x);
  for (const [name, player] of layout.playerLabels.map((entry) => [entry.text, entry.bounds])) {
    assert.ok(
      player.x >= layout.arena.x - 1 &&
        player.right <= layout.arena.right + 1 &&
        player.y >= layout.arena.y - 1 &&
        player.bottom <= layout.arena.bottom + 1,
      `${label}: ${name} remains inside the gameplay area`,
    );
  }
  assert.ok(
    layout.controls.length >= 1 && layout.controls.length <= 2,
    `${label}: compact navigation controls`,
  );
  if (layout.controls.length === 2) {
    assert.match(layout.controls[0].label, /^Mode: Online$/);
    assert.equal(layout.controls[0].visibleText, layout.controls[0].label);
  }
  assert.equal(layout.controls.at(-1).label, 'GitHub');
  assert.equal(layout.controls.at(-1).visibleText, 'GitHub ↗');
  assert.equal(layout.github, github);
  for (const control of layout.controls) {
    assert.notEqual(control.display, 'none', `${label}: ${control.label} remains visible`);
    assert.ok(
      control.bounds.x >= layout.viewport.x - 1 &&
        control.bounds.right <= layout.viewport.right + 1 &&
        control.bounds.y >= layout.viewport.y - 1 &&
        control.bounds.bottom <= layout.viewport.bottom + 1,
      `${label}: ${control.label} stays inside viewport (${JSON.stringify(layout)})`,
    );
  }
  const navigationStyle =
    layout.controls.find((control) => control.label?.startsWith('Mode')) ?? layout.controls.at(-1);
  assert.equal(layout.controls.at(-1).background, navigationStyle.background);
  assert.equal(layout.controls.at(-1).border, navigationStyle.border);
}

async function inspectSettings(page, label) {
  const result = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
    const panel = rect('.game-panel');
    const overlay = rect('.settings-overlay');
    const content = rect('.settings-content');
    return {
      sameBounds: ['x', 'y', 'width', 'height'].every(
        (key) => Math.abs(panel[key] - overlay[key]) <= 2,
      ),
      centered:
        Math.abs(content.x + content.width / 2 - (panel.x + panel.width / 2)) <= 1 &&
        Math.abs(content.y + content.height / 2 - (panel.y + panel.height / 2)) <= 1,
    };
  });
  assert.ok(result.sameBounds && result.centered, `${label}: settings overlay fits panel`);
}

try {
  const pc = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const desktop = await open(pc);
  await desktop.page.getByRole('button', { name: 'Mode: Online' }).waitFor();
  await inspect(desktop.page, 'landscape', 'desktop default online');
  await desktop.page.getByRole('button', { name: 'Mode: Online' }).click();
  await desktop.page.getByText('Starting Babylon Lite…').waitFor({ state: 'hidden' });
  await inspect(desktop.page, 'landscape', 'desktop practice');
  await desktop.page.getByRole('combobox', { name: 'Map size' }).selectOption('HIGH');
  await inspect(desktop.page, 'landscape', 'desktop practice high map');
  await desktop.page.getByRole('combobox', { name: 'Map size' }).selectOption('MED');
  await inspect(desktop.page, 'landscape', 'desktop practice medium map');
  await desktop.page.getByRole('button', { name: 'Settings' }).click();
  await desktop.page.getByRole('button', { name: 'Aspect: Landscape' }).click();
  await desktop.page.getByRole('button', { name: 'Back' }).click();
  await inspect(desktop.page, 'portrait', 'desktop portrait practice');
  await desktop.page.getByRole('button', { name: 'Mode: Offline' }).click();
  await inspect(desktop.page, 'portrait', 'desktop portrait online');
  await desktop.page.getByRole('button', { name: 'Mode: Online' }).click();
  await desktop.page.getByRole('button', { name: 'Settings' }).click();
  await inspectSettings(desktop.page, 'desktop portrait practice');
  await desktop.page.getByRole('button', { name: 'Fullscreen', exact: true }).click();
  await desktop.page.waitForFunction(() => Boolean(document.fullscreenElement));
  await inspect(desktop.page, 'portrait', 'desktop portrait fullscreen');
  await desktop.page.evaluate(() => document.exitFullscreen());
  await desktop.page.getByRole('button', { name: 'Back' }).click();
  await desktop.page.reload();
  await desktop.page.getByRole('button', { name: 'Mode: Online' }).waitFor();
  await inspect(desktop.page, 'landscape', 'desktop reload resets aspect');
  await desktop.page.setViewportSize({ width: 800, height: 1000 });
  await inspect(desktop.page, 'landscape', 'desktop narrow window');
  await desktop.page.close();

  for (const [query, expected] of [
    [{ mode: 'offline' }, 'Offline'],
    [{ mode: 'online' }, 'Online'],
    [{ mode: 'offline', room: 'BAD' }, 'Online'],
  ]) {
    const direct = await open(pc, query);
    await direct.page.getByRole('button', { name: `Mode: ${expected}` }).waitFor();
    await direct.page.close();
    assert.deepEqual(direct.errors, []);
  }
  await pc.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const phone = await open(mobile);
  await phone.page.getByRole('button', { name: 'Mode: Online' }).waitFor();
  await inspect(phone.page, 'portrait', 'mobile default online');
  await phone.page.getByRole('button', { name: 'Settings' }).click();
  await phone.page.getByRole('button', { name: 'Aspect: Portrait' }).click();
  await phone.page.getByRole('button', { name: 'Back' }).click();
  await inspect(phone.page, 'landscape', 'mobile landscape online');
  await phone.page.getByRole('button', { name: 'Mode: Online' }).click();
  await phone.page.getByText('Starting Babylon Lite…').waitFor({ state: 'hidden' });
  await inspect(phone.page, 'landscape', 'mobile landscape practice');
  await phone.page.setViewportSize({ width: 844, height: 390 });
  await inspect(phone.page, 'landscape', 'mobile landscape held sideways');
  await phone.page.getByRole('button', { name: 'Settings' }).click();
  await phone.page.getByRole('button', { name: 'Aspect: Landscape' }).click();
  await phone.page.getByRole('button', { name: 'Back' }).click();
  await inspect(phone.page, 'portrait', 'mobile portrait held sideways');
  await phone.page.getByRole('button', { name: 'Mode: Offline' }).click();
  await inspect(phone.page, 'portrait', 'mobile portrait online sideways');
  await phone.page.getByRole('button', { name: 'Settings' }).click();
  await inspectSettings(phone.page, 'mobile portrait online sideways');
  assert.deepEqual([...desktop.errors, ...phone.errors], []);
  await mobile.close();
  console.log(
    'PASS: mode entry, shared navigation, aspect switching, responsive panel and fullscreen.',
  );
} finally {
  await browser.close();
}
