export const PARTICLE_PROFILES = Object.freeze({
  smoke: Object.freeze({
    name: 'SmokePoff',
    frames: 9,
    frameDuration: 80,
    loop: false,
    atlasStart: 0,
    startDelayFrames: 4,
  }),
  fire: Object.freeze({
    name: 'FirePlume',
    frames: 17,
    frameDuration: 90,
    loop: false,
    atlasStart: 9,
  }),
});

export function createParticleInstance(type, cell, startedAt = 0, metadata = {}) {
  const profile = PARTICLE_PROFILES[type];
  if (!profile || !Number.isInteger(cell) || !Number.isFinite(startedAt)) return null;
  return { type, cell, startedAt, ...metadata, frame: 0 };
}

export function advanceParticleInstance(instance, now) {
  const profile = PARTICLE_PROFILES[instance?.type];
  if (!profile || !Number.isFinite(now)) return { done: true, instance };
  if (now < instance.startedAt) return { done: false, active: false, instance };
  const elapsed = Math.max(0, now - instance.startedAt);
  if (!profile.loop && elapsed >= profile.frames * profile.frameDuration)
    return { done: true, instance };
  const frame = Math.min(
    profile.frames - 1,
    Math.floor(
      (profile.loop ? elapsed % (profile.frames * profile.frameDuration) : elapsed) /
        profile.frameDuration,
    ),
  );
  return { done: false, active: true, instance: { ...instance, frame } };
}
