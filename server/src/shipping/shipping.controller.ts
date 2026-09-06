import { Controller, Get } from '@nestjs/common';
import { SAFETY_BUFFER_DAYS, SHIPPING_ORIGIN, SHIPPING_RATES } from '../data/shipping';

@Controller('shipping')
export class ShippingController {
  // States, cities and delivery-day estimates for the order request page.
  // Fees are agreed on WhatsApp, so they stay behind the scenes.
  @Get('locations')
  locations() {
    return {
      origin: SHIPPING_ORIGIN,
      safetyBufferDays: SAFETY_BUFFER_DAYS,
      states: SHIPPING_RATES.map((r) => ({
        state: r.state,
        days: r.days,
        cities: r.cities.map((city) => ({ city, days: r.cityOverrides?.[city]?.days ?? r.days })),
      })),
    };
  }
}
