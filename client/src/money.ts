const formatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export function naira(amount: number): string {
  return formatter.format(amount);
}

// Prices on the site are indicative ranges; the final quote is agreed on WhatsApp.
export function nairaRange(min: number, max: number): string {
  return min === max ? naira(min) : `${naira(min)} – ${naira(max)}`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
