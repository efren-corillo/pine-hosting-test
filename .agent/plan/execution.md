Act as a senior DevOps engineer and AI tooling architect. 

Set up the project boilerplate and workspace agent skills for a TypeScript shopping basket checkout assessment. Do NOT write domain business logic or data structures—I will implement all source code, catalog items, and tests myself.

Deliverables:

1. Project Boilerplate:
   - Initialize package.json with scripts: "test": "vitest run", "test:watch": "vitest", "typecheck": "tsc --noEmit", "build": "tsc".
   - Dependencies: typescript, vitest, @types/node.
   - tsconfig.json: target ES2022, module NodeNext, moduleResolution NodeNext, strict true, resolveJsonModule true.
   - Directory skeletons with empty index.ts / placeholder files:
     - src/types/
     - src/catalog/
     - src/strategies/
     - src/services/
     - src/utils/
     - data/products.json (empty JSON object or placeholder)
     - tests/

2. Workspace Agent Skills Setup:
   Create a `.agent/skills/` directory containing two reusable skill specifications:

   A. `.agent/skills/git-flow-manager/SKILL.md`:
      - Purpose: Automate feature branch workflows and quality enforcement.
      - Steps:
        1. Pre-commit check: Run `npm run typecheck` and `npm test`. If any error occurs, abort and list failing details.
        2. Inspect changes via `git status` and `git diff`.
        3. Stage files (`git add .`) and formulate a Conventional Commit message based on the diff.
        4. Commit changes.
        5. Provide options to switch back to `develop` and merge via `--no-ff` when finishing a feature.

   B. `.agent/skills/tdd-verification-guard/SKILL.md`:
      - Purpose: Regression and test coverage guardian.
      - Steps:
        1. Run `npx vitest run --coverage` (or standard `vitest run`).
        2. Detect unhandled edge cases, missing assertions, or floating-point hazards in tests.
        3. Print a clean markdown summary report with status passes/fails.

3. Git Initialization:
   - Initialize git repo if not already present.
   - Create initial commit on `master`, create `develop` branch, and checkout `develop`.

Stop once the scaffolding and skills are created. Wait for my manual code implementation.
