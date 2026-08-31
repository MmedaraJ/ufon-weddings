import { Controller, Get } from '@nestjs/common';
import { SAFETY_BUFFER_DAYS, SHIPPING_ORIGIN, SHIPPING_RATES } from '../data/shipping';

@Controller('shipping')
export class ShippingController {
  // States and cities for the checkout dropdowns. Fees/days stay behind the
  // scenes; the client gets them through the quote endpoint.
  @Get('locations')
  locations() {
    return {
      origin: SHIPPING_ORIGIN,
      safetyBufferDays: SAFETY_BUFFER_DAYS,
      states: SHIPPING_RATES.map((r) => ({ state: r.state, cities: r.cities })),
    };
  }
}
