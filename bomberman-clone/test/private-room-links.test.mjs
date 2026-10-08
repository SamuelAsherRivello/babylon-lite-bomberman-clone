import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createRoomInvite } from '../src/game/invite-link.js';

test('Bomberman accepts six-character room codes and auto-joins invite links', async () => {
  const [app, online] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/Online.jsx', import.meta.url), 'utf8'),
  ]);
  assert.match(app, /params\.get\('mode'\)==='online'\|\|params\.has\('room'\)/);
  assert.match(online, /slice\(0,6\)/);
  assert.match(online, /maxLength=\{6\}/);
  assert.match(online, /code\.length!==6/);
  assert.match(online, /connect\(\{create:true,\.\.\.\(code\.length===6\?\{code\}:\{\}\)\}\)/);
  assert.match(online, /createRoomInvite\(window\.location\.href,import\.meta\.env\.BASE_URL,g\.code\)/);
  assert.match(online, /connect\(\{code:roomCode\}\)/);
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
});
