export function formatCentsToDecimal(cents: number): string {
    const sign = cents < 0 ? '-' : '';
    const abs = Math.abs(cents);
    return `${sign}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/** Rounds a non-negative fractional cent value to the nearest cent, halves up. */
export function roundHalfUp(cents: number): number {
    return Math.floor(cents + 0.5);
}
