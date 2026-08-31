// Illustrated product art for the Red Gerbera Bridal Bouquet (stand-in until
// real photos land in raw-photos/). Renders an SVG scene, rasterizes with
// sharp, and emits the standard product image set.
import { mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'client', 'public', 'images', 'products', 'red-gerbera-bridal-bouquet');
mkdirSync(outDir, { recursive: true });

// deterministic rng so re-runs produce identical art
let seed = 42;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const W = 1600, H = 2000;

function gerbera(cx, cy, r, baseRot = 0) {
  let s = '';
  const reds = ['#C1121F', '#B00F1B', '#D21B26', '#A80E19'];
  for (let i = 0; i < 26; i++) {
    const a = baseRot + i * (360 / 26) + (rnd() - 0.5) * 6;
    const len = r * (0.92 + rnd() * 0.16);
    s += `<ellipse cx="0" cy="${-len * 0.58}" rx="${r * 0.13}" ry="${len * 0.5}" fill="${reds[i % 4]}" transform="rotate(${a.toFixed(1)} 0 0)"/>`;
  }
  for (let i = 0; i < 20; i++) {
    const a = baseRot + 9 + i * 18 + (rnd() - 0.5) * 8;
    s += `<ellipse cx="0" cy="${-r * 0.38}" rx="${r * 0.10}" ry="${r * 0.30}" fill="#8E0D14" transform="rotate(${a.toFixed(1)} 0 0)"/>`;
  }
  s += `<circle r="${r * 0.24}" fill="#2E0708"/>`;
  for (let i = 0; i < 26; i++) {
    const a = (i * (360 / 26) * Math.PI) / 180;
    s += `<circle cx="${Math.cos(a) * r * 0.26}" cy="${Math.sin(a) * r * 0.26}" r="${r * 0.028}" fill="#7A1010"/>`;
  }
  s += `<circle r="${r * 0.09}" fill="#4A0B0B"/>`;
  return `<g transform="translate(${cx} ${cy})">${s}</g>`;
}

function starSpray(x1, y1, cx, cy, x2, y2) {
  let s = `<path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="#4F8A4C" stroke-width="11" fill="none" stroke-linecap="round"/>`;
  s += `<ellipse cx="${x2}" cy="${y2}" rx="26" ry="40" fill="#D9E4B6" stroke="#B7C98E" stroke-width="3" transform="rotate(${(rnd() - 0.5) * 50} ${x2} ${y2})"/>`;
  for (let i = 0; i < 5; i++) {
    const a = rnd() * Math.PI * 2;
    const d = 34 + rnd() * 34;
    const sx = x2 + Math.cos(a) * d, sy = y2 + Math.sin(a) * d;
    let star = '';
    for (let p = 0; p < 6; p++) {
      star += `<ellipse cx="0" cy="-11" rx="4.6" ry="11" fill="#FDFDF6" transform="rotate(${p * 60})"/>`;
    }
    s += `<g transform="translate(${sx} ${sy})">${star}<circle r="3.4" fill="#26221B"/></g>`;
  }
  return s;
}

function leaf(x, y, rot, len, fill) {
  return `<path d="M 0 0 Q ${len * 0.35} ${-len * 0.5} 0 ${-len} Q ${-len * 0.35} ${-len * 0.5} 0 0 Z" fill="${fill}" transform="translate(${x} ${y}) rotate(${rot})"/>`;
}

const stems = [
  [700, 800], [950, 900], [620, 1030], [870, 720], [770, 960], [560, 640], [1060, 620], [430, 560], [1180, 700],
]
  .map(([x, y]) => `<path d="M 800 1480 C 800 1300, ${x} ${y + 220}, ${x} ${y}" stroke="#3E7C3B" stroke-width="13" fill="none" stroke-linecap="round"/>`)
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#FFFDF9"/>
      <stop offset="70%" stop-color="#FAF5EE"/>
      <stop offset="100%" stop-color="#F0E7DA"/>
    </radialGradient>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(60,45,30,0.28)"/>
      <stop offset="100%" stop-color="rgba(60,45,30,0)"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="820" cy="1830" rx="420" ry="70" fill="url(#shadow)"/>

  ${starSpray(790, 1400, 500, 900, 380, 520)}
  ${starSpray(790, 1400, 420, 1000, 300, 780)}
  ${starSpray(800, 1400, 700, 700, 620, 380)}
  ${starSpray(810, 1400, 1150, 800, 1240, 560)}
  ${starSpray(810, 1400, 1250, 1000, 1330, 850)}
  ${starSpray(800, 1400, 1000, 600, 1020, 400)}

  ${stems}
  ${leaf(640, 1130, 40, 150, '#2F6640')}
  ${leaf(980, 1050, -35, 140, '#3E7C4F')}
  ${leaf(760, 1080, 8, 120, '#356F45')}

  ${gerbera(870, 730, 118, 10)}
  ${gerbera(575, 660, 100, 40)}
  ${gerbera(700, 810, 168, 0)}
  ${gerbera(950, 905, 148, 22)}
  ${gerbera(620, 1030, 128, -14)}
  ${gerbera(800, 985, 96, 55)}

  <g>
    <rect x="752" y="1400" width="104" height="200" rx="30" fill="#FDFCF8" stroke="#E8E2D4" stroke-width="3"/>
    <path d="M 752 1440 l 104 22 M 752 1480 l 104 22 M 752 1520 l 104 22" stroke="#EDE7DA" stroke-width="7"/>
  </g>
  <path d="M 780 1600 l -14 130 M 804 1600 l 0 140 M 828 1600 l 14 128 M 792 1600 l -6 136 M 816 1600 l 8 134" stroke="#3E7C3B" stroke-width="11" stroke-linecap="round"/>
</svg>`;

const png = join(outDir, '_scene.png');
await sharp(Buffer.from(svg), { density: 96 }).png().toFile(png);
console.log('Scene rendered:', png);
