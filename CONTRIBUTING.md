# Contributing to open.markdown-parser

`open.markdown-parser` is intentionally a thin adapter around `markdown-it`.

## Before changing code

1. Read `README.md`.
2. Read `AGENTS.md` if using an AI coding assistant.
3. Run the tests.
4. Keep changes focused on normalized parser output.

## Design rules

- Do not implement CommonMark/Markdown grammar from scratch here.
- Do not leak raw `markdown-it` assumptions into the public API unless documented.
- Do not add slugging, outlines, reading-time, rendering, or sanitization.
- Preserve backward compatibility in normalized output whenever possible.
- Add tests for any new normalized structure or parser behavior.
