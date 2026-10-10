import {
  enableErrorDecoding,
  createEngine,
  loadTexture2D,
  createGridSpriteAtlas,
  createSprite2DLayer,
  addSprite2D,
  updateSprite2D,
  createSpriteRenderer,
  registerSpriteRenderer,
  startEngine,
  disposeEngine,
  disposeSpriteRenderer,
  releaseTexture,
} from '@babylonjs/lite';
import { getInitializationMessage } from './initialization.js';
import {
  PARTICLE_PROFILES,
  advanceParticleInstance,
  createParticleInstance,
} from './systems/particle-effects-system.js';
import {
  PARTICLE_ATLAS_CELL,
  PARTICLE_ATLAS_COLUMNS,
  PARTICLE_ATLAS_ROWS,
  particleAtlasUrl,
} from './systems/particle-effects-art.js';
export const LOGICAL = { width: 240, height: 208 };
export function presentation(width, height, dpr = 1, logical = LOGICAL) {
  const columns = logical.width / 16,
    rows = logical.height / 16;
  const tilePixels = Math.max(1, Math.floor(Math.min(width / columns, height / rows)));
  const renderWidth = columns * tilePixels,
    renderHeight = rows * tilePixels;
  const scale = tilePixels / 16;
  return {
    scale,
    tilePixels,
    renderWidth,
    renderHeight,
    unit: scale * dpr,
    x: ((width - renderWidth) / 2) * dpr,
    y: ((height - renderHeight) / 2) * dpr,
  };
}
import { atlasUrl, ATLAS_COLUMNS, ATLAS_ROWS, ACTOR_FRAME } from './art.js';
const initializations = new WeakMap();
export function createGameRenderer(canvas) {
  const previous = initializations.get(canvas);
  const next = (previous || Promise.resolve())
    .catch(() => null)
    .then((old) => {
      old?.dispose();
      return initializeRenderer(canvas);
    });
  initializations.set(canvas, next);
  return next;
}
async function initializeRenderer(canvas) {
  enableErrorDecoding();
  let engine, texture, atlas, particleTexture, particleAtlas, renderer;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (renderer) disposeSpriteRenderer(renderer);
    if (texture) releaseTexture(texture);
    if (particleTexture) releaseTexture(particleTexture);
    if (engine) disposeEngine(engine);
  };
  try {
    if (!navigator.gpu)
      throw new Error('WebGPU is required. Use a compatible device and WebGPU-enabled browser.');
    engine = await createEngine(canvas, { msaaSamples: 1 });
    texture = await loadTexture2D(engine, atlasUrl(), {
      invertY: false,
      minFilter: 'nearest',
      magFilter: 'nearest',
      mipMaps: false,
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    });
    atlas = createGridSpriteAtlas(texture, {
      cellWidthPx: 16,
      cellHeightPx: 16,
      columns: ATLAS_COLUMNS,
      rows: ATLAS_ROWS,
      pivot: [0.5, 0.5],
    });
    const layer = createSprite2DLayer(atlas, { pivot: [0.5, 0.5] });
    const sprites = Array.from({ length: 1000 }, () =>
      addSprite2D(layer, { positionPx: [-100, -100], sizePx: [16, 16], frame: 0 }),
    );
    let particleLayer = null;
    let particleSprites = [];
    try {
      particleTexture = await loadTexture2D(engine, await particleAtlasUrl(), {
        invertY: false,
        minFilter: 'nearest',
        magFilter: 'nearest',
        mipMaps: false,
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
      });
      particleAtlas = createGridSpriteAtlas(particleTexture, {
        cellWidthPx: PARTICLE_ATLAS_CELL,
        cellHeightPx: PARTICLE_ATLAS_CELL,
        columns: PARTICLE_ATLAS_COLUMNS,
        rows: PARTICLE_ATLAS_ROWS,
        pivot: [0.5, 0.5],
      });
      particleLayer = createSprite2DLayer(particleAtlas, { pivot: [0.5, 0.5] });
      particleSprites = Array.from({ length: 800 }, () =>
        addSprite2D(particleLayer, {
          positionPx: [-100, -100],
          sizePx: [PARTICLE_ATLAS_CELL, PARTICLE_ATLAS_CELL],
          frame: 0,
        }),
      );
    } catch (error) {
      console.error('Optional PFX particle artwork failed to initialize:', error);
      if (particleTexture) {
        releaseTexture(particleTexture);
        particleTexture = null;
      }
    }
    renderer = createSpriteRenderer(engine, {
      layers: particleLayer ? [layer, particleLayer] : [layer],
      clear: true,
      clearValue: { r: 0.055, g: 0.075, b: 0.1, a: 1 },
    });
    registerSpriteRenderer(renderer);
    await startEngine(engine);
    const actors = new Map();
    const particles = new Map();
    const deathParticles = [];
    let round = null;
    return {
      dispose,
      draw(g) {
        const now = g.presentationTime ?? performance.now() / 1000;
        if (g.round !== round) {
          actors.clear();
          particles.clear();
          deathParticles.length = 0;
          round = g.round;
        }
        const width = g.width || 15,
          height = g.height || 13;
        const map = presentation(
          canvas.clientWidth,
          canvas.clientHeight,
          window.devicePixelRatio || 1,
          { width: width * 16, height: height * 16 },
        );
        let used = 0;
        let particleUsed = 0;
        const put = (x, y, frame, size = 16) => {
          if (used >= sprites.length) return;
          updateSprite2D(sprites[used++], {
            visible: true,
            positionPx: [map.x + x * 16 * map.unit, map.y + y * 16 * map.unit],
            sizePx: [size * map.unit, size * map.unit],
            frame,
          });
        };
        const putParticle = (cell, frame) => {
          if (!particleLayer || particleUsed >= particleSprites.length) return;
          updateSprite2D(particleSprites[particleUsed++], {
            visible: true,
            positionPx: [
              map.x + ((cell % width) + 0.5) * 16 * map.unit,
              map.y + (Math.floor(cell / width) + 0.5) * 16 * map.unit,
            ],
            sizePx: [PARTICLE_ATLAS_CELL * map.unit, PARTICLE_ATLAS_CELL * map.unit],
            frame,
          });
        };
        const closed = new Set(g.closed || []);
        for (let y = 0; y < height; y++)
          for (let x = 0; x < width; x++)
            put(x + 0.5, y + 0.5, closed.has(y * width + x) ? 14 : g.board[y * width + x]);
        for (const cell of g.plants || [])
          put((cell % width) + 0.5, Math.floor(cell / width) + 0.5, 8);
        for (const item of g.powerups || [])
          put(
            (item.cell % width) + 0.5,
            Math.floor(item.cell / width) + 0.5,
            { bomb: 10, range: 11, speed: 12, glove: 5, shield: 6 }[item.type],
            14 + Math.sin(now * 4),
          );
        if (Math.floor(now * 6) % 2 === 0)
          for (const i of (g.warnings || []).flatMap((w) => w.cells))
            put((i % width) + 0.5, Math.floor(i / width) + 0.5, 13);
        for (const b of g.bombs) {
          const left = b.deadline - g.tick,
            flash =
              g.bombFlash !== false &&
              !b.sliding &&
              left > 0 &&
              left <= 30 &&
              (left > 22 || (left <= 15 && left > 7));
          put(b.slideX ?? b.x + 0.5, b.slideY ?? b.y + 0.5, flash ? 7 : 3, 16);
        }
        for (const b of g.pendingBombs || []) put(b.x + 0.5, b.y + 0.5, 9);
        for (const i of new Set(g.blasts.flatMap((b) => b.cells)))
          put((i % width) + 0.5, Math.floor(i / width) + 0.5, 4);
        if (g.explosionStyle === 'pfx' && particleLayer) {
          const nowMs = now * 1000,
            smokeStart =
              nowMs +
              PARTICLE_PROFILES.smoke.startDelayFrames * PARTICLE_PROFILES.fire.frameDuration;
          for (const blast of g.blasts || []) {
            for (const cell of blast.cells) {
              const fireKey = `fire:${g.round}:${blast.id}:${cell}`;
              if (!particles.has(fireKey))
                particles.set(
                  fireKey,
                  createParticleInstance('fire', cell, nowMs, {
                    key: fireKey,
                    bombId: blast.id,
                  }),
                );
              const puffKey = `smoke:${g.round}:${blast.id}:${cell}`;
              if (!particles.has(puffKey))
                particles.set(
                  puffKey,
                  createParticleInstance('smoke', cell, smokeStart, {
                    key: puffKey,
                    bombId: blast.id,
                  }),
                );
            }
          }
        } else if (g.explosionStyle !== 'pfx') {
          particles.clear();
        }
        const activeParticles = [];
        for (const [key, current] of particles) {
          const advanced = advanceParticleInstance(current, now * 1000);
          if (advanced.done) {
            particles.delete(key);
            continue;
          }
          particles.set(key, advanced.instance);
          if (advanced.active) activeParticles.push(advanced.instance);
        }
        activeParticles.sort((a, b) => (a.type === 'smoke' ? -1 : b.type === 'smoke' ? 1 : 0));
        for (const particle of activeParticles) {
          const profile = PARTICLE_PROFILES[particle.type];
          putParticle(particle.cell, profile.atlasStart + particle.frame);
        }
        g.players.forEach((p, n) => {
          const before = actors.get(p.id),
            dx = p.x - (before?.x ?? p.x),
            dy = p.y - (before?.y ?? p.y);
          const moving = Math.hypot(dx, dy) > 0.0001;
          const direction = moving
            ? Math.abs(dx) > Math.abs(dy)
              ? dx < 0
                ? 2
                : 3
              : dy < 0
                ? 1
                : 0
            : (before?.direction ?? 0);
          if (before?.alive && !p.alive)
            for (let k = 0; k < 8; k++)
              deathParticles.push({ x: p.x, y: p.y, angle: (k * Math.PI) / 4, until: now + 0.5 });
          actors.set(p.id, { x: p.x, y: p.y, alive: p.alive, direction });
          const shield = p.shieldUntil - g.tick;
          if (p.alive && !(shield > 0 && Math.floor(g.tick / (shield <= 60 ? 3 : 9)) % 2))
            put(
              p.x,
              p.y,
              ACTOR_FRAME +
                (p.color ?? n) * 12 +
                direction * 3 +
                (moving ? 1 + (Math.floor(now * 8) % 2) : 0),
            );
        });
        while (deathParticles.length > 32) deathParticles.shift();
        for (let n = deathParticles.length - 1; n >= 0; n--) {
          const p = deathParticles[n];
          if (p.until <= now) {
            deathParticles.splice(n, 1);
            continue;
          }
          const distance = (0.5 - (p.until - now)) * 1.8;
          put(p.x + Math.cos(p.angle) * distance, p.y + Math.sin(p.angle) * distance, 15, 5);
        }
        for (let n = used; n < sprites.length; n++) updateSprite2D(sprites[n], { visible: false });
        for (let n = particleUsed; n < particleSprites.length; n++)
          updateSprite2D(particleSprites[n], { visible: false });
        return map;
      },
    };
  } catch (error) {
    dispose();
    console.error('Game graphics initialization failed:', error);
    throw new Error(getInitializationMessage(Boolean(navigator.gpu), error));
  }
}
