export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  productCount?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

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
  priceMin: number;
  priceMax: number;
  shortDescription: string;
  description: string;
  details: string[];
  images: string[];
  productionDays: number;
  productionScalesWithQuantity?: boolean;
  sizes?: string[];
  colors?: ProductColor[];
  personalization?: Personalization;
  featured?: boolean;
  category?: Category;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceMin: number;
  priceMax: number;
  quantity: number;
  size?: string;
  color?: string;
  personalizationText?: string;
  notes?: string;
  productionDays: number;
  productionScalesWithQuantity?: boolean;
}

export interface ShippingLocations {
  origin: string;
  safetyBufferDays: number;
  states: { state: string; days: number; cities: { city: string; days: number }[] }[];
}
