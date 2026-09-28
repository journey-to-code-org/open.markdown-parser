import test from "node:test";
import assert from "node:assert/strict";

import { parseMarkdown } from "../src/index.js";

test("parseMarkdown returns empty structures for empty input", () => {
  assert.deepEqual(parseMarkdown(""), {
    headings: [],
    links: [],
    images: [],
    codeBlocks: [],
    plainText: "",
    tokens: []
  });
});

test("extracts headings", () => {
  const result = parseMarkdown("# Hello\n\n## Install");

  assert.deepEqual(result.headings, [
    { level: 1, text: "Hello" },
    { level: 2, text: "Install" }
  ]);
});

test("extracts links", () => {
  const result = parseMarkdown(
    '[Example](https://example.com "Title")'
  );

  assert.deepEqual(result.links, [
    {
      href: "https://example.com",
      text: "Example",
      title: "Title"
    }
  ]);
});

test("extracts images", () => {
  const result = parseMarkdown(
    '![Alt text](/image.png "Image title")'
  );

  assert.deepEqual(result.images, [
    {
      src: "/image.png",
      alt: "Alt text",
      title: "Image title"
    }
  ]);
});

test("extracts fenced code blocks and language", () => {
  const result = parseMarkdown(
    "```js\nconsole.log('hi');\n```"
  );

  assert.deepEqual(result.codeBlocks, [
    {
      language: "js",
      code: "console.log('hi');\n"
    }
  ]);
});

test("extracts indented code blocks", () => {
  const result = parseMarkdown("    const x = 1;\n");

  assert.deepEqual(result.codeBlocks, [
    {
      language: null,
      code: "const x = 1;\n"
    }
  ]);
});

test("extracts plain text without markdown markers", () => {
  const result = parseMarkdown(
    "# Hello\n\nThis is **bold** text."
  );

  assert.equal(
    result.plainText,
    "Hello\n\nThis is bold text."
  );
});

test("normalizes tokens instead of exposing markdown-it Token instances", () => {
  const result = parseMarkdown("# Hello");

  assert.ok(result.tokens.length > 0);
  assert.equal(typeof result.tokens[0], "object");
  assert.equal(result.tokens[0].type, "heading_open");
  assert.ok("attrs" in result.tokens[0]);
  assert.ok(Array.isArray(result.tokens[0].children));
});

test("html is disabled by default", () => {
  const result = parseMarkdown("<span>hello</span>");

  const inlineToken = result.tokens.find(
    (token) => token.type === "inline"
  );

  assert.ok(inlineToken);

  const htmlToken = inlineToken.children.find(
    (token) => token.type === "html_inline"
  );

  assert.equal(htmlToken, undefined);
});

test("html option may be enabled", () => {
  const result = parseMarkdown(
    "<span>hello</span>",
    { html: true }
  );

  const inlineToken = result.tokens.find(
    (token) => token.type === "inline"
  );

  assert.ok(inlineToken);

  const htmlTokens = inlineToken.children.filter(
    (token) => token.type === "html_inline"
  );

  assert.equal(htmlTokens.length, 2);
  assert.equal(htmlTokens[0].content, "<span>");
  assert.equal(htmlTokens[1].content, "</span>");
});

test("linkify may be enabled", () => {
  const result = parseMarkdown(
    "Visit https://example.com",
    { linkify: true }
  );

  assert.equal(result.links.length, 1);
  assert.equal(
    result.links[0].href,
    "https://example.com"
  );
});

test("rejects non-string source", () => {
  assert.throws(() => parseMarkdown(null), TypeError);
  assert.throws(() => parseMarkdown(42), TypeError);
});

test("rejects invalid options", () => {
  assert.throws(
    () => parseMarkdown("# Hi", null),
    TypeError
  );

  assert.throws(
    () => parseMarkdown("# Hi", { html: "yes" }),
    TypeError
  );
});