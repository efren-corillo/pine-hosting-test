---
name: git-flow-manager
description: Automates feature branch workflow with quality gates (typecheck + tests) and Conventional Commits.
---

# Git Flow Manager

Automate feature branch workflows and enforce quality before committing.

## Steps

1. **Pre-commit check**: run `npm run typecheck` and `npm test`. If either fails, abort and list the failing details (file, line, message). Do not commit.
2. **Inspect changes**: run `git status` and `git diff` (plus `git diff --staged`).
3. **Stage and message**: run `git add .`, then write a Conventional Commit message (`feat|fix|test|refactor|docs|chore(scope): summary`) based on the diff.
4. **Commit** with that message.
5. **Finish feature (offer options)**:
   - Stay on the feature branch.
   - Switch back and merge: `git checkout develop && git merge --no-ff <feature-branch>`.
   - Optionally push: `git push origin develop`.
   Ask the user before merging or pushing.
