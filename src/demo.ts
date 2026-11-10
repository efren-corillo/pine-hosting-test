import { readFileSync } from 'node:fs';
import { CheckoutService } from './services/CheckoutService.js';
import type { CheckoutPayload, Receipt } from './types/index.js';

function handlePost(body: unknown): { status: number; body: unknown } {
  try {
    if (typeof body !== 'object' || body === null || !Array.isArray((body as CheckoutPayload).items)) {
      return { status: 400, body: { error: 'Payload must be { items: [{ sku, quantity }], discountCode? }' } };
    }
    return { status: 200, body: new CheckoutService().processOrder(body as CheckoutPayload) };
  } catch (e) {
    return { status: 422, body: { error: (e as Error).message } };
  }
}

const payload = JSON.parse(readFileSync(new URL('../data/checkout.json', import.meta.url), 'utf8'));
console.log('POST /api/checkout');
console.log(JSON.stringify(payload));
const res = handlePost(payload);
console.log(`\nHTTP ${res.status} ${res.status === 200 ? 'OK' : 'Error'}\n`);
if (res.status === 200) {
  const r = res.body as Receipt;
  console.log(r.formattedText);
  console.log(`\nTotal payable: $${(r.totalInCents / 100).toFixed(2)}`);
} else {
  console.log(res.body);
}
