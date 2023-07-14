export function getNormalizedTokenAmount(amount: number, denominator: number = 8) {
    return (amount / Math.pow(10, denominator)).toFixed(2);
}