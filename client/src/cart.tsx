import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, Product } from './types';

const STORAGE_KEY = 'ufon-cart-v2';
const MAX_QTY = 50;

// Same product with different size/colour/personalization/notes is a separate line.
export function cartKey(i: Pick<CartItem, 'productId' | 'size' | 'color' | 'personalizationText' | 'notes'>): string {
  return [i.productId, i.size ?? '', i.color ?? '', i.personalizationText ?? '', i.notes ?? ''].join('|');
}

export interface AddOptions {
  quantity: number;
  size?: string;
  color?: string;
  personalizationText?: string;
  notes?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  totalMin: number;
  totalMax: number;
  longestProductionDays: number;
  addItem: (product: Product, opts: AddOptions) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function itemProductionDays(i: CartItem): number {
  return i.productionDays * (i.productionScalesWithQuantity ? i.quantity : 1);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode) — cart just won't persist
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalMin = items.reduce((sum, i) => sum + i.priceMin * i.quantity, 0);
    const totalMax = items.reduce((sum, i) => sum + i.priceMax * i.quantity, 0);
    const longestProductionDays = items.length ? Math.max(...items.map(itemProductionDays)) : 0;
    return {
      items,
      count,
      totalMin,
      totalMax,
      longestProductionDays,
      addItem: (product, opts) => {
        const newItem: CartItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          priceMin: product.priceMin,
          priceMax: product.priceMax,
          quantity: opts.quantity,
          size: opts.size,
          color: opts.color,
          personalizationText: opts.personalizationText?.trim() || undefined,
          notes: opts.notes?.trim() || undefined,
          productionDays: product.productionDays,
          productionScalesWithQuantity: product.productionScalesWithQuantity,
        };
        setItems((prev) => {
          const key = cartKey(newItem);
          const existing = prev.find((i) => cartKey(i) === key);
          if (existing) {
            return prev.map((i) =>
              cartKey(i) === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + opts.quantity) } : i,
            );
          }
          return [...prev, newItem];
        });
      },
      updateQuantity: (key, quantity) =>
        setItems((prev) =>
          prev
            .map((i) => (cartKey(i) === key ? { ...i, quantity: Math.max(0, Math.min(MAX_QTY, quantity)) } : i))
            .filter((i) => i.quantity > 0),
        ),
      removeItem: (key) => setItems((prev) => prev.filter((i) => cartKey(i) !== key)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
