// Writes the catalog to client/public/data/*.json so the storefront can run as
// a fully static site (GitHub Pages) with no API. Run after `npm run build`.
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { publicProduct } from './catalog/catalog.controller';
import { CATEGORIES } from './data/categories';
import { PRODUCTS } from './data/products';
import { SAFETY_BUFFER_DAYS, SHIPPING_ORIGIN, SHIPPING_RATES } from './data/shipping';

const out = join(__dirname, '..', '..', 'client', 'public', 'data');
mkdirSync(out, { recursive: true });

const categories = CATEGORIES.map((c) => ({
  ...c,
  productCount: PRODUCTS.filter((p) => p.categorySlug === c.slug).length,
}));
const products = PRODUCTS.map((p) => ({
  ...publicProduct(p),
  category: CATEGORIES.find((c) => c.slug === p.categorySlug),
}));
const shipping = {
  origin: SHIPPING_ORIGIN,
  safetyBufferDays: SAFETY_BUFFER_DAYS,
  states: SHIPPING_RATES.map((r) => ({
    state: r.state,
    days: r.days,
    cities: r.cities.map((city) => ({ city, days: r.cityOverrides?.[city]?.days ?? r.days })),
  })),
};

writeFileSync(join(out, 'categories.json'), JSON.stringify(categories));
writeFileSync(join(out, 'products.json'), JSON.stringify(products));
writeFileSync(join(out, 'shipping.json'), JSON.stringify(shipping));
console.log(`Exported ${categories.length} categories, ${products.length} products to ${out}`);
