/**
 * peasytext types — TypeScript interfaces for text processing.
 */

/** Statistics about a text string. */
export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
}

/** Result of comparing two texts. */
export interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
  /** Similarity score from 0.0 to 1.0 */
  similarity: number;
}

/** Supported case conversion targets. */
export type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot"
  | "path"
  | "alternating"
  | "inverse";

/** Supported sort modes for lines. */
export type SortMode =
  | "alpha"
  | "alpha-desc"
  | "length"
  | "length-desc"
  | "numeric"
  | "reverse"
  | "random"
  | "shuffle";

/** Supported pattern types for extraction. */
export type ExtractType =
  | "emails"
  | "urls"
  | "phones"
  | "numbers"
  | "ips"
  | "hashtags"
  | "mentions";

/** Unit for Lorem Ipsum generation. */
export type LoremUnit = "words" | "sentences" | "paragraphs";

/** Mode for text reversal. */
export type ReverseMode = "characters" | "words" | "lines";

/** Options for slugify. */
export interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
  maxLength?: number;
}
