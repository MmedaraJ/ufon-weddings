import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateOrderRequest, Order } from '../common/types';
import { PaystackService } from './paystack.service';
import { QuoteService } from './quote.service';

// In-memory store — enough for sample products. Replace with a database table
// when the catalog moves off static files.
@Injectable()
export class OrdersService {
  private readonly orders = new Map<string, Order>();

  constructor(
    private readonly quoteService: QuoteService,
    private readonly paystack: PaystackService,
  ) {}

  private clientUrl(): string {
    return (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  }

  async create(request: CreateOrderRequest): Promise<{ reference: string; authorizationUrl: string; mock: boolean }> {
    const c = request.customer;
    for (const [field, label] of [
      [c?.fullName, 'full name'],
      [c?.phone, 'phone number'],
      [c?.email, 'email'],
      [c?.address, 'delivery address'],
      [c?.state, 'state'],
      [c?.city, 'city'],
    ] as const) {
      if (!field || !String(field).trim()) {
        throw new BadRequestException(`Please provide your ${label}.`);
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) {
      throw new BadRequestException('Please provide a valid email address.');
    }

    const quote = this.quoteService.buildQuote(request.items, c.state, c.city, c.eventDate);
    const reference = `UFW-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;

    const order: Order = {
      reference,
      createdAt: new Date().toISOString(),
      status: 'pending_payment',
      mock: this.paystack.mockMode,
      customer: { ...c, orderNotes: c.orderNotes?.trim().slice(0, 1000) },
      quote,
    };
    this.orders.set(reference, order);

    if (this.paystack.mockMode) {
      return {
        reference,
        mock: true,
        authorizationUrl: `${this.clientUrl()}/order/confirm?reference=${reference}&mock=1`,
      };
    }

    const { authorizationUrl } = await this.paystack.initializeTransaction({
      email: c.email,
      amountNaira: quote.total,
      reference,
      callbackUrl: `${this.clientUrl()}/order/confirm`,
    });
    return { reference, mock: false, authorizationUrl };
  }

  async verify(reference: string): Promise<Order> {
    const order = this.orders.get(reference);
    if (!order) throw new NotFoundException('Order not found.');
    if (order.status === 'paid') return order;

    if (order.mock) {
      order.status = 'paid'; // mock mode: treat the redirect back as success
    } else {
      order.status = (await this.paystack.verifyTransaction(reference)) ? 'paid' : order.status;
    }
    return order;
  }

  markPaid(reference: string): void {
    const order = this.orders.get(reference);
    if (order) order.status = 'paid';
  }
}
