import type { BasketDiscountStrategy, ReceiptDiscount } from '../types/index.js';
import { roundHalfUp } from '../utils/money.js';

export class PercentagePromoStrategy implements BasketDiscountStrategy {
  constructor(public code: string, private percent: number) {}

  calculateDiscount(currentTotalInCents: number): ReceiptDiscount | null {
    const amount = roundHalfUp((currentTotalInCents * this.percent) / 100);
    if (amount <= 0) return null;
    return { description: `${this.code} (${this.percent}% off)`, amountInCents: amount };
  }
}

export const defaultPromoCodes: BasketDiscountStrategy[] = [new PercentagePromoStrategy('SAVE10', 10)];
