# AI agent guidance

AI-assisted contributions are allowed.

Before editing:

1. Read `README.md`, `CONTRIBUTING.md`, and tests.
2. Inspect the current normalization logic.
3. Restate the exact output contract being changed.

During implementation:

- Keep `markdown-it` behind the adapter boundary.
- Do not add responsibilities belonging to slugging, outlining, rendering, sanitization, or editing.
- Preserve stable normalized output shapes.
- Add tests for parser edge cases.
- Avoid unrelated abstractions.

Completion reports should include:

- what changed,
- normalized output affected,
- tests run,
- any compatibility implications.
