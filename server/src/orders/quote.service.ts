import { BadRequestException, Injectable } from '@nestjs/common';
import { PRODUCTS } from '../data/products';
import { rateFor, SAFETY_BUFFER_DAYS } from '../data/shipping';
import { CartItemInput, EventDateStatus, Quote, QuotedItem } from '../common/types';

const MAX_QUANTITY_PER_ITEM = 50;

@Injectable()
export class QuoteService {
  buildQuote(items: CartItemInput[], state?: string, city?: string, eventDate?: string): Quote {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    const quotedItems: QuotedItem[] = items.map((item) => this.quoteItem(item));
    const subtotal = quotedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const productionDays = Math.max(...quotedItems.map((i) => i.productionDays));

    let shipping: Quote['shipping'] = null;
    if (state && city) {
      const rate = rateFor(state, city);
      if (!rate) throw new BadRequestException(`We do not ship to "${city}, ${state}" yet.`);
      shipping = { state, city, fee: rate.fee, days: rate.days };
    }

    let estimatedDeliveryDate: string | null = null;
    let eventDateStatus: EventDateStatus | null = null;
    if (shipping) {
      const eta = new Date();
      eta.setDate(eta.getDate() + productionDays + shipping.days);
      eta.setHours(0, 0, 0, 0); // compare whole days against the event date
      const pad = (x: number) => String(x).padStart(2, '0');
      estimatedDeliveryDate = `${eta.getFullYear()}-${pad(eta.getMonth() + 1)}-${pad(eta.getDate())}`;

      if (eventDate) {
        const event = new Date(`${eventDate}T00:00:00`);
        if (!Number.isNaN(event.getTime())) {
          const safe = new Date(eta);
          safe.setDate(safe.getDate() + SAFETY_BUFFER_DAYS);
          if (event.getTime() >= safe.getTime()) eventDateStatus = 'comfortable';
          else if (event.getTime() >= eta.getTime()) eventDateStatus = 'tight';
          else eventDateStatus = 'late';
        }
      }
    }

    return {
      items: quotedItems,
      subtotal,
      shipping,
      total: subtotal + (shipping?.fee ?? 0),
      productionDays,
      estimatedDeliveryDate,
      eventDate: eventDate ?? null,
      eventDateStatus,
    };
  }

  private quoteItem(item: CartItemInput): QuotedItem {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) throw new BadRequestException(`Unknown product: ${item.productId}`);

    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      throw new BadRequestException(`Invalid quantity for ${product.name}.`);
    }
    if (item.size && !(product.sizes ?? []).includes(item.size)) {
      throw new BadRequestException(`Invalid size for ${product.name}.`);
    }
    if (item.color && !(product.colors ?? []).some((c) => c.name === item.color)) {
      throw new BadRequestException(`Invalid color for ${product.name}.`);
    }

    let personalizationText: string | undefined;
    let personalizationFee = 0;
    const text = item.personalizationText?.trim();
    if (text) {
      const config = product.personalization;
      if (!config?.enabled) {
        throw new BadRequestException(`${product.name} cannot be personalized.`);
      }
      if (text.length > config.maxLength) {
        throw new BadRequestException(
          `Personalization for ${product.name} must be ${config.maxLength} characters or fewer.`,
        );
      }
      personalizationText = text;
      personalizationFee = config.fee;
    }

    return {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      quantity,
      size: item.size,
      color: item.color,
      personalizationText,
      unitPrice: product.price,
      personalizationFee,
      lineTotal: (product.price + personalizationFee) * quantity,
      productionDays: product.productionDays,
    };
  }
}
