import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_BATTLE_OPTIONS,
  loadBattleOptions,
  saveBattleOptions,
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
