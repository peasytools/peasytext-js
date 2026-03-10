/**
 * peasytext — Pure TypeScript text processing toolkit.
 *
 * 15 text operations: case conversion, slug generation, word counting,
 * line sorting, Base64 encode/decode, URL encode/decode, HTML entities,
 * find & replace, deduplication, line numbering, extraction, diffing,
 * Lorem Ipsum generation, JSON formatting, and text reversal.
 *
 * Zero dependencies. All functions are pure — no side effects.
 *
 * @packageDocumentation
 */

export type {
  CaseType,
  DiffResult,
  ExtractType,
  LoremUnit,
  ReverseMode,
  SlugifyOptions,
  SortMode,
  TextStats,
} from "./types.js";

export {
  addLineNumbers,
  base64Decode,
  base64Encode,
  countText,
  dedupeLines,
  diffTexts,
  extract,
  findReplace,
  htmlDecode,
  htmlEncode,
  jsonFormat,
  jsonMinify,
  jsonValidate,
  loremIpsum,
  removeLineNumbers,
  reverseText,
  slugify,
  sortLines,
  toCase,
  urlDecode,
  urlEncode,
} from "./engine.js";
