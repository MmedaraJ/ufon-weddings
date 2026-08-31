import { Personalization, Product, ProductColor } from '../common/types';

// Sample catalog for layout purposes. When we outgrow this file, move products
// into a database and keep the same Product shape.

const DRESS_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Custom (send measurements)'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42'];

const IVORY: ProductColor = { name: 'Ivory', hex: '#F5EFE4' };
const WHITE: ProductColor = { name: 'White', hex: '#FFFFFF' };
const CHAMPAGNE: ProductColor = { name: 'Champagne', hex: '#E8D6B3' };
const BLUSH: ProductColor = { name: 'Blush', hex: '#EEC9C5' };
const BURNT_ORANGE: ProductColor = { name: 'Burnt Orange', hex: '#C14B23' };
const GOLD: ProductColor = { name: 'Gold', hex: '#C9A227' };
const EMERALD: ProductColor = { name: 'Emerald', hex: '#1F6F50' };
const NAVY: ProductColor = { name: 'Navy', hex: '#20304F' };

// Personalization presets. `enabled: false` items are hidden on the site until
// we have the equipment (e.g. an engraving machine) — flip the flag to launch.
const EMBROIDERY = (label: string, maxLength: number, fee: number): Personalization => ({
  available: true,
  enabled: true,
  label,
  placeholder: 'e.g. Adaeze & Kufre · 14.02.2027',
  maxLength,
  fee,
});
const ENGRAVING_PENDING = (label: string, maxLength: number, fee: number): Personalization => ({
  available: true,
  enabled: false, // no engraving machine yet
  label,
  placeholder: 'e.g. A & K forever',
  maxLength,
  fee,
});

let n = 0;
const img = (...names: string[]) => names.map((x) => `/images/${x}.svg`);

function p(
  categorySlug: string,
  name: string,
  price: number,
  productionDays: number,
  shortDescription: string,
  extra: Partial<Product> = {},
): Product {
  n += 1;
  const slug = name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return {
    id: `p${String(n).padStart(3, '0')}`,
    slug,
    name,
    categorySlug,
    price,
    shortDescription,
    description:
      `${shortDescription} Every piece is handcrafted to order in our Akwa Ibom ` +
      'studio — cut, sewn and finished by hand, and customized for you and your wedding.',
    details: [
      'Handmade to order in Akwa Ibom, Nigeria',
      'Customized for you — share your measurements and preferences after ordering',
      'Chat with us on WhatsApp for fabric swatches and adjustments',
    ],
    images: img(`ph-${(n % 8) + 1}`, `ph-${((n + 3) % 8) + 1}`, `ph-${((n + 5) % 8) + 1}`),
    productionDays,
    ...extra,
  };
}

export const PRODUCTS: Product[] = [
  // Wedding Dresses
  p('wedding-dresses', 'Adiaha Ballgown', 450000, 30,
    'A full ivory ballgown with a hand-beaded bodice and sweeping tulle skirt.',
    { sizes: DRESS_SIZES, colors: [IVORY, WHITE, CHAMPAGNE], featured: true }),
  p('wedding-dresses', 'Imaobong Mermaid Gown', 380000, 28,
    'A fitted mermaid silhouette in crepe with corded lace through the train.',
    { sizes: DRESS_SIZES, colors: [IVORY, WHITE] }),
  p('wedding-dresses', 'Uduak A-Line Gown', 320000, 25,
    'A soft A-line gown with illusion sleeves and covered buttons to the hem.',
    { sizes: DRESS_SIZES, colors: [IVORY, CHAMPAGNE] }),

  // Bridesmaid Dresses
  p('bridesmaid-dresses', 'Ekaette Wrap Dress', 85000, 14,
    'A flattering chiffon wrap dress that suits every body on your train.',
    { sizes: DRESS_SIZES, colors: [BURNT_ORANGE, EMERALD, NAVY, BLUSH], featured: true }),
  p('bridesmaid-dresses', 'Idara Off-Shoulder Dress', 95000, 14,
    'Off-shoulder satin with a thigh-high slit — made in your wedding colors.',
    { sizes: DRESS_SIZES, colors: [BURNT_ORANGE, EMERALD, NAVY] }),
  p('bridesmaid-dresses', 'Mfoniso Mix-and-Match Set', 78000, 16,
    'One color, three necklines — let each bridesmaid pick her favourite cut.',
    { sizes: DRESS_SIZES, colors: [BURNT_ORANGE, BLUSH, GOLD] }),

  // Reception & After-Party Dresses
  p('reception-dresses', 'Party Two Reception Mini', 150000, 18,
    'A beaded fringe mini made for your first dance and everything after.',
    { sizes: DRESS_SIZES, colors: [WHITE, GOLD], featured: true }),
  p('reception-dresses', 'Anwan Satin Slip Dress', 120000, 15,
    'A bias-cut satin slip with a cowl neck — light enough to dance all night.',
    { sizes: DRESS_SIZES, colors: [IVORY, CHAMPAGNE, BLUSH] }),

  // Traditional Attire
  p('traditional-attire', 'Aso-Oke Bridal Set', 260000, 24,
    'Handwoven aso-oke buba, iro and gele set in your chosen colourway.',
    { sizes: DRESS_SIZES, colors: [BURNT_ORANGE, GOLD, EMERALD], featured: true }),
  p('traditional-attire', 'Onyonyo Traditional Gown', 290000, 26,
    'A regal full-volume traditional bridal gown inspired by Efik onyonyo.',
    { sizes: DRESS_SIZES, colors: [GOLD, BURNT_ORANGE] }),
  p('traditional-attire', 'Groom Aso-Oke Agbada', 180000, 20,
    'A matching handwoven agbada so the groom keeps up with his bride.',
    { sizes: DRESS_SIZES, colors: [GOLD, NAVY] }),

  // Veils & Trains
  p('veils-trains', 'Cathedral Pearl Veil', 80000, 12,
    'A 3-metre cathedral veil scattered with hand-sewn pearls.',
    { colors: [IVORY, WHITE], featured: true,
      personalization: EMBROIDERY('Embroidered names or date on the edge', 40, 8000) }),
  p('veils-trains', 'Fingertip Lace-Edge Veil', 45000, 10,
    'A two-tier fingertip veil finished with corded French lace.',
    { colors: [IVORY, WHITE],
      personalization: EMBROIDERY('Embroidered initials', 12, 5000) }),
  p('veils-trains', 'Detachable Satin Train', 95000, 14,
    'A detachable watteau train that transforms any dress for the ceremony.',
    { colors: [IVORY, WHITE, CHAMPAGNE] }),

  // Headwear
  p('headwear', 'Ibibio Coral Crown', 60000, 10,
    'A handmade coral-bead bridal crown rooted in Ibibio tradition.',
    { colors: [BURNT_ORANGE, GOLD], featured: true }),
  p('headwear', 'Crystal Halo Tiara', 55000, 9,
    'A wire-wrapped halo tiara set with crystals and freshwater pearls.'),
  p('headwear', 'Auto-Gele (Pre-Tied)', 25000, 6,
    'A pre-tied gele in stiff metallic fabric — perfect pleats, zero stress.',
    { colors: [GOLD, BURNT_ORANGE, EMERALD] }),

  // Bridal Jewelry
  p('jewelry', 'Uyai Pearl Set', 48000, 8,
    'Necklace, drop earrings and bracelet strung with freshwater pearls.',
    { colors: [WHITE, GOLD], featured: true,
      personalization: ENGRAVING_PENDING('Engraved initials on the clasp', 6, 6000) }),
  p('jewelry', 'Coral Statement Necklace', 65000, 10,
    'Layered coral beads for the traditional ceremony, sized to you.',
    { colors: [BURNT_ORANGE] }),
  p('jewelry', 'Teardrop Crystal Earrings', 22000, 5,
    'Hand-set crystal teardrops that catch every camera flash.'),

  // Bouquets & Flowers
  p('bouquets-flowers', 'Red Gerbera Bridal Bouquet', 48000, 8,
    'Bold red gerberas with trailing star-of-Bethlehem sprays, hand-tied in a white satin wrap.',
    {
      featured: true,
      images: [
        '/images/products/red-gerbera-bridal-bouquet/main.jpg',
        '/images/products/red-gerbera-bridal-bouquet/square.jpg',
        '/images/products/red-gerbera-bridal-bouquet/detail.jpg',
      ],
    }),
  p('bouquets-flowers', 'Everlasting Silk Bouquet', 45000, 8,
    'A silk-and-dried-flower bridal bouquet you keep forever.',
    { colors: [BLUSH, BURNT_ORANGE, IVORY] }),
  p('bouquets-flowers', 'Bridesmaid Posy (Set of 4)', 60000, 9,
    'Four matching mini posies tied with satin ribbon.',
    { colors: [BLUSH, BURNT_ORANGE, EMERALD] }),
  p('bouquets-flowers', 'Boutonniere & Corsage Set', 25000, 6,
    'Groom and groomsmen boutonnieres with two corsages for the mums.',
    { colors: [BURNT_ORANGE, IVORY] }),

  // Bridal Shoes
  p('bridal-shoes', 'Pearl-Strap Block Heels', 55000, 12,
    'Comfortable block heels with hand-beaded pearl straps.',
    { sizes: SHOE_SIZES, colors: [IVORY, WHITE], featured: true }),
  p('bridal-shoes', 'Lace Ballet Flats', 38000, 10,
    'Lace-overlaid flats for brides who plan to dance from the first song.',
    { sizes: SHOE_SIZES, colors: [IVORY, BLUSH] }),
  p('bridal-shoes', 'Crystal Evening Sandals', 62000, 12,
    'Strappy sandals with crystal embellishment for the reception.',
    { sizes: SHOE_SIZES, colors: [GOLD, WHITE] }),

  // Robes & Getting-Ready Wear
  p('robes', 'Bride Satin Robe', 28000, 7,
    'A satin getting-ready robe with lace trim — made for the morning photos.',
    { sizes: DRESS_SIZES, colors: [WHITE, BLUSH, CHAMPAGNE], featured: true,
      personalization: EMBROIDERY('Embroidered name or title on the back', 20, 5000) }),
  p('robes', 'Bridesmaid Robe Set (Set of 4)', 90000, 10,
    'Four matching robes for your girls, each with lace-trimmed sleeves.',
    { sizes: DRESS_SIZES, colors: [BLUSH, BURNT_ORANGE, EMERALD],
      personalization: EMBROIDERY('Embroidered names (comma-separated)', 80, 16000) }),

  // Accessories
  p('accessories', 'Satin Bridal Gloves', 18000, 6,
    'Elbow-length satin gloves with covered-button detail.',
    { colors: [WHITE, IVORY] }),
  p('accessories', 'Beaded Bridal Clutch', 32000, 9,
    'A hand-beaded clutch sized for lipstick, tissues and vows.',
    { colors: [IVORY, GOLD, BURNT_ORANGE],
      personalization: ENGRAVING_PENDING('Monogram plate on the clasp', 4, 7000) }),
  p('accessories', 'Lace Garter & Hankie Set', 15000, 5,
    'A lace garter with a matching embroidered handkerchief.',
    { colors: [WHITE, BLUSH],
      personalization: EMBROIDERY('Embroidered names & date on the hankie', 30, 4000) }),

  // Little Bride & Flower Girl
  p('little-bride', 'Little Bride Ballgown', 65000, 15,
    'A mini ballgown so the little bride matches the big one.',
    { sizes: ['2-3y', '4-5y', '6-7y', '8-9y', '10-11y'], colors: [IVORY, WHITE, BLUSH], featured: true }),
  p('little-bride', 'Flower Girl Basket & Crown', 20000, 6,
    'A ribbon-wrapped petal basket with a matching flower crown.',
    { colors: [IVORY, BLUSH, BURNT_ORANGE] }),
  p('little-bride', 'Ring Bearer Pillow', 15000, 5,
    'A satin ring pillow with hand-stitched pearl detail.',
    { colors: [IVORY, WHITE],
      personalization: EMBROIDERY('Embroidered couple names', 30, 4000) }),
];
