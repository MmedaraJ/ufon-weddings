import { Category, Product, ShippingLocations } from './types';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || 'Something went wrong. Please try again.');
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
};
