import { PARTICLE_PROFILES } from './particle-effects-system.js';

export const PARTICLE_ATLAS_CELL = 64;
export const PARTICLE_ATLAS_COLUMNS = 8;
export const PARTICLE_ATLAS_ROWS = 4;

const base = import.meta.env?.BASE_URL ?? '/';
const sources = Object.freeze({
  smoke: Array.from(
    { length: 9 },
    (_, n) => `${base}assets/pfx/SmokePoff_9x1/Smoke_Poff_${n + 1}.png`,
  ),
  fire: Array.from(
    { length: 17 },
    (_, n) => `${base}assets/pfx/FirePlume_17x1/Fire_Plume_${n + 1}.png`,
  ),
});

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Particle frame failed to load: ${source}`));
    image.src = source;
  });
}

export async function particleAtlasUrl() {
  const frames = await Promise.all([...sources.smoke, ...sources.fire].map(loadImage));
  const canvas = document.createElement('canvas');
  canvas.width = PARTICLE_ATLAS_COLUMNS * PARTICLE_ATLAS_CELL;
  canvas.height = PARTICLE_ATLAS_ROWS * PARTICLE_ATLAS_CELL;
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  frames.forEach((image, frame) => {
    const column = frame % PARTICLE_ATLAS_COLUMNS,
      row = Math.floor(frame / PARTICLE_ATLAS_COLUMNS),
      size = frame < PARTICLE_PROFILES.smoke.frames ? 20 : 20,
      x = column * PARTICLE_ATLAS_CELL + Math.floor((PARTICLE_ATLAS_CELL - size) / 2),
      y = row * PARTICLE_ATLAS_CELL + Math.floor((PARTICLE_ATLAS_CELL - size) / 2);
    context.drawImage(image, x, y, size, size);
  });
  return canvas.toDataURL();
}
