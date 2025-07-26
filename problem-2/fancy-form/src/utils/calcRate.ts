
export function calcRate(fromCurrency: number, toCurrency: number): string {
    if (fromCurrency <= 0 || toCurrency <= 0) {
        return "0.00";
    }
    
    const rate = (fromCurrency / toCurrency).toFixed(6);
    return rate;
}