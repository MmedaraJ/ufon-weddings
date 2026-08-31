// TODO: replace with the real business WhatsApp number (digits only, country code first).
export const WHATSAPP_NUMBER = '2348000000000';

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const BRAND = {
  name: 'Ufon Weddings',
  origin: 'Akwa Ibom, Nigeria',
  email: 'hello@ufonweddings.com', // TODO: real email
};
