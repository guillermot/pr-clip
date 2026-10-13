// Renders the PR Clip icon (a clipboard on a gradient tile) without image dependencies,
// using signed-distance shapes and 4x4 supersampling.
//
//   node scripts/generate-icons.mjs
//
// Writes public/icon/{16,32,48,128}.png and store/assets/icon-128.png, which follows the
// Chrome Web Store guideline: 96x96 artwork centered in a transparent 128x128 canvas.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
const png = (size, rgba) => {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++)
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

// Shapes in a 0..1 coordinate space
const roundRect = (x, y, cx, cy, hw, hh, r) => {
  const qx = Math.abs(x - cx) - hw + r,
    qy = Math.abs(y - cy) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};
const BG1 = [99, 102, 241],
  BG2 = [139, 92, 246],
  WHITE = [255, 255, 255];

const sample = (x, y) => {
  if (roundRect(x, y, 0.5, 0.5, 0.5, 0.5, 0.22) > 0) return null;
  const t = (x + y) / 2;
  let col = BG1.map((c, i) => c + (BG2[i] - c) * t);
  const board = roundRect(x, y, 0.5, 0.54, 0.24, 0.29, 0.06);
  const inner = roundRect(x, y, 0.5, 0.54, 0.17, 0.22, 0.03);
  const clip = roundRect(x, y, 0.5, 0.26, 0.11, 0.06, 0.04);
  const line = (cy, hw) => roundRect(x, y, 0.5 - (0.12 - hw), cy, hw, 0.022, 0.02);
  if (
    (board <= 0 && inner > 0) ||
    clip <= 0 ||
    line(0.48, 0.12) <= 0 ||
    line(0.58, 0.12) <= 0 ||
    line(0.68, 0.07) <= 0
  )
    col = WHITE;
  return col;
};

/** Renders the icon at `artwork` px, centered in a `size` px transparent canvas. */
const render = (size, artwork = size) => {
  const ss = 4,
    offset = (size - artwork) / 2,
    buf = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++)
    for (let px = 0; px < size; px++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let sy = 0; sy < ss; sy++)
        for (let sx = 0; sx < ss; sx++) {
          const x = (px - offset + (sx + 0.5) / ss) / artwork;
          const y = (py - offset + (sy + 0.5) / ss) / artwork;
          const c = x >= 0 && x <= 1 && y >= 0 && y <= 1 ? sample(x, y) : null;
          if (c) {
            r += c[0];
            g += c[1];
            b += c[2];
            a++;
          }
        }
      const i = (py * size + px) * 4;
      if (a) {
        buf[i] = r / a;
        buf[i + 1] = g / a;
        buf[i + 2] = b / a;
        buf[i + 3] = (a / (ss * ss)) * 255;
      }
    }
  return png(size, buf);
};

mkdirSync(`${root}public/icon`, { recursive: true });
mkdirSync(`${root}store/assets`, { recursive: true });
for (const size of [16, 32, 48, 128]) writeFileSync(`${root}public/icon/${size}.png`, render(size));
writeFileSync(`${root}store/assets/icon-128.png`, render(128, 96));
