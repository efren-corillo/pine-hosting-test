import { describe, expect, it } from 'vitest';
import { CheckoutService } from '../src/services/CheckoutService.js';
import { PercentagePromoStrategy } from '../src/strategies/promoCodes.js';
import type { CheckoutPayload } from '../src/types/index.js';

const svc = new CheckoutService();
const run = (p: CheckoutPayload) => svc.processOrder(p);

describe('checkout', () => {
  it('example scenario', () => {
    const r = run({ items: [{ sku: 'NB', quantity: 3 }, { sku: 'PEN', quantity: 5 }, { sku: 'MUG', quantity: 1 }], discountCode: 'SAVE10' });
    expect(r.subtotalInCents).toBe(4550);
    expect(r.discounts.map((d) => d.amountInCents)).toEqual([400, 250, 390]);
    expect(r.totalInCents).toBe(3510);
  });
  it('no-offer items', () => {
    expect(run({ items: [{ sku: 'MUG', quantity: 2 }, { sku: 'TOTE', quantity: 1 }] }).totalInCents).toBe(2900);
  });
  it('sub-threshold', () => {
    const r = run({ items: [{ sku: 'NB', quantity: 2 }, { sku: 'PEN', quantity: 4 }] });
    expect(r.discounts).toEqual([]);
    expect(r.totalInCents).toBe(2800);
  });
  it('multiple multiples', () => {
    expect(run({ items: [{ sku: 'NB', quantity: 6 }] }).discounts[0].amountInCents).toBe(800);
  });
  it('half-up rounding', () => {
    const s = new CheckoutService([], [new PercentagePromoStrategy('SAVE10', 10)]);
    // 1 x 1200 -> 120; use MUG 850 -> 85 exact; 2 MUG+... craft: 1 NB (400)+... use 5% on 850 = 42.5 -> 43
    const s2 = new CheckoutService([], [new PercentagePromoStrategy('P5', 5)]);
    expect(s2.processOrder({ items: [{ sku: 'MUG', quantity: 1 }], discountCode: 'P5' }).discounts[0].amountInCents).toBe(43);
    expect(s.processOrder({ items: [{ sku: 'MUG', quantity: 1 }], discountCode: 'SAVE10' }).totalInCents).toBe(765);
  });
  it('payload edge cases', () => {
    expect(run({ items: [] }).totalInCents).toBe(0);
    expect(() => run({ items: [{ sku: 'XXX' as never, quantity: 1 }] })).toThrow(/Invalid SKU/);
    expect(() => run({ items: [{ sku: 'NB', quantity: 0 }] })).toThrow(/quantity/);
    expect(() => run({ items: [], discountCode: 'BOGUS' })).toThrow(/Unknown discount/);
  });
});
