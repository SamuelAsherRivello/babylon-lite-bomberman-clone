import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_BATTLE_OPTIONS,
  DEFAULT_AUDIO_PREFERENCES,
  loadAudioPreferences,
  loadAspect,
  loadBattleOptions,
  loadOnlineMode,
  loadExplosionStyle,
  saveBattleOptions,
  saveAudioPreferences,
  saveAspect,
  saveOnlineMode,
  saveExplosionStyle,
} from '../src/ui/preferences.js';

test('Chain Reaction defaults off and persists with battle options', () => {
  const saved = new Map();
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  try {
    assert.equal(DEFAULT_BATTLE_OPTIONS.chainReaction, false);
    assert.equal(loadBattleOptions().chainReaction, false);
    saveBattleOptions({ ...DEFAULT_BATTLE_OPTIONS, chainReaction: true });
    assert.equal(loadBattleOptions().chainReaction, true);
    saved.set('bomberman-battle-options', JSON.stringify({ map: 'HIGH' }));
    assert.equal(loadBattleOptions().chainReaction, false, 'older preferences use the default');
  } finally {
    globalThis.localStorage = previous;
  }
});

test('Explosion PFX preference is local, opt-in, and normalizes invalid values', () => {
  const saved = new Map();
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  try {
    assert.equal(loadExplosionStyle(), 'classic');
    saveExplosionStyle('pfx');
    assert.equal(loadExplosionStyle(), 'pfx');
    saveExplosionStyle('unexpected');
    assert.equal(loadExplosionStyle(), 'classic');
    saved.set('bomberman-explosion-style', 'invalid');
    assert.equal(loadExplosionStyle(), 'classic');
  } finally {
    globalThis.localStorage = previous;
  }
});

test('menu booleans and audio preferences persist across reloads', () => {
  const saved = new Map();
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  try {
    assert.equal(loadOnlineMode(), true);
    saveOnlineMode(false);
    assert.equal(loadOnlineMode(), false);
    saveOnlineMode(true);
    assert.equal(loadOnlineMode(), true);
    assert.deepEqual(loadAudioPreferences(), DEFAULT_AUDIO_PREFERENCES);
    saveAudioPreferences({ muted: true, volume: 0.7 });
    assert.deepEqual(loadAudioPreferences(), { muted: true, volume: 0.7 });
    saveAudioPreferences({ muted: 'yes', volume: 3 });
    assert.deepEqual(loadAudioPreferences(), { muted: true, volume: 0.25 });
  } finally {
    globalThis.localStorage = previous;
  }
});

test('aspect preference persists and rejects invalid values', () => {
  const saved = new Map();
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  try {
    assert.equal(loadAspect(), null);
    saveAspect('portrait');
    assert.equal(loadAspect(), 'portrait');
    saveAspect('landscape');
    assert.equal(loadAspect(), 'landscape');
    saved.set('bomberman-aspect', 'square');
    assert.equal(loadAspect(), null);
  } finally {
    globalThis.localStorage = previous;
  }
});
