# open.markdown-parser

A small Markdown parsing adapter that normalizes `markdown-it` output into a
stable document structure for browsers and Node.js.

The library does **not** implement Markdown grammar itself. It wraps
`markdown-it` behind a small API so consuming projects do not need to depend on
`markdown-it` token details directly.

## Install

```bash
npm install @journey-to-code/open-markdown-parser
```

## Usage

```js
import { parseMarkdown } from "@journey-to-code/open-markdown-parser";

const document = parseMarkdown(`
# Hello world

Read the [docs](https://example.com).

\`\`\`js
console.log("hello");
\`\`\`
`);

console.log(document.headings);
console.log(document.links);
console.log(document.codeBlocks);
console.log(document.plainText);
console.log(document.tokens);
```

## API

### `parseMarkdown(source, options?)`

Returns a normalized document object:

```js
{
  headings: [],
  links: [],
  images: [],
  codeBlocks: [],
  plainText: "",
  tokens: []
}
```

Options:

```js
parseMarkdown(source, {
  html: false,
  breaks: false,
  linkify: false,
  typographer: false
});
```

## Normalized structures

### Headings

```js
{
  level: 2,
  text: "Installation"
}
```

### Links

```js
{
  href: "https://example.com",
  text: "Example",
  title: null
}
```

### Images

```js
{
  src: "/image.png",
  alt: "Example",
  title: null
}
```

### Code blocks

```js
{
  language: "javascript",
  code: "console.log('hello');"
}
```

## Scope

`open.markdown-parser` deliberately does not:

- generate heading slugs,
- build heading outlines,
- calculate reading time,
- sanitize rendered HTML,
- render final HTML,
- manipulate the DOM,
- provide editor behavior.

Those concerns belong in higher-level tools such as `open.markdown`.

## Runtime

- Node.js 18+
- modern browsers through bundlers
- ES modules

## Development

```bash
npm install
npm test
```

## License

MIT
