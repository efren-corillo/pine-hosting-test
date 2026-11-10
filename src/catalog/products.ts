import type { Product, SKU } from '../types/index.js';

export const catalog: Record<SKU, Product> = {
  NB: { sku: 'NB', name: 'Notebook', priceInCents: 400 },
  PEN: { sku: 'PEN', name: 'Pen', priceInCents: 500 },
  MUG: { sku: 'MUG', name: 'Mug', priceInCents: 850 },
  TOTE: { sku: 'TOTE', name: 'Tote Bag', priceInCents: 1200 },
};

export function isSku(value: unknown): value is SKU {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(catalog, value);
}
