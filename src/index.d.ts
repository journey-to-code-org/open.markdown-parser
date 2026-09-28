export interface ParseMarkdownOptions {
  html?: boolean;
  breaks?: boolean;
  linkify?: boolean;
  typographer?: boolean;
}

export interface MarkdownHeading {
  level: number;
  text: string;
}

export interface MarkdownLink {
  href: string;
  text: string;
  title: string | null;
}

export interface MarkdownImage {
  src: string;
  alt: string;
  title: string | null;
}

export interface MarkdownCodeBlock {
  language: string | null;
  code: string;
}

export interface MarkdownToken {
  type: string;
  tag: string;
  nesting: number;
  level: number;
  content: string;
  markup: string;
  info: string;
  map: number[] | null;
  attrs: Record<string, string>;
  children: MarkdownToken[];
}

export interface ParsedMarkdownDocument {
  headings: MarkdownHeading[];
  links: MarkdownLink[];
  images: MarkdownImage[];
  codeBlocks: MarkdownCodeBlock[];
  plainText: string;
  tokens: MarkdownToken[];
}

export function parseMarkdown(
  source: string,
  options?: ParseMarkdownOptions
): ParsedMarkdownDocument;
