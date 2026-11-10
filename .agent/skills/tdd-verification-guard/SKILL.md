---
name: tdd-verification-guard
description: Regression and test coverage guardian; runs tests, flags weak tests and floating-point hazards, reports summary.
---

# TDD Verification Guard

Guard against regressions and coverage gaps.

## Steps

1. **Run tests**: `npx vitest run --coverage` (fall back to `npx vitest run` if the coverage provider is not installed).
2. **Review tests** for:
   - Unhandled edge cases (empty basket, zero/negative quantity, unknown SKU, boundary thresholds).
   - Missing or weak assertions (tests without `expect`, only truthiness checks).
   - Floating-point hazards (money computed with floats, `toBe` on decimals; prefer integer cents or `toBeCloseTo`).
3. **Report**: print a markdown summary:

```markdown
## Verification Report
**Status:** PASS | FAIL
| Metric | Result |
|---|---|
| Tests passed / failed | x / y |
| Coverage (lines/branches) | x% / y% |

### Findings
- [ ] Edge cases missing: ...
- [ ] Weak assertions: ...
- [ ] Floating-point risks: ...
```
