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
  fee: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  shortDescription: string;
  description: string;
  details: string[];
  images: string[];
  productionDays: number;
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
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  personalizationText?: string;
  personalizationFee: number;
  productionDays: number;
}

export interface StateLocations {
  state: string;
  cities: string[];
}

export interface ShippingLocations {
  origin: string;
  safetyBufferDays: number;
  states: StateLocations[];
}

export type EventDateStatus = 'comfortable' | 'tight' | 'late';

export interface Quote {
  items: {
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
  }[];
  subtotal: number;
  shipping: { state: string; city: string; fee: number; days: number } | null;
  total: number;
  productionDays: number;
  estimatedDeliveryDate: string | null;
  eventDate: string | null;
  eventDateStatus: EventDateStatus | null;
}

export interface Order {
  reference: string;
  createdAt: string;
  status: 'pending_payment' | 'paid' | 'failed';
  mock: boolean;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    state: string;
    city: string;
    eventDate?: string;
    orderNotes?: string;
  };
  quote: Quote;
}
