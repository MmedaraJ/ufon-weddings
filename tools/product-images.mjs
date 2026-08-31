#!/usr/bin/env node
/**
 * Turn one raw photo into a web-ready product image set.
 *
 *   node tools/product-images.mjs <photo> <product-slug> [--focus x,y,w,h] [--detail x,y,w,h]
 *
 *   <photo>         path to your original photo (jpg/png/webp/heic*)
 *   <product-slug>  e.g. everlasting-silk-bouquet — output folder name
 *   --focus         crop box for the PRODUCT as percentages of the image,
 *                   e.g. --focus 10,5,60,55 = start 10% from left, 5% from top,
 *                   60% wide, 55% tall. Defaults to the full image.
 *   --detail        optional second box for a close-up shot (same format).
 *
 * Outputs to client/public/images/products/<slug>/:
 *   main.jpg    1200x1500 (4:5)  — product page carousel
 *   square.jpg  1200x1200 (1:1)  — category/featured cards
 *   detail.jpg  1200x1200 (1:1)  — close-up slide (if --detail given)
 *   thumb.jpg    480x600  (4:5)  — cart thumbnails / fast loads
 *
 * Then point the product's `images` array in server/src/data/products.ts at
 * e.g. /images/products/<slug>/main.jpg
 */
import { mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const [photo, slug] = positional;
if (!photo || !slug) {
  console.error('Usage: node tools/product-images.mjs <photo> <product-slug> [--focus x,y,w,h] [--detail x,y,w,h]');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'client', 'public', 'images', 'products', slug);
mkdirSync(outDir, { recursive: true });

const meta = await sharp(photo).metadata();
const { width: W, height: H } = meta;

function parseBox(spec) {
  if (!spec) return null;
  const [x, y, w, h] = spec.split(',').map(Number);
  if ([x, y, w, h].some((n) => !Number.isFinite(n))) {
    console.error(`Bad box "${spec}" — expected x,y,w,h as percentages, e.g. 10,5,60,55`);
    process.exit(1);
  }
  return {
    left: Math.round((x / 100) * W),
    top: Math.round((y / 100) * H),
    width: Math.round((w / 100) * W),
    height: Math.round((h / 100) * H),
  };
}

const focus = parseBox(flag('focus'));
const detail = parseBox(flag('detail'));

async function emit(name, box, width, height) {
  let img = sharp(photo).rotate(); // respect EXIF orientation
  if (box) img = img.extract(box);
  await img
    .resize(width, height, { fit: 'cover', position: 'attention' }) // 'attention' centers on the busiest region
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(join(outDir, name));
  console.log(`  ${name}  ${width}x${height}`);
}

console.log(`Source ${photo} (${W}x${H}) -> ${outDir}`);
await emit('main.jpg', focus, 1200, 1500);
await emit('square.jpg', focus, 1200, 1200);
if (detail) await emit('detail.jpg', detail, 1200, 1200);
await emit('thumb.jpg', focus, 480, 600);
console.log(`\nUse in server/src/data/products.ts:`);
console.log(`  images: ['/images/products/${slug}/main.jpg', '/images/products/${slug}/square.jpg'${detail ? `, '/images/products/${slug}/detail.jpg'` : ''}],`);
