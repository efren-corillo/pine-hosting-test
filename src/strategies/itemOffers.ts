import type { ItemOfferStrategy, ReceiptDiscount, SKU } from '../types/index.js';

/** Buy `buy` get `pay` charged: every group of `buy` items costs `pay` items. */
export class BuyXPayYOffer implements ItemOfferStrategy {
  constructor(private sku: SKU, private buy: number, private pay: number) {}

  appliesTo(sku: SKU): boolean {
    return sku === this.sku;
  }

  calculateDiscount(sku: SKU, quantity: number, unitPriceInCents: number): ReceiptDiscount | null {
    const groups = Math.floor(quantity / this.buy);
    const amount = groups * (this.buy - this.pay) * unitPriceInCents;
    if (amount <= 0) return null;
    return { description: `${sku} ${this.buy}-for-${this.pay}`, amountInCents: amount };
  }
}

/** Reduced unit price once quantity reaches a threshold. */
export class BulkQuantityTierOffer implements ItemOfferStrategy {
  constructor(private sku: SKU, private minQuantity: number, private discountedUnitPriceInCents: number) {}

  appliesTo(sku: SKU): boolean {
    return sku === this.sku;
  }

  calculateDiscount(sku: SKU, quantity: number, unitPriceInCents: number): ReceiptDiscount | null {
    if (quantity < this.minQuantity) return null;
    const amount = quantity * (unitPriceInCents - this.discountedUnitPriceInCents);
    if (amount <= 0) return null;
    return { description: `${sku} bulk price (${this.minQuantity}+)`, amountInCents: amount };
  }
}

export const defaultItemOffers: ItemOfferStrategy[] = [
  new BuyXPayYOffer('NB', 3, 2),
  new BulkQuantityTierOffer('PEN', 5, 450),
];
