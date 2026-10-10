const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

export const clampProgress = (progress) => clamp(Number(progress) || 0);

export const linear = (progress) => clampProgress(progress);

export const easeInQuad = (progress) => {
  const value = clampProgress(progress);
  return value * value;
};

export const easeOutQuad = (progress) => {
  const value = clampProgress(progress);
  return 1 - (1 - value) * (1 - value);
};

export const easeInOutQuad = (progress) => {
  const value = clampProgress(progress);
  return value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2;
};

export const easeOutCubic = (progress) => {
  const value = clampProgress(progress);
  return 1 - (1 - value) ** 3;
};

export const interpolate = (from, to, progress, easing = linear) => {
  const eased = clampProgress(easing(progress));
  return from + (to - from) * eased;
};

export const interpolateVector = (from, to, progress, easing = linear) =>
  from.map((value, index) => interpolate(value, to[index], progress, easing));

export function resolveAnimation({
  startedAt,
  now,
  duration,
  frameCount = 1,
  frameDuration,
  loop = false,
}) {
  const safeDuration = Math.max(0, Number(duration) || 0);
  const rawElapsed = Number(now) - Number(startedAt);
  const active = rawElapsed >= 0;
  const elapsed = Math.max(0, rawElapsed);
  const complete = active && !loop && elapsed >= safeDuration;
  const boundedElapsed =
    loop && safeDuration > 0 ? elapsed % safeDuration : Math.min(elapsed, safeDuration);
  const progress = safeDuration === 0 ? 1 : boundedElapsed / safeDuration;
  const safeFrameDuration = Math.max(1, Number(frameDuration) || safeDuration || 1);
  const frame = loop
    ? Math.floor(elapsed / safeFrameDuration) % frameCount
    : Math.min(frameCount - 1, Math.floor(elapsed / safeFrameDuration));

  return Object.freeze({
    active,
    complete,
    elapsed,
    frame,
    progress: clampProgress(progress),
  });
}
