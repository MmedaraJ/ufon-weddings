import { Body, Controller, Get, Headers, HttpCode, Post, Query, RawBodyRequest, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { CreateOrderRequest, QuoteRequest } from '../common/types';
import { OrdersService } from './orders.service';
import { PaystackService } from './paystack.service';
import { QuoteService } from './quote.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly quoteService: QuoteService,
  ) {}

  // Priced cart + shipping + delivery estimate. Used by the cart page (no
  // location yet) and the checkout page (with state/city/event date).
  @Post('quote')
  quote(@Body() body: QuoteRequest) {
    return this.quoteService.buildQuote(body.items, body.state, body.city, body.eventDate);
  }

  @Post()
  create(@Body() body: CreateOrderRequest) {
    return this.ordersService.create(body);
  }

  @Get('verify')
  verify(@Query('reference') reference: string) {
    return this.ordersService.verify(reference ?? '');
  }
}

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paystack: PaystackService,
  ) {}

  @Post('paystack')
  @HttpCode(200)
  paystackWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-paystack-signature') signature: string,
    @Body() body: any,
  ) {
    if (!this.paystack.isValidWebhookSignature(req.rawBody, signature)) {
      throw new UnauthorizedException('Invalid signature');
    }
    if (body?.event === 'charge.success' && body?.data?.reference) {
      this.ordersService.markPaid(body.data.reference);
    }
    return { received: true };
  }
}
