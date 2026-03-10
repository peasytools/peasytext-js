/**
 * peasytext engine — Pure TypeScript text processing.
 *
 * 15 text operations: case conversion, slug generation, word counting,
 * line sorting, Base64 encode/decode, URL encode/decode, HTML entities,
 * find & replace, deduplication, line numbering, extraction, diffing,
 * Lorem Ipsum generation, and text reversal.
 *
 * Zero dependencies. All functions are pure — no side effects.
 */

import type {
  CaseType,
  DiffResult,
  ExtractType,
  LoremUnit,
  ReverseMode,
  SlugifyOptions,
  SortMode,
  TextStats,
} from "./types.js";

// ── Helpers ──────────────────────────────────────────────────────

/** Split text into words, handling camelCase, snake_case, etc. */
function splitWords(text: string): string[] {
  const s = text.replace(/([a-z])([A-Z])/g, "$1 $2");
  return s.split(/[^a-zA-Z0-9]+/).filter(Boolean);
}

// ── Case conversion ────────────────────────────────────────────────

/** Convert text to the specified case. */
export function toCase(text: string, target: CaseType = "upper"): string {
  if (target === "upper") return text.toUpperCase();
  if (target === "lower") return text.toLowerCase();
  if (target === "title") {
    return text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  }
  if (target === "sentence") {
    return text.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p, c: string) => p + c.toUpperCase());
  }

  const words = splitWords(text);
  if (words.length === 0) return "";

  if (target === "camel") {
    return words[0].toLowerCase() + words.slice(1).map(capitalize).join("");
  }
  if (target === "pascal") return words.map(capitalize).join("");
  if (target === "snake") return words.map((w) => w.toLowerCase()).join("_");
  if (target === "kebab") return words.map((w) => w.toLowerCase()).join("-");
  if (target === "constant") return words.map((w) => w.toUpperCase()).join("_");
  if (target === "dot") return words.map((w) => w.toLowerCase()).join(".");
  if (target === "path") return words.map((w) => w.toLowerCase()).join("/");
  if (target === "alternating") {
    return [...text].map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
  }
  if (target === "inverse") {
    return [...text]
      .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
      .join("");
  }
  return text;
}

function capitalize(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

// ── Slug generation ─────────────────────────────────────────────────

/** Convert text to a URL-friendly slug. */
export function slugify(text: string, options: SlugifyOptions = {}): string {
  const { separator = "-", lowercase = true, maxLength = 0 } = options;

  return text
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (!line) return "";

      // Strip diacritics
      let slug = line.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (lowercase) slug = slug.toLowerCase();
      slug = slug.replace(/[^a-zA-Z0-9]+/g, separator);
      slug = slug.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), "");

      if (maxLength > 0 && slug.length > maxLength) {
        slug = slug.slice(0, maxLength).replace(new RegExp(`\\${separator}+$`), "");
      }

      return slug;
    })
    .join("\n");
}

// ── Text statistics ─────────────────────────────────────────────────

/** Count characters, words, sentences, paragraphs, and lines. */
export function countText(text: string, wordsPerMinute = 200): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/[\s]/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim()
    ? text
        .split(/[.!?]+\s*/)
        .filter((s) => s.trim()).length
    : 0;
  const paragraphs = text.trim()
    ? text
        .split(/\n\s*\n/)
        .filter((p) => p.trim()).length
    : 0;
  const lines = text ? text.split("\n").length : 0;

  const readingMinutes = wordsPerMinute > 0 ? words / wordsPerMinute : 0;
  const readingTime = readingMinutes < 1 ? "< 1 min" : `${Math.ceil(readingMinutes)} min`;

  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime };
}

// ── Sort lines ──────────────────────────────────────────────────────

/** Sort lines of text by various criteria. */
export function sortLines(text: string, mode: SortMode = "alpha"): string {
  const lines = text.split("\n");

  if (mode === "alpha") {
    lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  } else if (mode === "alpha-desc") {
    lines.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
  } else if (mode === "length") {
    lines.sort((a, b) => a.length - b.length);
  } else if (mode === "length-desc") {
    lines.sort((a, b) => b.length - a.length);
  } else if (mode === "numeric") {
    lines.sort((a, b) => numericKey(a) - numericKey(b));
  } else if (mode === "reverse") {
    lines.reverse();
  } else if (mode === "random" || mode === "shuffle") {
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
  }

  return lines.join("\n");
}

function numericKey(line: string): number {
  const match = line.match(/^\s*(-?[\d,]*\.?\d+)/);
  return match ? parseFloat(match[1].replace(/,/g, "")) : Infinity;
}

// ── Base64 encode/decode ────────────────────────────────────────────

/** Encode text to Base64 (UTF-8 safe). */
export function base64Encode(text: string): string {
  if (typeof btoa !== "undefined") {
    // Browser / modern Node
    return btoa(
      new TextEncoder()
        .encode(text)
        .reduce((s, b) => s + String.fromCharCode(b), ""),
    );
  }
  return Buffer.from(text, "utf-8").toString("base64");
}

/** Decode Base64 to text (UTF-8 safe). */
export function base64Decode(text: string): string {
  try {
    if (typeof atob !== "undefined") {
      const binary = atob(text.trim());
      const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
      return new TextDecoder().decode(bytes);
    }
    return Buffer.from(text.trim(), "base64").toString("utf-8");
  } catch (e) {
    throw new Error(`Invalid Base64 input: ${e}`);
  }
}

// ── URL encode/decode ───────────────────────────────────────────────

/** URL-encode text. If plus=true, spaces become + instead of %20. */
export function urlEncode(text: string, plus = false): string {
  if (plus) {
    return encodeURIComponent(text).replace(/%20/g, "+");
  }
  return encodeURIComponent(text);
}

/** URL-decode text. */
export function urlDecode(text: string): string {
  return decodeURIComponent(text.replace(/\+/g, " "));
}

// ── HTML entities ───────────────────────────────────────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

const HTML_UNESCAPE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(HTML_ESCAPE_MAP).map(([k, v]) => [v, k]),
);

/** Encode special characters as HTML entities. */
export function htmlEncode(text: string): string {
  return text.replace(/[&<>"']/g, (c) => HTML_ESCAPE_MAP[c] ?? c);
}

/** Decode HTML entities back to characters. */
export function htmlDecode(text: string): string {
  return text.replace(/&(?:amp|lt|gt|quot|#x27);/g, (e) => HTML_UNESCAPE_MAP[e] ?? e);
}

// ── Find & replace ──────────────────────────────────────────────────

/** Find and replace text. Supports plain text and regex patterns. */
export function findReplace(
  text: string,
  find: string,
  replace = "",
  options: { caseSensitive?: boolean; regex?: boolean } = {},
): string {
  const { caseSensitive = true, regex = false } = options;

  if (!find) return text;

  if (regex) {
    const flags = caseSensitive ? "g" : "gi";
    return text.replace(new RegExp(find, flags), replace);
  }

  if (caseSensitive) {
    return text.split(find).join(replace);
  }

  const pattern = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(pattern, "gi"), replace);
}

// ── Deduplicate lines ──────────────────────────────────────────────

/** Remove duplicate lines, preserving order. */
export function dedupeLines(text: string, caseSensitive = true): string {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of text.split("\n")) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return result.join("\n");
}

// ── Line numbers ────────────────────────────────────────────────────

/** Add line numbers to each line of text. */
export function addLineNumbers(
  text: string,
  options: { start?: number; separator?: string; padding?: boolean } = {},
): string {
  const { start = 1, separator = ": ", padding = true } = options;
  const lines = text.split("\n");
  const end = start + lines.length - 1;
  const width = padding ? String(end).length : 0;

  return lines
    .map((line, i) => {
      const num = padding ? String(start + i).padStart(width) : String(start + i);
      return `${num}${separator}${line}`;
    })
    .join("\n");
}

/** Remove leading line numbers from text. */
export function removeLineNumbers(text: string): string {
  return text.replace(/^\s*\d+[.:)\-\]|]\s?/gm, "");
}

// ── Extract patterns ───────────────────────────────────────────────

const EXTRACT_PATTERNS: Record<ExtractType, RegExp> = {
  emails: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
  urls: /https?:\/\/[^\s<>"']+/g,
  phones: /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g,
  numbers: /-?\d+(?:,\d{3})*(?:\.\d+)?/g,
  ips: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  hashtags: /#\w+/g,
  mentions: /@\w+/g,
};

/** Extract emails, URLs, phone numbers, or other patterns from text. */
export function extract(text: string, patternType: ExtractType = "emails"): string[] {
  const regex = EXTRACT_PATTERNS[patternType] ?? EXTRACT_PATTERNS.emails;
  return [...text.matchAll(regex)].map((m) => m[0]);
}

// ── Diff two texts ──────────────────────────────────────────────────

/** Compare two texts line by line. */
export function diffTexts(textA: string, textB: string): DiffResult {
  const linesA = new Set(textA.split("\n"));
  const linesB = new Set(textB.split("\n"));

  const added = [...linesB].filter((l) => !linesA.has(l)).sort();
  const removed = [...linesA].filter((l) => !linesB.has(l)).sort();
  const unchanged = [...linesA].filter((l) => linesB.has(l)).sort();

  const total = new Set([...linesA, ...linesB]).size;
  const similarity = total > 0 ? Math.round((unchanged.length / total) * 10000) / 10000 : 1.0;

  return { added, removed, unchanged, similarity };
}

// ── Lorem Ipsum generator ──────────────────────────────────────────

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
  "adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
  "incididunt", "ut", "labore", "et", "dolore", "magna",
  "aliqua", "enim", "ad", "minim", "veniam", "quis",
  "nostrud", "exercitation", "ullamco", "laboris", "nisi",
  "aliquip", "ex", "ea", "commodo", "consequat", "duis",
  "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur",
  "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt",
  "mollit", "anim", "id", "est", "laborum",
];

/** Generate Lorem Ipsum placeholder text. */
export function loremIpsum(count = 5, unit: LoremUnit = "paragraphs"): string {
  if (count <= 0) return "";

  if (unit === "words") {
    const words: string[] = [];
    while (words.length < count) words.push(...LOREM_WORDS);
    return words.slice(0, count).join(" ");
  }

  if (unit === "sentences") {
    const sentences: string[] = [];
    let idx = 0;
    for (let i = 0; i < count; i++) {
      const length = 8 + (idx % 7); // 8-14 words per sentence
      const wordsInSentence: string[] = [];
      for (let j = 0; j < length; j++) {
        wordsInSentence.push(LOREM_WORDS[idx % LOREM_WORDS.length]);
        idx++;
      }
      const sent = wordsInSentence.join(" ");
      sentences.push(sent.charAt(0).toUpperCase() + sent.slice(1) + ".");
    }
    return sentences.join(" ");
  }

  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const numSentences = 3 + (i % 4);
    paragraphs.push(loremIpsum(numSentences, "sentences"));
  }
  return paragraphs.join("\n\n");
}

// ── Reverse text ────────────────────────────────────────────────────

/** Reverse text by characters, words, or lines. */
export function reverseText(text: string, mode: ReverseMode = "characters"): string {
  if (mode === "characters") return [...text].reverse().join("");
  if (mode === "words") return text.split(/\s+/).reverse().join(" ");
  if (mode === "lines") return text.split("\n").reverse().join("\n");
  return text;
}

// ── JSON format/validate ───────────────────────────────────────────

/** Format (pretty-print) a JSON string. */
export function jsonFormat(text: string, indent = 2): string {
  try {
    return JSON.stringify(JSON.parse(text), null, indent);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e}`);
  }
}

/** Minify a JSON string by removing all whitespace. */
export function jsonMinify(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text));
  } catch (e) {
    throw new Error(`Invalid JSON: ${e}`);
  }
}

/** Check if a string is valid JSON. */
export function jsonValidate(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}
