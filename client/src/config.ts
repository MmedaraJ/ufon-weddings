// Business WhatsApp number — digits only, country code first (08023161031 → 234…).
export const WHATSAPP_NUMBER = '2348023161031';

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const BRAND = {
  name: 'Ufon Weddings',
  origin: 'Akwa Ibom, Nigeria',
  email: 'hello@ufonweddings.com', // TODO: real email
};
