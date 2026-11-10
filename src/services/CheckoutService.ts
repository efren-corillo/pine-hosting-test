import { catalog, isSku } from '../catalog/products.js';
import { defaultItemOffers } from '../strategies/itemOffers.js';
import { defaultPromoCodes } from '../strategies/promoCodes.js';
import type {
  BasketDiscountStrategy, CheckoutPayload, ItemOfferStrategy, Receipt, ReceiptDiscount, ReceiptLineItem,
} from '../types/index.js';
import { formatCentsToDecimal } from '../utils/money.js';

export class CheckoutService {
  constructor(
    private itemOffers: ItemOfferStrategy[] = defaultItemOffers,
    private promoCodes: BasketDiscountStrategy[] = defaultPromoCodes,
  ) { }

  processOrder(payload: CheckoutPayload): Receipt {
    if (!payload || !Array.isArray(payload.items)) throw new Error('Invalid payload: items must be an array');

    // Merge duplicate SKUs and validate.
    const quantities = new Map<string, number>();
    for (const item of payload.items) {
      if (!item || !isSku(item.sku)) throw new Error(`Invalid SKU: ${String(item?.sku)}`);
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Invalid quantity for ${item.sku}: ${item.quantity}`);
      }
      quantities.set(item.sku, (quantities.get(item.sku) ?? 0) + item.quantity);
    }
    if (payload.discountCode !== undefined && typeof payload.discountCode !== 'string') {
      throw new Error('Invalid discountCode: must be a single string');
    }

    const lineItems: ReceiptLineItem[] = [];
    const discounts: ReceiptDiscount[] = [];
    for (const [sku, quantity] of quantities) {
      if (!isSku(sku)) continue;
      const product = catalog[sku];
      lineItems.push({
        sku, name: product.name, quantity,
        unitPriceInCents: product.priceInCents,
        totalInCents: quantity * product.priceInCents,
      });
      for (const offer of this.itemOffers) {
        if (!offer.appliesTo(sku)) continue;
        const d = offer.calculateDiscount(sku, quantity, product.priceInCents);
        if (d) discounts.push(d);
      }
    }

    const subtotal = lineItems.reduce((s, l) => s + l.totalInCents, 0);
    let total = subtotal - discounts.reduce((s, d) => s + d.amountInCents, 0);

    if (payload.discountCode) {
      const code = payload.discountCode.trim().toUpperCase();
      const promo = this.promoCodes.find((p) => p.code === code);
      if (!promo) throw new Error(`Unknown discount code: ${payload.discountCode}`);
      const d = promo.calculateDiscount(total);
      if (d) {
        discounts.push(d);
        total -= d.amountInCents;
      }
    }

    return {
      lineItems, subtotalInCents: subtotal, discounts, totalInCents: total,
      formattedText: this.format(lineItems, subtotal, discounts, total)
    };
  }

  private format(lines: ReceiptLineItem[], subtotal: number, discounts: ReceiptDiscount[], total: number): string {
    const out: string[] = [];
    for (const l of lines) {
      out.push(`${l.quantity} x ${l.name} @ ${formatCentsToDecimal(l.unitPriceInCents)}  ${formatCentsToDecimal(l.totalInCents)}`);
    }
    out.push(`Subtotal: ${formatCentsToDecimal(subtotal)}`);
    for (const d of discounts) out.push(`Discount ${d.description}: ${formatCentsToDecimal(-d.amountInCents)}`);
    out.push(`Total: ${formatCentsToDecimal(total)}`);
    return out.join('\n');
  }
}
