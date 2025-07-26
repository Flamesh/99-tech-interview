export function formatNumber(value: number): number {
  return Math.round(value * 100000) / 100000; // Round to 6 decimal places
}

export function calcRate(fromCurrency: number, toCurrency: number): number {
  if (fromCurrency <= 0 || toCurrency <= 0) {
    return 0;
  }

  const rate = fromCurrency / toCurrency;
  return formatNumber(rate); // Round to 6 decimal places if needed
}
