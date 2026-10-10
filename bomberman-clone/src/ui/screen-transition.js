import { easeInQuad, easeOutQuad, clampProgress } from '../content/systems/animation-system.js';

export const SCREEN_TRANSITION = Object.freeze({
  close: 0.5,
  hold: 0.2,
  open: 0.5,
  total: 1.2,
});

export const SCREEN_TRANSITION_TYPES = Object.freeze({
  DOOR: 'screen-door',
});

const clone = (value) => structuredClone(value);

export function createScreenTransition({
  parent = 'game-world',
  type = SCREEN_TRANSITION_TYPES.DOOR,
} = {}) {
  let activeKey = null;
  let phase = 'idle';
  let startedAt = 0;
  let openingAt = 0;
  let previous = null;
  let next = null;
  let displayed = null;
  let middleNotified = false;
  let continueRequested = false;
  let callbacks = {};
  let transitionState = Object.freeze({
    parent,
    type,
    phase: 'idle',
    progress: 1,
    easedProgress: 1,
  });

  const publish = (progress, easedProgress) => {
    transitionState = Object.freeze({
      parent,
      type,
      phase,
      progress: clampProgress(progress),
      easedProgress: clampProgress(easedProgress),
    });
    callbacks.onUpdate?.(transitionState);
  };

  const notifyPhase = (nextPhase, progress, easedProgress) => {
    phase = nextPhase;
    callbacks.onPhase?.(phase);
    publish(progress, easedProgress);
  };

  const start = (key, oldState, now, nextCallbacks = {}) => {
    activeKey = key;
    startedAt = now;
    openingAt = 0;
    previous = clone(oldState);
    next = oldState;
    middleNotified = false;
    continueRequested = false;
    callbacks = nextCallbacks;
    notifyPhase('closing', 0, 0);
  };

  return {
    ensure(key, state, now, nextCallbacks) {
      if (!state) return;
      if (activeKey === null || key !== activeKey)
        start(key, displayed ?? state, now, nextCallbacks);
      next = state;
    },

    tick(now) {
      if (phase === 'closing') {
        const progress = clampProgress((now - startedAt) / SCREEN_TRANSITION.close);
        publish(progress, easeOutQuad(progress));
        if (progress >= 1) {
          notifyPhase('closed', 1, 1);
          if (!middleNotified) {
            middleNotified = true;
            const replacement = callbacks.onSwap?.();
            if (replacement) next = replacement;
            callbacks.onMiddle?.();
          }
        }
      }
      if (
        phase === 'closed' &&
        continueRequested &&
        now - startedAt >= SCREEN_TRANSITION.close + SCREEN_TRANSITION.hold
      ) {
        openingAt = now;
        notifyPhase('opening', 0, 0);
      }
      if (phase === 'opening') {
        const progress = clampProgress((now - openingAt) / SCREEN_TRANSITION.open);
        publish(progress, easeInQuad(progress));
        if (progress >= 1) {
          notifyPhase('idle', 1, 1);
          displayed = next;
          callbacks.onDone?.();
          callbacks = {};
        }
      }
    },

    continue() {
      if (phase !== 'closed') return false;
      continueRequested = true;
      return true;
    },

    present(state) {
      if (state) {
        next = state;
        if (phase === 'idle') displayed = state;
      }
      return phase === 'closing' || (phase === 'closed' && !continueRequested) ? previous : next;
    },

    isBlocking() {
      return phase !== 'idle';
    },

    get phase() {
      return phase;
    },

    get state() {
      return transitionState;
    },

    reset() {
      activeKey = null;
      phase = 'idle';
      startedAt = 0;
      openingAt = 0;
      previous = null;
      next = null;
      displayed = null;
      middleNotified = false;
      continueRequested = false;
      callbacks = {};
      transitionState = Object.freeze({
        parent,
        type,
        phase: 'idle',
        progress: 1,
        easedProgress: 1,
      });
    },
  };
}
