import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Bomberman accepts four-character room codes and auto-joins invite links', async () => {
  const [app, online] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/Online.jsx', import.meta.url), 'utf8'),
  ]);
  assert.match(app, /params\.get\('mode'\)==='online'\|\|params\.has\('room'\)/);
  assert.match(online, /slice\(0,4\)/);
  assert.match(online, /maxLength=\{4\}/);
  assert.match(online, /code\.length!==4/);
  assert.match(online, /connect\(\{create:true,\.\.\.\(code\.length===4\?\{code\}:\{\}\)\}\)/);
  assert.match(online, /searchParams\.set\('mode','online'\)/);
  assert.match(online, /searchParams\.set\('room',g\.code\)/);
  assert.match(online, /connect\(\{code:roomCode\}\)/);
});
