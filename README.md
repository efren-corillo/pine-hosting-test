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
  types/        Shared type definitions
  catalog/      Product catalog
  strategies/   Pricing / discount strategies
  services/     Checkout and basket services
  utils/        Helpers
data/
  products.json Product data
tests/          Vitest test files
.agent/skills/  Workspace agent skills (git-flow-manager, tdd-verification-guard)
```

## Workflow

Work on feature branches off `develop` and use Conventional Commits. Before committing, make sure `npm run typecheck` and `npm test` pass. When a feature is done, merge into `develop` with `git merge --no-ff <feature-branch>`.
