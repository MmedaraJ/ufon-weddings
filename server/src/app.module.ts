import { Module } from '@nestjs/common';
import { CatalogController } from './catalog/catalog.controller';
import { ShippingController } from './shipping/shipping.controller';

@Module({
  controllers: [CatalogController, ShippingController],
})
export class AppModule {}
