import { Product, ProductColor } from '../common/types';

// The catalog. Every product is a conversation starter: the photo shows the
// style, the price is an indicative range, and the details (fabric, colour,
// measurements, finish) are agreed with the customer on WhatsApp.
//
// Slugs match the folders/files in photos/ and client/public/images/products/.

const DRESS_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom (send measurements)'];
const GIRL_SIZES = ['2-3y', '4-5y', '6-7y', '8-9y', '10-11y', '12-13y'];
const PETTICOAT_SIZES = ['S', 'M', 'L', 'XL', 'Custom'];

const WHITE: ProductColor = { name: 'White', hex: '#FFFFFF' };
const OFF_WHITE: ProductColor = { name: 'Off-White', hex: '#F4EEE2' };
const SILVER: ProductColor = { name: 'Silver', hex: '#C9CDD4' };
const IVORY: ProductColor = { name: 'Ivory', hex: '#F5EFE4' };
const CHAMPAGNE: ProductColor = { name: 'Champagne', hex: '#E8D6B3' };
const BLUSH: ProductColor = { name: 'Blush', hex: '#EEC9C5' };
const BURNT_ORANGE: ProductColor = { name: 'Burnt Orange', hex: '#C14B23' };
const GOLD: ProductColor = { name: 'Gold', hex: '#C9A227' };
const MUSTARD: ProductColor = { name: 'Mustard', hex: '#D9A21B' };
const EMERALD: ProductColor = { name: 'Emerald', hex: '#1F6F50' };
const NAVY: ProductColor = { name: 'Navy', hex: '#20304F' };
const BERRY: ProductColor = { name: 'Berry', hex: '#8E2C5B' };
const DUSTY_PINK: ProductColor = { name: 'Dusty Pink', hex: '#D89AA0' };
const SKY_BLUE: ProductColor = { name: 'Sky Blue', hex: '#A9C9E8' };
const RED: ProductColor = { name: 'Red', hex: '#B3261E' };

const BRIDESMAID_COLORS = [BURNT_ORANGE, MUSTARD, EMERALD, NAVY, BERRY, DUSTY_PINK, GOLD, BLUSH];
const ROBE_COLORS = [WHITE, CHAMPAGNE, BLUSH, SKY_BLUE, RED, BURNT_ORANGE, EMERALD];
const FLORAL_COLORS = [WHITE, IVORY, BLUSH, BURNT_ORANGE];

const slides = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => `/images/products/${slug}/slide-${i + 1}.jpg`);
const main = (slug: string) => [`/images/products/${slug}/main.jpg`];

let n = 0;
function p(
  categorySlug: string,
  slug: string,
  name: string,
  priceMin: number,
  priceMax: number,
  productionDays: number,
  shortDescription: string,
  extra: Partial<Product> = {},
): Product {
  n += 1;
  return {
    id: `p${String(n).padStart(3, '0')}`,
    slug,
    name,
    categorySlug,
    priceMin,
    priceMax,
    shortDescription,
    description:
      `${shortDescription} Use this as your starting point — every piece is handmade to order in ` +
      'our Akwa Ibom studio, and we work out the fabric, colour, fit and finishing touches with you on WhatsApp.',
    details: [
      'Handmade to order in Akwa Ibom, Nigeria',
      'Price shown is an indicative range — your final quote depends on fabric, detail and size',
      'Fully customizable: chat with us about colours, materials and changes',
    ],
    images: main(slug),
    productionDays,
    ...extra,
  };
}

export const PRODUCTS: Product[] = [
  // ---------------- Wedding Gowns ----------------
  p('wedding-gowns', 'pearl-beaded-fish-gown', 'Pearl Beaded Fish Gown', 400000, 650000, 30,
    'A pearl-and-crystal beaded fish (mermaid) gown that hugs every curve, then blooms into a ruffled organza train.',
    { images: slides('pearl-beaded-fish-gown', 6), sizes: DRESS_SIZES, featured: true }),
  p('wedding-gowns', 'illusion-sleeve-ball-gown', 'Illusion Sleeve Ball Gown', 450000, 750000, 30,
    'A sparkling ball gown with a beaded illusion neckline and long sheer sleeves.',
    { images: slides('illusion-sleeve-ball-gown', 5), sizes: DRESS_SIZES, featured: true }),
  p('wedding-gowns', 'beaded-satin-ball-gown', 'Beaded Satin Ball Gown', 380000, 600000, 28,
    'A clean satin ball gown with a fully beaded long-sleeve bodice.',
    { images: slides('beaded-satin-ball-gown', 2), sizes: DRESS_SIZES }),
  p('wedding-gowns', 'off-shoulder-corset-ball-gown', 'Off-Shoulder Corset Ball Gown', 380000, 620000, 28,
    'A pleated off-shoulder neckline over a boned corset and a glittering tulle skirt.',
    { images: slides('off-shoulder-corset-ball-gown', 2), sizes: DRESS_SIZES, featured: true }),
  p('wedding-gowns', 'halter-beaded-fish-gown', 'Halter Beaded Fish Gown', 350000, 550000, 26,
    'A halter-neck fish gown with a beaded corset bodice and a smooth satin flare.',
    { images: slides('halter-beaded-fish-gown', 2), sizes: DRESS_SIZES }),
  p('wedding-gowns', 'lace-a-line-gown', 'Lace A-Line Gown', 250000, 450000, 24,
    'A soft A-line in lace-appliquéd tulle with a V-neck, open back and chapel train.',
    { images: slides('lace-a-line-gown', 2), sizes: DRESS_SIZES }),
  p('wedding-gowns', 'one-shoulder-ruffle-fish-gown', 'One-Shoulder Ruffle Fish Gown', 380000, 600000, 28,
    'A one-shoulder fish gown with a sculpted organza rosette and tiered ruffle hem.',
    { images: slides('one-shoulder-ruffle-fish-gown', 2), sizes: DRESS_SIZES }),
  p('wedding-gowns', 'strapless-satin-ball-gown', 'Strapless Satin Ball Gown', 300000, 500000, 24,
    'A strapless satin gown with a floral corset detail, sweeping skirt and a daring slit.',
    { images: slides('strapless-satin-ball-gown', 2), sizes: DRESS_SIZES }),

  // ---------------- Bridesmaid Dresses ----------------
  p('bridesmaid-dresses', 'satin-corset-slit-bridesmaid-gown', 'Satin Corset Bridesmaid Gown with Slit', 65000, 120000, 14,
    'A satin corset gown with a thigh-high slit and beaded waist — pictured in mustard.',
    { sizes: DRESS_SIZES, colors: BRIDESMAID_COLORS, featured: true }),
  p('bridesmaid-dresses', 'one-shoulder-bow-mermaid-bridesmaid-gown', 'One-Shoulder Bow Mermaid Bridesmaid Gown', 60000, 110000, 14,
    'A sleek mermaid gown with an oversized one-shoulder bow — pictured in emerald.',
    { sizes: DRESS_SIZES, colors: BRIDESMAID_COLORS }),
  p('bridesmaid-dresses', 'off-shoulder-lace-corset-mermaid-bridesmaid-gown', 'Off-Shoulder Lace Corset Mermaid Gown', 70000, 125000, 14,
    'An off-shoulder mermaid with a sheer lace corset panel — pictured in burnt orange.',
    { sizes: DRESS_SIZES, colors: BRIDESMAID_COLORS, featured: true }),
  p('bridesmaid-dresses', 'v-neck-satin-mermaid-bridesmaid-gown', 'V-Neck Satin Mermaid Bridesmaid Gown', 55000, 100000, 12,
    'A classic V-neck satin mermaid that flatters every body on the train — pictured in berry.',
    { sizes: DRESS_SIZES, colors: BRIDESMAID_COLORS }),
  p('bridesmaid-dresses', 'off-shoulder-bow-back-bridesmaid-gown', 'Off-Shoulder Bow-Back Bridesmaid Gown', 65000, 115000, 14,
    'An off-shoulder gown with a statement bow and floor-length sash at the back — pictured in dusty pink.',
    { sizes: DRESS_SIZES, colors: BRIDESMAID_COLORS }),

  // ---------------- Bridal Shower Robes ----------------
  p('bridal-shower-robes', 'bride-tulle-robe-and-satin-bridesmaid-robes', 'Bride Tulle Robe & Satin Bridesmaid Robes', 20000, 90000, 10,
    'A dramatic puff-sleeve tulle robe for the bride with matching satin robes for the girls.',
    { sizes: DRESS_SIZES, colors: ROBE_COLORS, featured: true,
      personalization: { available: true, enabled: true, label: 'Embroidered name or title on the back', placeholder: 'e.g. Bride · Maid of Honour · Adaeze', maxLength: 20 } }),
  p('bridal-shower-robes', 'champagne-satin-bridal-party-robes', 'Satin Bridal Party Robes', 15000, 35000, 7,
    'Silky satin robes for the whole bridal party, with a feathered tulle robe for the bride — pictured in champagne.',
    { sizes: DRESS_SIZES, colors: ROBE_COLORS,
      personalization: { available: true, enabled: true, label: 'Embroidered names (one per robe)', placeholder: 'e.g. Bride, Ima, Eno, Uduak', maxLength: 80 } }),
  p('bridal-shower-robes', 'feathered-tulle-bridal-party-robes', 'Feathered Tulle Bridal Party Robes', 25000, 60000, 10,
    'Sheer tulle robes trimmed with fluffy feathers for photos that pop — pictured in sky blue.',
    { sizes: DRESS_SIZES, colors: ROBE_COLORS }),

  // ---------------- Flower Girl Dresses ----------------
  p('flower-girl-dresses', 'tulle-ball-gown-flower-girl-dress', 'Tulle Ball Gown Flower Girl Dress', 35000, 75000, 12,
    'A full tulle ball gown with a beaded bodice and matching petal basket.',
    { sizes: GIRL_SIZES, colors: [WHITE, IVORY, BLUSH], featured: true }),
  p('flower-girl-dresses', 'satin-high-low-bow-flower-girl-dress', 'Satin High-Low Bow Flower Girl Dress', 35000, 70000, 12,
    'A clean satin dress with a high-low hem and a big bow at the back.',
    { sizes: GIRL_SIZES, colors: [WHITE, IVORY, CHAMPAGNE] }),
  p('flower-girl-dresses', 'lace-cap-sleeve-tulle-flower-girl-dress', 'Lace Cap-Sleeve Tulle Flower Girl Dress', 40000, 80000, 12,
    'A lace cap-sleeve bodice over layers of soft tulle, with a matching flower crown.',
    { sizes: GIRL_SIZES, colors: [WHITE, IVORY, BLUSH] }),

  // ---------------- Wedding Bouquets ----------------
  p('wedding-bouquets', 'white-rose-and-peony-bridal-bouquet', 'White Rose & Peony Bridal Bouquet', 30000, 70000, 7,
    'Silk white roses and peonies with baby\'s breath, finished in a pearl-trimmed satin wrap.',
    { colors: FLORAL_COLORS, featured: true }),
  p('wedding-bouquets', 'pearl-accented-white-rose-bouquet', 'Pearl-Accented White Rose Bouquet', 30000, 65000, 7,
    'White silk roses studded with pearls and soft greenery.',
    { colors: FLORAL_COLORS }),
  p('wedding-bouquets', 'pearl-hoop-bridal-bouquet', 'Pearl Hoop Bridal Bouquet', 25000, 55000, 6,
    'A modern hoop bouquet wrapped in pearls, lily of the valley and ribbon.',
    { colors: FLORAL_COLORS }),
  p('wedding-bouquets', 'satin-rose-brooch-bouquet', 'Satin Rose Brooch Bouquet', 35000, 75000, 8,
    'Hand-rolled satin roses set with crystal brooches and a pearl-wrapped handle.',
    { colors: FLORAL_COLORS }),
  p('wedding-bouquets', 'pearl-beaded-rose-bouquet', 'Pearl Beaded Rose Bouquet', 45000, 95000, 10,
    'Roses built entirely from hand-strung pearls — a keepsake bouquet that never wilts.',
    { colors: [WHITE, IVORY, CHAMPAGNE] }),
  p('wedding-bouquets', 'pearl-beaded-rose-arrangement', 'Pearl Beaded Rose Arrangement', 40000, 90000, 10,
    'Pearl-beaded roses in a glass vase for the reception table or as a gift that lasts.',
    { colors: [WHITE, IVORY, CHAMPAGNE] }),

  // ---------------- Wedding Veils ----------------
  p('wedding-veils', 'cathedral-lace-edge-veil', 'Cathedral Lace-Edge Veil', 45000, 100000, 12,
    'A floor-sweeping cathedral veil edged in embroidered lace.',
    { colors: [WHITE, IVORY, OFF_WHITE], featured: true,
      personalization: { available: true, enabled: true, label: 'Embroidered names or date on the edge', placeholder: 'e.g. Adaeze & Kufre · 14.02.2027', maxLength: 40 } }),
  p('wedding-veils', 'fingertip-lace-edge-veil', 'Fingertip Lace-Edge Veil', 20000, 45000, 8,
    'A single-tier fingertip veil with a scalloped lace edge.',
    { colors: [WHITE, IVORY, OFF_WHITE] }),

  // ---------------- Wedding Fascinators ----------------
  p('wedding-fascinators', 'crinoline-flower-fascinator-and-lace-gloves-set', 'Crinoline Flower Fascinator & Lace Gloves Set', 30000, 70000, 10,
    'A sheer crinoline flower headpiece with matching pearl-trimmed lace gloves.',
    { colors: [WHITE, IVORY, BLUSH] }),
  p('wedding-fascinators', 'sequin-pillbox-bridal-hat', 'Sequin Pillbox Bridal Hat', 25000, 60000, 10,
    'A sequinned pillbox hat with crinoline swirls and crystal flowers.',
    { colors: [WHITE, IVORY, SILVER, GOLD], featured: true }),
  p('wedding-fascinators', 'feathered-saucer-fascinator-hat', 'Feathered Saucer Fascinator Hat', 35000, 80000, 10,
    'A wide saucer hat finished with sweeping feathers — for brides, mums and wedding guests.',
    { colors: [IVORY, CHAMPAGNE, GOLD] }),
  p('wedding-fascinators', 'sculptural-couture-fascinator', 'Sculptural Couture Fascinator', 35000, 85000, 12,
    'A sculptural looped headpiece that makes a statement from every angle.',
    { colors: [IVORY, WHITE, GOLD] }),

  // ---------------- Wedding Hair Pins ----------------
  p('wedding-hair-pins', 'chiffon-flower-hair-comb-and-pin-set', 'Chiffon Flower Hair Comb & Pin Set', 10000, 25000, 5,
    'A three-piece set of chiffon flowers with pearl sprays — one comb, two pins.',
    { colors: [WHITE, IVORY, BLUSH] }),
  p('wedding-hair-pins', 'pearl-and-crystal-floral-hair-comb', 'Pearl & Crystal Floral Hair Comb', 12000, 30000, 5,
    'A gold-wired comb of silk flowers, freshwater pearls and crystals.',
    { colors: [WHITE, IVORY, GOLD], featured: true }),
  p('wedding-hair-pins', 'white-rose-hair-pins-set', 'White Rose Hair Pins Set', 8000, 20000, 4,
    'Silk white roses with gold accents on hair pins — sold as a set.',
    { colors: [WHITE, IVORY, BLUSH] }),
  p('wedding-hair-pins', 'pearl-cluster-hair-pins-set', 'Pearl Cluster Hair Pins Set', 8000, 20000, 4,
    'Gold U-pins topped with clusters of pearls — sold as a set.',
    { colors: [WHITE, IVORY, GOLD] }),

  // ---------------- Wedding Hand Fans ----------------
  p('wedding-fans', 'personalized-white-feather-bridal-fan', 'Personalized White Feather Bridal Fan', 25000, 50000, 7,
    'A full white feather fan with your new name in gold beadwork at the centre.',
    { colors: [WHITE, IVORY, GOLD], featured: true,
      personalization: { available: true, enabled: true, label: 'Name on the fan', placeholder: 'e.g. Mrs Enoh', maxLength: 16 } }),
  p('wedding-fans', 'personalized-aso-oke-traditional-fan', 'Personalized Aso-Oke Traditional Fan', 20000, 45000, 7,
    'A traditional hand fan in aso-oke with crystal edging and your names in gold — pictured in pink.',
    { colors: [BURNT_ORANGE, GOLD, EMERALD, DUSTY_PINK, NAVY],
      personalization: { available: true, enabled: true, label: 'Names on the fan', placeholder: 'e.g. Aya & Moses', maxLength: 24 } }),
  p('wedding-fans', 'bride-feather-folding-fan', 'Bride Feather Folding Fan', 20000, 40000, 6,
    'A folding feather fan lettered "Bride" in pearls — perfect for photos.',
    { colors: [WHITE, IVORY, BLUSH],
      personalization: { available: true, enabled: true, label: 'Word on the fan', placeholder: 'e.g. Bride · Mrs', maxLength: 12 } }),
  p('wedding-fans', 'flower-shaped-traditional-hand-fan', 'Flower-Shaped Traditional Hand Fan', 15000, 35000, 6,
    'A petal-shaped organza fan with a beaded centre and tassel — pictured in yellow.',
    { colors: [MUSTARD, BURNT_ORANGE, EMERALD, GOLD, RED] }),
  p('wedding-fans', 'feather-folding-fans-bridesmaid-set', 'Feather Folding Fans — Bridesmaid Set', 15000, 30000, 6,
    'Soft feather folding fans for the bridesmaids, priced per fan.',
    { colors: [WHITE, IVORY, BLUSH, BURNT_ORANGE] }),
  p('wedding-fans', 'gold-trim-feather-bridal-fan', 'Gold-Trim Feather Bridal Fan', 25000, 50000, 7,
    'A white feather fan framed in gold lace with your new name across the front.',
    { colors: [WHITE, IVORY],
      personalization: { available: true, enabled: true, label: 'Name on the fan', placeholder: 'e.g. Mrs Amosah', maxLength: 16 } }),

  // ---------------- Wedding Purses ----------------
  p('wedding-purses', 'crystal-beaded-pearl-handle-bridal-bag', 'Crystal Beaded Bridal Bag with Pearl Handle', 30000, 70000, 10,
    'A hand-beaded crystal bag with a woven pearl handle.',
    { colors: [WHITE, IVORY, CHAMPAGNE, GOLD], featured: true }),
  p('wedding-purses', 'floral-pomander-bridal-purse', 'Floral Pomander Bridal Purse', 25000, 55000, 7,
    'A pomander of silk blooms on a pearl wristlet — a bag and bouquet in one.',
    { colors: FLORAL_COLORS }),
  p('wedding-purses', 'pearl-beaded-ring-handle-purse', 'Pearl Beaded Ring-Handle Purse', 30000, 65000, 10,
    'A fully pearl-beaded purse with gold ring handles and a satin lining.',
    { colors: [WHITE, IVORY, CHAMPAGNE] }),

  // ---------------- Petticoats & Hoop Skirts ----------------
  p('bridal-petticoats', 'five-tier-ruffle-petticoat', 'Five-Tier Ruffle Petticoat', 20000, 45000, 7,
    'Five tiers of ruffled tulle for a full, soft ball gown shape.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY], featured: true }),
  p('bridal-petticoats', 'short-tulle-petticoat', 'Short Tulle Petticoat', 12000, 25000, 5,
    'A knee-length tulle petticoat for short and tea-length dresses.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY] }),
  p('bridal-petticoats', 'ruffled-hoop-petticoat', 'Ruffled Hoop Petticoat', 22000, 48000, 7,
    'Boned hoops under layers of ruffles for maximum volume without the weight.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY] }),
  p('bridal-petticoats', 'tea-length-a-line-petticoat', 'Tea-Length A-Line Petticoat', 15000, 30000, 5,
    'A soft A-line petticoat that adds gentle body under midi and tea-length skirts.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY] }),
  p('bridal-petticoats', 'six-hoop-ball-gown-petticoat', 'Six-Hoop Ball Gown Petticoat', 20000, 45000, 6,
    'A six-hoop crinoline for the fullest ball gowns.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY] }),
  p('bridal-petticoats', 'fish-gown-train-petticoat', 'Fish Gown Train Petticoat', 18000, 40000, 6,
    'A fitted petticoat that flares at the knee to support fish gowns and trains.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY] }),
  p('bridal-petticoats', 'layered-tulle-full-petticoat', 'Layered Tulle Full Petticoat', 20000, 45000, 7,
    'Layers of stiff tulle for a full, hoop-free skirt shape.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY] }),
  p('bridal-petticoats', 'three-hoop-petticoat', 'Three-Hoop Petticoat', 15000, 35000, 5,
    'A light three-hoop crinoline for A-line and princess gowns.',
    { sizes: PETTICOAT_SIZES, colors: [WHITE, IVORY] }),
];

// Rules that apply to every wedding gown: the three colourways we sew, delivery
// time that grows with quantity (each gown is a full round of handwork), and
// the materials disclaimer shoppers must see before ordering.
const GOWN_COLORS = [SILVER, OFF_WHITE, WHITE];
for (const gown of PRODUCTS) {
  if (gown.categorySlug === 'wedding-gowns') {
    gown.colors = GOWN_COLORS;
    gown.productionScalesWithQuantity = true;
    gown.details = [
      ...gown.details,
      'Sewn in silver, off-white or white',
      'Ordering more than one? Each gown adds its full make time to delivery',
      'Please note: you may receive an item of similar but not exact material',
    ];
  }
}
