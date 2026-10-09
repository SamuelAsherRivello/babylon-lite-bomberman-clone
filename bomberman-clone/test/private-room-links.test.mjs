import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createRoomInvite } from '../src/game/invite-link.js';

test('Bomberman accepts six-character room codes and auto-joins invite links', async () => {
  const [app, online] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/Online.jsx', import.meta.url), 'utf8'),
  ]);
  assert.match(app, /params\.has\('room'\)\s*\|\|\s*params\.get\('mode'\)\s*!==\s*'offline'/);
  assert.match(online, /slice\(0,\s*6\)/);
  assert.match(online, /maxLength=\{6\}/);
  assert.match(online, /code\.length\s*!==\s*6/);
  assert.match(
    online,
    /connect\(\{\s*create:\s*true,\s*\.\.\.\(code\.length\s*===\s*6\s*\?\s*\{\s*code\s*\}\s*:\s*\{\s*\}\)\s*\}\)/s,
  );
  assert.match(
    online,
    /createRoomInvite\(window\.location\.href,\s*import\.meta\.env\.BASE_URL,\s*g\.code\)/,
  );
  assert.match(online, /connect\(\{\s*code:\s*roomCode\s*\}\)/);
});

test('room invite uses the current host and the app base in Vite and on Pages', () => {
  const base = '/babylon-lite-bomberman-clone/';
  assert.equal(
    createRoomInvite('http://127.0.0.1:5173/babylon-lite-bomberman-clone/?mute=1', base, 'ABC123'),
    'http://127.0.0.1:5173/babylon-lite-bomberman-clone/?mode=online&room=ABC123',
  );
  assert.equal(
    createRoomInvite('https://example.github.io/babylon-lite-bomberman-clone/', base, 'ABC123'),
    'https://example.github.io/babylon-lite-bomberman-clone/?mode=online&room=ABC123',
  );
  assert.equal(
    createRoomInvite(
      'https://example.github.io/babylon-lite-bomberman-clone/?server=https%3A%2F%2Ftest.example',
      base,
      'ABC123',
    ),
    'https://example.github.io/babylon-lite-bomberman-clone/?mode=online&room=ABC123&server=https%3A%2F%2Ftest.example',
  );
  assert.equal(
    createRoomInvite(
      'http://127.0.0.1:5173/babylon-lite-bomberman-clone/?server=VITE_LOCAL&serverTest=true',
      base,
      'ABC123',
    ),
    'http://127.0.0.1:5173/babylon-lite-bomberman-clone/?mode=online&room=ABC123&server=VITE_LOCAL&serverTest=true',
  );
});
