// Generates placeholder SVGs into public/images. Re-run with `npm run placeholders`.
// Replace these files with real product photos (same filenames) when ready.
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
mkdirSync(out, { recursive: true });

const TONES = [
  ['#F6EDE3', '#E9D5C0'],
  ['#F3E6E0', '#E3C6BB'],
  ['#EFE9DD', '#DACFB4'],
  ['#F5E9E9', '#E5CACA'],
  ['#EDE7E0', '#D6C8B8'],
  ['#F7F0E6', '#E8DAC2'],
  ['#F2E8E2', '#DDC4B4'],
  ['#F0EAE1', '#D9CDBB'],
];

const rings = (cx, cy, r, stroke) => `
  <circle cx="${cx - r * 0.35}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="6" opacity="0.55"/>
  <circle cx="${cx + r * 0.35}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="6" opacity="0.55"/>`;

const petals = (cx, cy, r, fill) =>
  [0, 60, 120, 180, 240, 300]
    .map((a) => `<ellipse cx="${cx}" cy="${cy - r}" rx="${r * 0.45}" ry="${r}" fill="${fill}" opacity="0.5" transform="rotate(${a} ${cx} ${cy})"/>`)
    .join('') + `<circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="#C9A227" opacity="0.7"/>`;

function svg({ w, h, tone, motif, label, sub }) {
  const [bg, deco] = tone;
  const cx = w / 2;
  const cy = h / 2 - (label ? h * 0.06 : 0);
  const art = motif === 'rings' ? rings(cx, cy, Math.min(w, h) * 0.16, '#C9A227') : petals(cx, cy, Math.min(w, h) * 0.13, deco);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none" stroke="${deco}" stroke-width="2"/>
  ${art}
  ${label ? `<text x="${cx}" y="${h - h * 0.17}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(w * 0.052)}" fill="#5C4632">${label}</text>` : ''}
  ${sub ? `<text x="${cx}" y="${h - h * 0.09}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(w * 0.03)}" fill="#8A7357" letter-spacing="2">${sub}</text>` : ''}
</svg>\n`;
}

// Product placeholders
for (let i = 1; i <= 8; i++) {
  writeFileSync(
    join(out, `ph-${i}.svg`),
    svg({ w: 800, h: 1000, tone: TONES[i - 1], motif: i % 2 ? 'petals' : 'rings', label: 'Ufon Weddings', sub: 'PHOTO COMING SOON' }),
  );
}

// Category tiles
const cats = [
  ['wedding-dresses', 'Wedding Dresses'],
  ['bridesmaid-dresses', 'Bridesmaid Dresses'],
  ['reception-dresses', 'Reception Dresses'],
  ['traditional-attire', 'Traditional Attire'],
  ['veils-trains', 'Veils &amp; Trains'],
  ['headwear', 'Headwear'],
  ['jewelry', 'Bridal Jewelry'],
  ['bouquets-flowers', 'Bouquets &amp; Flowers'],
  ['bridal-shoes', 'Bridal Shoes'],
  ['robes', 'Robes'],
  ['accessories', 'Accessories'],
  ['little-bride', 'Little Bride'],
];
cats.forEach(([slug, name], i) => {
  writeFileSync(
    join(out, `cat-${slug}.svg`),
    svg({ w: 800, h: 640, tone: TONES[i % 8], motif: i % 2 ? 'rings' : 'petals', label: name, sub: 'HANDCRAFTED' }),
  );
});

// Hero + about portrait
writeFileSync(join(out, 'hero.svg'), svg({ w: 1100, h: 900, tone: TONES[0], motif: 'rings', label: 'Handcrafted in Akwa Ibom', sub: 'UFON WEDDINGS' }));
writeFileSync(join(out, 'about-portrait.svg'), svg({ w: 800, h: 900, tone: TONES[3], motif: 'petals', label: 'The Founder', sub: 'PHOTO COMING SOON' }));

// Favicon
writeFileSync(
  join(out, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#C14B23"/><text x="32" y="43" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="#FAF6F1">U</text></svg>\n`,
);

console.log('Placeholder images written to', out);
