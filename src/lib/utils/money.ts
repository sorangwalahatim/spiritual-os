/**
 * Money utilities adhering to minor unit integer storage and ISO currency formatting
 */

export function formatMoney(amountCents: number, currency: string = 'INR'): string {
  const amount = amountCents / 100;
  
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function parseMoneyToCents(amountString: string): number {
  const numeric = parseFloat(amountString.replace(/[^0-9.-]+/g, ''));
  if (isNaN(numeric)) return 0;
  return Math.round(numeric * 100);
}
