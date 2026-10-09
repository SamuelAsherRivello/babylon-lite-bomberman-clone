export const ATLAS_COLUMNS = 32;
export const ATLAS_ROWS = 2;
export const ACTOR_FRAME = 16;

// Original 16px artwork: four workshop couriers, twelve poses per courier.
let atlasCanvas;
const actorSprites = new Map();

function getAtlasCanvas() {
  if (atlasCanvas) return atlasCanvas;
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_COLUMNS * 16;
  canvas.height = ATLAS_ROWS * 16;
  const ctx = canvas.getContext('2d');
  const rect = (frame, x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      (frame % ATLAS_COLUMNS) * 16 + x,
      Math.floor(frame / ATLAS_COLUMNS) * 16 + y,
      w,
      h,
    );
  };
  rect(0, 0, 0, 16, 16, '#243f3b');
  rect(0, 1, 1, 14, 14, '#2c4b42');
  rect(0, 3, 4, 2, 1, '#365b49');
  rect(1, 0, 0, 16, 16, '#18232d');
  rect(1, 1, 1, 14, 13, '#627184');
  rect(1, 2, 2, 12, 2, '#a2b1b8');
  rect(1, 2, 7, 12, 1, '#374351');
  rect(1, 7, 3, 1, 4, '#374351');
  rect(2, 0, 0, 16, 16, '#3c2933');
  rect(2, 1, 1, 14, 14, '#ab6652');
  for (let y = 1; y < 15; y += 5) {
    rect(2, 1, y, 14, 1, '#e09b65');
    rect(2, 5, y, 1, 5, '#553843');
  }
  rect(3, 3, 5, 10, 9, '#101827');
  rect(3, 2, 7, 12, 5, '#101827');
  rect(3, 4, 5, 4, 2, '#526174');
  rect(3, 7, 2, 2, 4, '#cda263');
  rect(3, 9, 1, 3, 2, '#fff0a0');
  rect(4, 4, 0, 8, 16, '#ff623a');
  rect(4, 0, 4, 16, 8, '#ff623a');
  rect(4, 6, 0, 4, 16, '#ffce69');
  rect(4, 0, 6, 16, 4, '#ffce69');
  rect(4, 6, 6, 4, 4, '#fff5c2');
  rect(5, 3, 3, 9, 8, '#e85977');
  rect(5, 2, 7, 4, 5, '#ff9a9b');
  rect(5, 5, 11, 6, 3, '#fff0bd');
  rect(5, 5, 4, 5, 2, '#ffb0a4');
  rect(6, 8, 1, 4, 5, '#fff4a0');
  rect(6, 5, 5, 6, 4, '#ffd45a');
  rect(6, 7, 8, 3, 3, '#fff4a0');
  rect(6, 5, 11, 3, 4, '#ffd45a');
  rect(7, 3, 5, 10, 9, '#fff4bb');
  rect(7, 2, 7, 12, 5, '#fff4bb');
  rect(7, 7, 2, 2, 4, '#ffb54f');
  rect(7, 9, 1, 3, 2, '#ffffff');
  rect(8, 7, 4, 2, 12, '#5ba747');
  rect(8, 2, 3, 6, 5, '#95db58');
  rect(8, 9, 6, 5, 5, '#69bb4d');
  rect(8, 4, 2, 3, 2, '#d2ee77');
  for (let n = 3; n < 13; n += 3) {
    rect(9, n, 2, 2, 1, '#f7dc9a');
    rect(9, n, 13, 2, 1, '#f7dc9a');
    rect(9, 2, n, 1, 2, '#f7dc9a');
    rect(9, 13, n, 1, 2, '#f7dc9a');
  }
  ['#79ded0', '#ffce69', '#b69bff'].forEach((color, n) => {
    const f = 10 + n;
    rect(f, 2, 2, 12, 12, '#152934');
    rect(f, 3, 3, 10, 10, color);
    rect(f, 4, 4, 8, 8, '#28484b');
    if (n === 0) {
      rect(f, 5, 6, 6, 5, color);
      rect(f, 7, 4, 2, 3, color);
      rect(f, 10, 3, 2, 2, '#fff0c4');
    }
    if (n === 1) {
      rect(f, 7, 4, 2, 8, color);
      rect(f, 4, 7, 8, 2, color);
      rect(f, 7, 7, 2, 2, '#fff0c4');
    }
    if (n === 2) {
      rect(f, 5, 5, 6, 2, color);
      rect(f, 7, 7, 3, 2, color);
      rect(f, 5, 9, 6, 2, color);
      rect(f, 3, 11, 5, 1, '#fff0c4');
    }
  });
  rect(13, 1, 1, 14, 1, '#ffcf69');
  rect(13, 1, 14, 14, 1, '#ffcf69');
  rect(13, 1, 1, 1, 14, '#ffcf69');
  rect(13, 14, 1, 1, 14, '#ffcf69');
  rect(13, 7, 4, 2, 5, '#ff9b64');
  rect(13, 7, 11, 2, 2, '#fff0bd');
  rect(14, 0, 0, 16, 16, '#322933');
  rect(14, 1, 1, 14, 14, '#705063');
  rect(14, 2, 2, 12, 2, '#c7998a');
  rect(14, 5, 5, 6, 6, '#352b39');
  rect(14, 7, 6, 2, 4, '#f5b472');
  rect(15, 6, 6, 4, 4, '#fff0bd');
  rect(15, 7, 4, 2, 8, '#ffbf78');
  rect(15, 4, 7, 8, 2, '#ffbf78');
  ['#79ded0', '#fbad69', '#b69bff', '#ff7fa4'].forEach((color, seat) => {
    for (let direction = 0; direction < 4; direction++)
      for (let pose = 0; pose < 3; pose++) {
        const f = ACTOR_FRAME + seat * 12 + direction * 3 + pose,
          bob = pose === 2 ? 1 : 0;
        rect(f, 3, 13, 10, 2, '#18232d');
        rect(f, 4, 2 + bob, 8, 7, color);
        rect(f, 3, 4 + bob, 10, 5, color);
        // Distinct crown shapes remain readable even without player colors.
        if (seat === 0) rect(f, 7, 0 + bob, 2, 3, '#fff0bd');
        if (seat === 1) {
          rect(f, 3, 1 + bob, 3, 3, color);
          rect(f, 10, 1 + bob, 3, 3, color);
        }
        if (seat === 2) {
          rect(f, 6, 0 + bob, 4, 3, color);
          rect(f, 7, 0 + bob, 2, 1, '#fff0bd');
        }
        if (seat === 3) rect(f, 2, 3 + bob, 12, 2, '#fff0bd');
        if (direction !== 1) {
          const x = direction === 2 ? 3 : direction === 3 ? 7 : 4;
          rect(f, x, 5 + bob, 5, 3, '#182736');
          rect(f, x + 1, 5 + bob, 1, 2, '#fff1cc');
          rect(f, x + 3, 5 + bob, 1, 2, '#fff1cc');
        } else rect(f, 6, 4 + bob, 4, 3, '#426278');
        rect(f, 4, 10, 8, 3, color);
        rect(f, 2, 10 + (pose === 1 ? 1 : 0), 2, 3, '#f7e8c1');
        rect(f, 12, 10 + (pose === 2 ? 1 : 0), 2, 3, '#f7e8c1');
        rect(f, 3, 13 + (pose === 1 ? 1 : 0), 4, 2, '#172231');
        rect(f, 9, 13 + (pose === 2 ? 1 : 0), 4, 2, '#172231');
      }
  });
  atlasCanvas = canvas;
  return canvas;
}

export function atlasUrl() {
  return getAtlasCanvas().toDataURL();
}

export function actorSpriteUrl(color) {
  if (actorSprites.has(color)) return actorSprites.get(color);
  const frame = ACTOR_FRAME + color * 12;
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  canvas
    .getContext('2d')
    .drawImage(
      getAtlasCanvas(),
      (frame % ATLAS_COLUMNS) * 16,
      Math.floor(frame / ATLAS_COLUMNS) * 16,
      16,
      16,
      0,
      0,
      16,
      16,
    );
  const url = canvas.toDataURL();
  actorSprites.set(color, url);
  return url;
}
