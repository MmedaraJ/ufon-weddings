import { Module } from '@nestjs/common';
import { CatalogController } from './catalog/catalog.controller';
import { OrdersController, WebhooksController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { PaystackService } from './orders/paystack.service';
import { QuoteService } from './orders/quote.service';
import { ShippingController } from './shipping/shipping.controller';

@Module({
  controllers: [CatalogController, ShippingController, OrdersController, WebhooksController],
  providers: [QuoteService, PaystackService, OrdersService],
})
export class AppModule {}
