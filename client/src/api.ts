import { Category, Order, Product, Quote, ShippingLocations } from './types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message || 'Something went wrong. Please try again.');
  }
  return body as T;
}

export const api = {
  categories: () => request<Category[]>('/categories'),
  category: (slug: string) => request<Category & { products: Product[] }>(`/categories/${slug}`),
  products: (opts?: { featured?: boolean }) =>
    request<Product[]>(`/products${opts?.featured ? '?featured=true' : ''}`),
  product: (slug: string) => request<Product>(`/products/${slug}`),
  shippingLocations: () => request<ShippingLocations>('/shipping/locations'),
  quote: (payload: unknown) =>
    request<Quote>('/orders/quote', { method: 'POST', body: JSON.stringify(payload) }),
  createOrder: (payload: unknown) =>
    request<{ reference: string; authorizationUrl: string; mock: boolean }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  verifyOrder: (reference: string) =>
    request<Order>(`/orders/verify?reference=${encodeURIComponent(reference)}`),
};
