import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import config from '../../vite.config.js';
import { presentation } from '../src/content/renderer.js';
test('project identity, layout and production subpath', async () => {
  assert.equal(config.base, '/babylon-lite-bomberman-clone/');
  assert.equal(config.root, 'bomberman-clone');
  const page = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(page, /<title>Bomberman Clone<\/title>/);
  const [app, nav] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/ui/TopNav.jsx', import.meta.url), 'utf8'),
  ]);
  for (const corner of [
    'corner_top_left',
    'corner_top_right',
    'corner_bottom_left',
    'corner_bottom_right',
  ])
    assert.ok(app.includes(corner) || nav.includes(corner));
  assert.ok(nav.includes('SamuelAsherRivello/babylon-lite-bomberman-clone'));
  assert.ok(app.includes('versionText'));
});
test('pixel presentation uses integer grid-derived render dimensions for every map size', () => {
  const expected = [
    [15, 13, 32, 480, 416],
    [19, 15, 25, 475, 375],
    [23, 17, 20, 460, 340],
  ];
  for (const [columns, rows, tilePixels, renderWidth, renderHeight] of expected) {
    const map = presentation(480, 416, 1, { width: columns * 16, height: rows * 16 });
    assert.equal(map.tilePixels, tilePixels);
    assert.equal(map.renderWidth, renderWidth);
    assert.equal(map.renderHeight, renderHeight);
    assert.ok(Number.isInteger(map.renderWidth) && Number.isInteger(map.renderHeight));
    assert.ok(
      map.renderWidth <= 480 && map.renderHeight <= 416,
      'whole grid stays inside its slot',
    );
  }
  assert.equal(presentation(480, 416, 1.5).unit, 3);
});
