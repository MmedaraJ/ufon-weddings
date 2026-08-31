import { StateShipping } from '../common/types';

// All orders ship from our studio in Uyo, Akwa Ibom.
// `days` is a delivery estimate that ALREADY includes buffer time for Nigerian
// logistics — do not promise faster than this. Fees are NGN.
export const SHIPPING_ORIGIN = 'Uyo, Akwa Ibom, Nigeria';

// Extra safety margin added on top of production + shipping when we compare
// against a customer's event date.
export const SAFETY_BUFFER_DAYS = 3;

const s = (state: string, fee: number, days: number, cities: string[]): StateShipping => ({
  state,
  fee,
  days,
  cities,
});

export const SHIPPING_RATES: StateShipping[] = [
  // Home state — cheapest and fastest
  {
    ...s('Akwa Ibom', 1500, 2, ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Abak']),
    cityOverrides: { Uyo: { fee: 1000, days: 1 } },
  },

  // Neighbouring states
  s('Cross River', 2500, 3, ['Calabar', 'Ugep', 'Ikom', 'Ogoja']),
  s('Rivers', 2500, 3, ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Eleme']),
  s('Abia', 2500, 3, ['Aba', 'Umuahia', 'Ohafia']),

  // South-South / South-East
  s('Bayelsa', 3000, 4, ['Yenagoa', 'Ogbia', 'Sagbama']),
  s('Delta', 3000, 4, ['Warri', 'Asaba', 'Sapele', 'Ughelli']),
  s('Edo', 3000, 4, ['Benin City', 'Auchi', 'Ekpoma']),
  s('Imo', 3000, 4, ['Owerri', 'Orlu', 'Okigwe']),
  s('Anambra', 3000, 4, ['Awka', 'Onitsha', 'Nnewi']),
  s('Enugu', 3000, 4, ['Enugu', 'Nsukka', 'Oji River']),
  s('Ebonyi', 3000, 4, ['Abakaliki', 'Afikpo', 'Onueke']),

  // Major hubs
  s('Lagos', 3500, 4, ['Ikeja', 'Lekki', 'Victoria Island', 'Surulere', 'Ikorodu', 'Yaba']),
  s('FCT (Abuja)', 3500, 4, ['Abuja Municipal', 'Gwagwalada', 'Kuje', 'Bwari']),

  // South-West & North-Central
  s('Ogun', 4000, 5, ['Abeokuta', 'Ijebu Ode', 'Sagamu', 'Ota']),
  s('Oyo', 4000, 5, ['Ibadan', 'Ogbomoso', 'Oyo', 'Iseyin']),
  s('Osun', 4000, 5, ['Osogbo', 'Ile-Ife', 'Ilesa']),
  s('Ondo', 4000, 5, ['Akure', 'Ondo', 'Owo']),
  s('Ekiti', 4000, 5, ['Ado-Ekiti', 'Ikere', 'Ise-Ekiti']),
  s('Kwara', 4000, 5, ['Ilorin', 'Offa', 'Omu-Aran']),
  s('Kogi', 4000, 5, ['Lokoja', 'Okene', 'Anyigba']),
  s('Benue', 4000, 5, ['Makurdi', 'Gboko', 'Otukpo']),
  s('Nasarawa', 4000, 5, ['Lafia', 'Keffi', 'Akwanga']),
  s('Niger', 4000, 5, ['Minna', 'Suleja', 'Bida']),
  s('Plateau', 4000, 5, ['Jos', 'Bukuru', 'Pankshin']),

  // North
  s('Kaduna', 5000, 7, ['Kaduna', 'Zaria', 'Kafanchan']),
  s('Kano', 5000, 7, ['Kano', 'Wudil', 'Rano']),
  s('Katsina', 5000, 7, ['Katsina', 'Funtua', 'Daura']),
  s('Bauchi', 5000, 7, ['Bauchi', 'Azare', 'Misau']),
  s('Gombe', 5000, 7, ['Gombe', 'Kumo', 'Billiri']),
  s('Adamawa', 5000, 7, ['Yola', 'Mubi', 'Numan']),
  s('Taraba', 5000, 7, ['Jalingo', 'Wukari', 'Bali']),
  s('Jigawa', 5000, 7, ['Dutse', 'Hadejia', 'Gumel']),
  s('Zamfara', 5000, 7, ['Gusau', 'Kaura Namoda', 'Talata Mafara']),
  s('Sokoto', 5000, 7, ['Sokoto', 'Tambuwal', 'Bodinga']),
  s('Kebbi', 5000, 7, ['Birnin Kebbi', 'Argungu', 'Yauri']),
  s('Yobe', 5000, 7, ['Damaturu', 'Potiskum', 'Gashua']),
  s('Borno', 5000, 7, ['Maiduguri', 'Biu', 'Bama']),
];

export function findStateRate(state: string): StateShipping | undefined {
  return SHIPPING_RATES.find((r) => r.state.toLowerCase() === state.toLowerCase());
}

export function rateFor(state: string, city: string): { fee: number; days: number } | null {
  const stateRate = findStateRate(state);
  if (!stateRate) return null;
  const override = stateRate.cityOverrides?.[city];
  return {
    fee: override?.fee ?? stateRate.fee,
    days: override?.days ?? stateRate.days,
  };
}
