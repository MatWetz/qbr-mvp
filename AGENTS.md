# AGENTS.md

## Branching Workflow

- Keep `main` protected and stable.
- Do all new work on feature branches.
- Open a pull request from the feature branch into `main`.
- Merge only after review and checks pass.

## Exception

- The initial repository bootstrap commit is allowed directly on `main`.

## Commit Guidance

- Use small, focused commits.
- Write clear commit messages that describe intent and scope.
- Avoid mixing unrelated changes in one commit.

## Continuous Learning

- If an agent does something incorrectly, add a short note to this file immediately.
- Each note must include:
  - what went wrong,
  - the corrected behavior,
  - a concrete "do/don't" rule to prevent repeating the mistake.
