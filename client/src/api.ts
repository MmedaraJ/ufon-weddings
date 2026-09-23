import { Category, Product, ShippingLocations } from './types';

// The storefront reads static JSON exported from server/src/data at build time
// (see server/src/export-static.ts), so it can be hosted anywhere as plain files.
export const BASE = import.meta.env.BASE_URL; // '/' locally, '/ufon-weddings/' on GitHub Pages

// Absolute asset paths in the data ('/images/...') need the base prefix.
export function asset(path: string): string {
  return path.startsWith('/') ? BASE + path.slice(1) : path;
}

const cache = new Map<string, Promise<unknown>>();
function load<T>(name: string): Promise<T> {
  if (!cache.has(name)) {
    cache.set(
      name,
      fetch(`${BASE}data/${name}.json`).then((res) => {
        if (!res.ok) throw new Error('Could not load the catalog. Please refresh.');
        return res.json();
      }),
    );
  }
  return cache.get(name) as Promise<T>;
}

const notFound = (what: string) => Promise.reject(new Error(`${what} not found`));

export const api = {
  categories: () => load<Category[]>('categories'),
  category: async (slug: string) => {
    const [categories, products] = await Promise.all([load<Category[]>('categories'), load<Product[]>('products')]);
    const category = categories.find((c) => c.slug === slug);
    if (!category) return notFound('Category');
    return { ...category, products: products.filter((p) => p.categorySlug === slug) };
  },
  products: async (opts?: { featured?: boolean }) => {
    const products = await load<Product[]>('products');
    return opts?.featured ? products.filter((p) => p.featured) : products;
  },
  product: async (slug: string) => {
    const product = (await load<Product[]>('products')).find((p) => p.slug === slug);
    return product ?? notFound('Product');
  },
  shippingLocations: () => load<ShippingLocations>('shipping'),
};
