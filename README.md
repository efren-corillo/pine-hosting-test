# pine-hosting-test

TypeScript shopping basket checkout assessment (checkout pricing), tested with Vitest.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (developed on 22)
- npm 10 or newer (bundled with Node.js)
- Git

## Getting Started

1. Clone the repository:

   ```bash
   git clone git@github.com:efren-corillo/pine-hosting-test.git
   cd pine-hosting-test
   ```

2. Switch to the `develop` branch:

   ```bash
   git checkout develop
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Verify the setup:

   ```bash
   npm run typecheck
   npm test
   ```

### Running Tests

```bash
npm test
```

### Running the API Simulation Demo

To simulate an incoming POST request using the payload in `data/checkout.json`:

```bash
npx tsx src/demo.ts
```

You can modify `data/checkout.json` to test different quantities, products, or discount codes.

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run the test suite once (`vitest run`) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Type-check without emitting files (`tsc --noEmit`) |
| `npm run build` | Compile TypeScript to `dist/` (`tsc`) |
| `npx vitest run --coverage` | Run tests with a coverage report |

## Project Structure

```
src/
  types/
    index.ts            Shared type definitions (SKU, Product, Receipt, strategies, payload)
  catalog/
    products.ts         Product catalog and SKU type guard
  strategies/
    itemOffers.ts       Per-item offer strategies (BuyXPayYOffer, BulkQuantityTierOffer)
    promoCodes.ts       Basket promo code strategies (PercentagePromoStrategy)
  services/
    CheckoutService.ts  Order validation, discount calculation, and receipt formatting
  utils/
    money.ts            Cents formatting and half-up rounding helpers
  demo.ts               Sample POST /api/checkout runner using data/checkout.json
data/
  checkout.json         Sample checkout request payload
tests/
  checkout.test.ts      Vitest unit tests for checkout pricing and edge cases
.agent/skills/          Workspace agent skills (git-flow-manager, tdd-verification-guard)
```

---

## Assumptions Made

1. **API Payload Shape:** The engine expects a JSON structure matching `{ items: [{ sku, quantity }], discountCode?: string }`.
2. **Currency Representation:** All pricing and calculations are done in integer cents internally to avoid floating-point drift.
3. **Offer Precedence:** Item-level offers (3-for-2, bulk tier) are evaluated first to yield an adjusted subtotal. Basket-level promo codes (`SAVE10`) apply strictly to this adjusted subtotal.
4. **Rounding Policy:** Promo code discounts producing fractional cents round half-up.
5. **Discount Code Limitation:** At most one basket discount code is accepted per payload; an unsupported code throws a validation error.
6. **Extensibility:** Offers are managed via an extensible Strategy pattern rather than conditional branching inside the checkout loop.

---

## What I Would Do Next With More Time

1. **HTTP Server & OpenAPI Spec:** Expose the service over a real Fastify/Express server with Zod request validation and Swagger docs.
2. **Database/JSON-Driven Offer Rules:** Load offer thresholds and rules from storage rather than code.
3. **Multi-Currency Support:** Support arbitrary ISO currencies with differing subunits (e.g. JPY).
4. **Voucher Stacking Engine:** Configurable voucher collision policies (stackable, exclusive, best-value-first).

---

## Workflow

Work on feature branches off `develop` and use Conventional Commits. Before committing, make sure `npm run typecheck` and `npm test` pass. When a feature is done, merge into `develop` with `git merge --no-ff <feature-branch>`.

---

## AI Tools Used

* **Antigravity CLI (`agy`):** Used for initial project scaffolding, workspace agent skill configuration (`.agent/skills/`), and automated Git-flow release gates. Domain logic, strategy patterns, and tests were authored by hand.
