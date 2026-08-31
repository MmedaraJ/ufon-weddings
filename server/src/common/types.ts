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
 * Personalization config for a product.
 * - `available`: the product can physically take personalization (kept for
 *   products we can't offer yet, e.g. engraving before we own the machine).
 * - `enabled`: actually shown on the storefront. Flip to true to launch it.
 */
export interface Personalization {
  available: boolean;
  enabled: boolean;
  label: string;
  placeholder: string;
  maxLength: number;
  fee: number; // NGN, added per item when personalization text is provided
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number; // NGN
  shortDescription: string;
  description: string;
  details: string[];
  images: string[];
  productionDays: number; // days to handcraft one order of this item
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
  fee: number; // NGN, default for the state
  days: number; // delivery days from Uyo, buffer already included
  cities: string[];
  cityOverrides?: Record<string, CityRate>;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  personalizationText?: string;
}

export interface QuoteRequest {
  items: CartItemInput[];
  state?: string;
  city?: string;
  eventDate?: string; // ISO date
}

export interface QuotedItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  personalizationText?: string;
  unitPrice: number;
  personalizationFee: number;
  lineTotal: number;
  productionDays: number;
}

export type EventDateStatus = 'comfortable' | 'tight' | 'late';

export interface Quote {
  items: QuotedItem[];
  subtotal: number;
  shipping: { state: string; city: string; fee: number; days: number } | null;
  total: number;
  productionDays: number;
  estimatedDeliveryDate: string | null; // ISO date, null until a location is chosen
  eventDate: string | null;
  eventDateStatus: EventDateStatus | null;
}

export interface CustomerInput {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  city: string;
  eventDate?: string;
  orderNotes?: string;
}

export interface CreateOrderRequest {
  items: CartItemInput[];
  customer: CustomerInput;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'failed';

export interface Order {
  reference: string;
  createdAt: string;
  status: OrderStatus;
  mock: boolean;
  customer: CustomerInput;
  quote: Quote;
}
