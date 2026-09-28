import MarkdownIt from "markdown-it";

function assertString(value, name = "source") {
  if (typeof value !== "string") {
    throw new TypeError(`Expected ${name} to be a string`);
  }
}

function normalizeOptions(options) {
  const normalized = {
    html: false,
    breaks: false,
    linkify: false,
    typographer: false,
    ...options
  };

  for (const key of ["html", "breaks", "linkify", "typographer"]) {
    if (typeof normalized[key] !== "boolean") {
      throw new TypeError(`Expected ${key} to be a boolean`);
    }
  }

  return normalized;
}

function textFromInlineChildren(children = []) {
  let text = "";

  for (const child of children) {
    if (
      child.type === "text" ||
      child.type === "code_inline" ||
      child.type === "html_inline"
    ) {
      text += child.content;
    } else if (child.type === "softbreak" || child.type === "hardbreak") {
      text += "\n";
    } else if (child.type === "image") {
      text += child.content || child.attrGet("alt") || "";
    }
  }

  return text;
}

function normalizeToken(token) {
  const attrs = {};
  if (Array.isArray(token.attrs)) {
    for (const [name, value] of token.attrs) {
      attrs[name] = value;
    }
  }

  return {
    type: token.type,
    tag: token.tag,
    nesting: token.nesting,
    level: token.level,
    content: token.content,
    markup: token.markup,
    info: token.info,
    map: token.map ? [...token.map] : null,
    attrs,
    children: Array.isArray(token.children)
      ? token.children.map(normalizeToken)
      : []
  };
}

export function parseMarkdown(source, options = {}) {
  assertString(source);

  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Expected options to be an object");
  }

  const md = new MarkdownIt(normalizeOptions(options));
  const tokens = md.parse(source, {});

  const headings = [];
  const links = [];
  const images = [];
  const codeBlocks = [];
  const plainTextParts = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token.type === "heading_open") {
      const inline = tokens[index + 1];
      const level = Number.parseInt(token.tag.slice(1), 10);

      if (inline?.type === "inline") {
        headings.push({
          level,
          text: textFromInlineChildren(inline.children)
        });
      }
    }

    if (token.type === "inline") {
      const children = token.children ?? [];

      const inlineText = textFromInlineChildren(children).trim();
      if (inlineText) {
        plainTextParts.push(inlineText);
      }

      for (let childIndex = 0; childIndex < children.length; childIndex += 1) {
        const child = children[childIndex];

        if (child.type === "link_open") {
          let text = "";
          let cursor = childIndex + 1;

          while (cursor < children.length && children[cursor].type !== "link_close") {
            const nested = children[cursor];

            if (
              nested.type === "text" ||
              nested.type === "code_inline"
            ) {
              text += nested.content;
            } else if (nested.type === "image") {
              text += nested.content || nested.attrGet("alt") || "";
            }

            cursor += 1;
          }

          links.push({
            href: child.attrGet("href") ?? "",
            text,
            title: child.attrGet("title") ?? null
          });
        }

        if (child.type === "image") {
          images.push({
            src: child.attrGet("src") ?? "",
            alt: child.content || child.attrGet("alt") || "",
            title: child.attrGet("title") ?? null
          });
        }
      }
    }

    if (token.type === "fence") {
      const language = token.info.trim().split(/\s+/u)[0] || null;

      codeBlocks.push({
        language,
        code: token.content
      });
    }

    if (token.type === "code_block") {
      codeBlocks.push({
        language: null,
        code: token.content
      });
    }
  }

  return {
    headings,
    links,
    images,
    codeBlocks,
    plainText: plainTextParts.join("\n\n"),
    tokens: tokens.map(normalizeToken)
  };
}
