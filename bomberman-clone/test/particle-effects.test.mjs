import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PARTICLE_PROFILES,
  advanceParticleInstance,
  createParticleInstance,
} from '../src/content/systems/particle-effects-system.js';

test('SmokePoff and FirePlume each play once', () => {
  const smoke = createParticleInstance('smoke', 12, 0);
  assert.equal(PARTICLE_PROFILES.smoke.loop, false);
  assert.equal(PARTICLE_PROFILES.smoke.frames, 9);
  assert.equal(PARTICLE_PROFILES.smoke.startDelayFrames, 4);
  assert.equal(advanceParticleInstance(smoke, 9 * 80).done, true);
  const delayedFire = createParticleInstance('fire', 12, 9 * 80);
  assert.equal(advanceParticleInstance(delayedFire, 8 * 80).active, false);
  assert.equal(advanceParticleInstance(delayedFire, 9 * 80).active, true);

  const fire = createParticleInstance('fire', 12, 0);
  assert.equal(PARTICLE_PROFILES.fire.loop, false);
  assert.equal(advanceParticleInstance(fire, 17 * 90).done, true);
  assert.equal(advanceParticleInstance(fire, 16 * 90).instance.frame, 16);
});
