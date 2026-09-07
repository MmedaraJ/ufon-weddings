export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

/**
 * Personalization config for a product (e.g. embroidered names).
 * - `available`: the product can physically take personalization.
 * - `enabled`: actually shown on the storefront. Flip to true to launch it.
 */
export interface Personalization {
  available: boolean;
  enabled: boolean;
  label: string;
  placeholder: string;
  maxLength: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  // Prices are indicative ranges (NGN); the final quote is agreed on WhatsApp.
  priceMin: number;
  priceMax: number;
  shortDescription: string;
  description: string;
  details: string[];
  images: string[];
  productionDays: number; // days to handcraft one of this item
  // When true (e.g. wedding gowns), production time multiplies by quantity;
  // each extra piece adds a full round of handwork.
  productionScalesWithQuantity?: boolean;
  sizes?: string[];
  colors?: ProductColor[];
  personalization?: Personalization;
  featured?: boolean;
}

export interface CityRate {
  fee?: number;
  days?: number;
}

export interface StateShipping {
  state: string;
  fee: number; // NGN, default for the state (kept for future use; not shown on site)
  days: number; // delivery days from Eket, buffer already included
  cities: string[];
  cityOverrides?: Record<string, CityRate>;
}
