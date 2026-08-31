import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

const PAYSTACK_BASE = 'https://api.paystack.co';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);

  get secretKey(): string | undefined {
    return process.env.PAYSTACK_SECRET_KEY || undefined;
  }

  // Without a secret key we run in mock mode so the whole checkout flow can be
  // exercised end-to-end before the Paystack account is wired up.
  get mockMode(): boolean {
    return !this.secretKey;
  }

  async initializeTransaction(params: {
    email: string;
    amountNaira: number;
    reference: string;
    callbackUrl: string;
  }): Promise<{ authorizationUrl: string }> {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amountNaira * 100), // Paystack expects kobo
        reference: params.reference,
        currency: 'NGN',
        callback_url: params.callbackUrl,
      }),
    });
    const body = (await res.json()) as any;
    if (!res.ok || !body?.status || !body?.data?.authorization_url) {
      this.logger.error(`Paystack initialize failed: ${JSON.stringify(body)}`);
      throw new ServiceUnavailableException('Could not start payment. Please try again.');
    }
    return { authorizationUrl: body.data.authorization_url };
  }

  async verifyTransaction(reference: string): Promise<boolean> {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    const body = (await res.json()) as any;
    return Boolean(res.ok && body?.status && body?.data?.status === 'success');
  }

  isValidWebhookSignature(rawBody: Buffer | undefined, signature: string | undefined): boolean {
    if (!rawBody || !signature || !this.secretKey) return false;
    const expected = createHmac('sha512', this.secretKey).update(rawBody).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
