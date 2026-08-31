import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, Product } from './types';

const STORAGE_KEY = 'ufon-cart-v1';

// Same product with a different size/color/personalization is a separate line.
export function cartKey(i: Pick<CartItem, 'productId' | 'size' | 'color' | 'personalizationText'>): string {
  return [i.productId, i.size ?? '', i.color ?? '', i.personalizationText ?? ''].join('|');
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, opts: { quantity: number; size?: string; color?: string; personalizationText?: string }) => void;
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
    const subtotal = items.reduce((sum, i) => sum + (i.price + i.personalizationFee) * i.quantity, 0);
    return {
      items,
      count,
      subtotal,
      addItem: (product, opts) => {
        const text = opts.personalizationText?.trim() || undefined;
        const newItem: CartItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          quantity: opts.quantity,
          size: opts.size,
          color: opts.color,
          personalizationText: text,
          personalizationFee: text ? product.personalization?.fee ?? 0 : 0,
          productionDays: product.productionDays,
        };
        setItems((prev) => {
          const key = cartKey(newItem);
          const existing = prev.find((i) => cartKey(i) === key);
          if (existing) {
            return prev.map((i) =>
              cartKey(i) === key ? { ...i, quantity: Math.min(50, i.quantity + opts.quantity) } : i,
            );
          }
          return [...prev, newItem];
        });
      },
      updateQuantity: (key, quantity) =>
        setItems((prev) =>
          prev
            .map((i) => (cartKey(i) === key ? { ...i, quantity: Math.max(0, Math.min(50, quantity)) } : i))
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
