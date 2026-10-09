import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LOCAL_MULTIPLAYER_SERVER,
  LOCAL_TEST_MULTIPLAYER_SERVER,
  PUBLIC_MULTIPLAYER_SERVER,
  resolveMultiplayerServer,
} from '../src/game/server-url.js';
import { requireBrowserBackend } from './browser-backend.mjs';

test('development defaults to a local backend and production defaults to the public backend', () => {
  assert.deepEqual(resolveMultiplayerServer('', '', '', true), {
    url: LOCAL_MULTIPLAYER_SERVER,
  });
  assert.deepEqual(resolveMultiplayerServer('', '', '', false), {
    url: PUBLIC_MULTIPLAYER_SERVER,
  });
});

test('a URL server argument overrides build configuration without persisting to later visits', () => {
  assert.deepEqual(
    resolveMultiplayerServer(
      '?server=https%3A%2F%2Ftest.example',
      PUBLIC_MULTIPLAYER_SERVER,
      '',
      false,
    ),
    { url: 'https://test.example' },
  );
  assert.deepEqual(resolveMultiplayerServer('', PUBLIC_MULTIPLAYER_SERVER, '', false), {
    url: PUBLIC_MULTIPLAYER_SERVER,
  });
});

test('named server presets select local, live, and isolated local test backends', () => {
  assert.deepEqual(resolveMultiplayerServer('?server=VITE_LOCAL', '', '', false), {
    url: LOCAL_MULTIPLAYER_SERVER,
  });
  assert.deepEqual(resolveMultiplayerServer('?server=VERCEL_ONLINE', '', '', true), {
    url: PUBLIC_MULTIPLAYER_SERVER,
  });
  assert.deepEqual(resolveMultiplayerServer('?server=VITE_LOCAL&serverTest=true', '', '', true), {
    url: LOCAL_TEST_MULTIPLAYER_SERVER,
  });
  assert.deepEqual(resolveMultiplayerServer('?serverTest=true', '', '', true), {
    url: LOCAL_TEST_MULTIPLAYER_SERVER,
  });
});

test('Vercel test selection requires a configured test deployment', () => {
  assert.match(
    resolveMultiplayerServer('?server=VERCEL_ONLINE&serverTest=true', '', '', false).error,
    /not configured/,
  );
  assert.deepEqual(
    resolveMultiplayerServer(
      '?server=VERCEL_ONLINE&serverTest=true',
      '',
      '',
      false,
      'https://test.example',
    ),
    { url: 'https://test.example' },
  );
});

test('invalid server arguments fail closed instead of connecting to the default backend', () => {
  for (const query of [
    '?server=',
    '?server=javascript%3Aalert(1)',
    '?server=https%3A%2F%2Fu%3Ap%40test.example',
  ]) {
    const result = resolveMultiplayerServer(query, '', '', false);
    assert.equal(result.url, null);
    assert.match(result.error, /Invalid multiplayer server URL/);
  }
  assert.equal(
    resolveMultiplayerServer('?server=VERCEL_ONLINE&serverTest=yes', '', '', false).url,
    null,
  );
  assert.equal(
    resolveMultiplayerServer('?server=https%3A%2F%2Fexample.com&serverTest=true', '', '', false)
      .url,
    null,
  );
});

test('browser tests require an explicit backend and live opt-in', () => {
  assert.throws(() => requireBrowserBackend({}), /Set BACKEND_URL/);
  assert.throws(
    () => requireBrowserBackend({ BACKEND_URL: PUBLIC_MULTIPLAYER_SERVER }),
    /ALLOW_LIVE_TEST=1/,
  );
  assert.throws(
    () => requireBrowserBackend({ BACKEND_URL: LOCAL_MULTIPLAYER_SERVER }),
    /ALLOW_LIVE_TEST=1/,
  );
  assert.throws(
    () => requireBrowserBackend({ BACKEND_URL: PUBLIC_MULTIPLAYER_SERVER + '/rooms' }),
    /ALLOW_LIVE_TEST=1/,
  );
  assert.equal(
    requireBrowserBackend({ BACKEND_URL: PUBLIC_MULTIPLAYER_SERVER, ALLOW_LIVE_TEST: '1' }),
    PUBLIC_MULTIPLAYER_SERVER,
  );
  assert.equal(
    requireBrowserBackend({ BACKEND_URL: LOCAL_TEST_MULTIPLAYER_SERVER }),
    LOCAL_TEST_MULTIPLAYER_SERVER,
  );
});
