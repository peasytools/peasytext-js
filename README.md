# peasytext

[![npm](https://img.shields.io/npm/v/peasytext)](https://www.npmjs.com/package/peasytext)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/peasytext)

Pure TypeScript text processing toolkit — 15 tools for case conversion, slug generation, word counting, line sorting, Base64/URL/HTML encoding, find & replace, deduplication, line numbering, pattern extraction, text diffing, Lorem Ipsum generation, JSON formatting, and text reversal. Zero dependencies. Tree-shakeable ESM.

Extracted from the client-side engines at [peasytext.com](https://peasytext.com), where all 15 text tools run entirely in the browser. This package provides the same functionality for Node.js, Deno, Bun, and browser environments.

> **Try the interactive tools at [peasytext.com](https://peasytext.com)** — [Text Case Converter](https://peasytext.com/tools/text-case-converter/), [Word Counter](https://peasytext.com/tools/word-counter/), [Slug Generator](https://peasytext.com/tools/slug-generator/), [Base64 Encoder](https://peasytext.com/tools/base64-encoder-decoder/), [JSON Formatter](https://peasytext.com/tools/json-formatter/)

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Case Conversion](#case-conversion)
  - [Slug Generation](#slug-generation)
  - [Text Statistics](#text-statistics)
  - [Line Sorting](#line-sorting)
  - [Base64 Encoding](#base64-encoding)
  - [URL & HTML Encoding](#url--html-encoding)
  - [Find & Replace](#find--replace)
  - [Deduplication](#deduplication)
  - [Line Numbers](#line-numbers)
  - [Pattern Extraction](#pattern-extraction)
  - [Text Diffing](#text-diffing)
  - [Lorem Ipsum](#lorem-ipsum)
  - [JSON Formatting](#json-formatting)
  - [Text Reversal](#text-reversal)
- [API Reference](#api-reference)
- [TypeScript Types](#typescript-types)
- [Learn More About Text Processing](#learn-more-about-text-processing)
- [Also Available for Python](#also-available-for-python)
- [Peasy Developer Tools](#peasy-developer-tools)
- [License](#license)

## Install

```bash
npm install peasytext
```

## Quick Start

```typescript
import { toCase, slugify, countText, extract } from "peasytext";

// Convert text between 13 case formats
console.log(toCase("hello world", "pascal"));     // "HelloWorld"
console.log(toCase("hello world", "snake"));      // "hello_world"
console.log(toCase("hello world", "constant"));   // "HELLO_WORLD"

// Generate URL-friendly slugs with diacritic handling
console.log(slugify("Crème brûlée recipe!"));     // "creme-brulee-recipe"

// Count words, sentences, reading time
const stats = countText("Hello world. How are you today?");
console.log(stats.words);        // 6
console.log(stats.sentences);    // 2
console.log(stats.readingTime);  // "< 1 min"

// Extract patterns from text
const emails = extract("Contact info@example.com or admin@test.org", "emails");
console.log(emails);  // ["info@example.com", "admin@test.org"]
```

## What You Can Do

### Case Conversion

Convert text between 13 case formats — from basic upper/lower to programming conventions like camelCase, snake_case, and CONSTANT_CASE. Automatically handles camelCase and snake_case input by splitting on word boundaries.

| Case | Example | Use Case |
|------|---------|----------|
| `upper` | HELLO WORLD | Constants, emphasis |
| `lower` | hello world | Normalization |
| `title` | Hello World | Headings, titles |
| `sentence` | Hello world | Natural text |
| `camel` | helloWorld | JavaScript variables |
| `pascal` | HelloWorld | Class names |
| `snake` | hello_world | Python variables |
| `kebab` | hello-world | CSS classes, URLs |
| `constant` | HELLO_WORLD | Constants, env vars |
| `dot` | hello.world | Package names |
| `path` | hello/world | File paths |
| `alternating` | hElLo WoRlD | Sarcasm text |
| `inverse` | hELLO wORLD | Inversion |

```typescript
import { toCase } from "peasytext";

// Programming case conversions
console.log(toCase("user full name", "camel"));     // "userFullName"
console.log(toCase("user full name", "pascal"));    // "UserFullName"
console.log(toCase("user full name", "snake"));     // "user_full_name"
console.log(toCase("user full name", "constant"));  // "USER_FULL_NAME"
```

Learn more: [Text Case Converter](https://peasytext.com/tools/text-case-converter/)

### Slug Generation

Convert any text to a URL-friendly slug. Handles Unicode, diacritics, and special characters — essential for SEO-friendly URLs, file naming, and database keys.

```typescript
import { slugify } from "peasytext";

// Diacritic stripping with NFD normalization
console.log(slugify("Crème Brûlée — The Recipe"));  // "creme-brulee-the-recipe"
console.log(slugify("München Straße"));               // "munchen-strasse"

// Custom separator and max length
console.log(slugify("Hello World", { separator: "_" }));             // "hello_world"
console.log(slugify("A very long title here", { maxLength: 10 }));   // "a-very"
```

Learn more: [Slug Generator](https://peasytext.com/tools/slug-generator/)

### Text Statistics

Count characters, words, sentences, paragraphs, and lines. Estimates reading time based on configurable words-per-minute — useful for blog posts, content management, and SEO metadata.

```typescript
import { countText } from "peasytext";

const stats = countText("Hello world. This is a test.\n\nNew paragraph here.");
console.log(stats.words);        // 9
console.log(stats.sentences);    // 3
console.log(stats.paragraphs);   // 2
console.log(stats.readingTime);  // "< 1 min"
```

Learn more: [Word Counter](https://peasytext.com/tools/word-counter/)

### Line Sorting

Sort lines alphabetically, by length, numerically, or reverse order. The `shuffle` mode uses Fisher-Yates for uniform random distribution.

```typescript
import { sortLines } from "peasytext";

const text = "banana\napple\ncherry";
console.log(sortLines(text, "alpha"));        // apple\nbanana\ncherry
console.log(sortLines(text, "length"));       // apple\nbanana\ncherry
console.log(sortLines("10\n2\n30", "numeric"));  // 2\n10\n30
```

### Base64 Encoding

Encode and decode Base64 with full UTF-8 support — handles emoji, CJK characters, and all Unicode. Works in both browser (using `btoa`/`atob` + `TextEncoder`) and Node.js (using `Buffer`).

```typescript
import { base64Encode, base64Decode } from "peasytext";

const encoded = base64Encode("Hello, 世界! 🌍");
console.log(encoded);                    // "SGVsbG8sIOS4lueVjCEg8J+MjQ=="
console.log(base64Decode(encoded));      // "Hello, 世界! 🌍"
```

Learn more: [Base64 Encoder/Decoder](https://peasytext.com/tools/base64-encoder-decoder/)

### URL & HTML Encoding

```typescript
import { urlEncode, urlDecode, htmlEncode, htmlDecode } from "peasytext";

// URL encoding with optional plus-for-spaces
console.log(urlEncode("hello world"));       // "hello%20world"
console.log(urlEncode("hello world", true)); // "hello+world"
console.log(urlDecode("hello%20world"));     // "hello world"

// HTML entity encoding — prevents XSS in user-generated content
console.log(htmlEncode('<script>alert("xss")</script>'));
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### Find & Replace

Plain text and regex find & replace with case sensitivity options.

```typescript
import { findReplace } from "peasytext";

// Case-insensitive replace
console.log(findReplace("Hello World", "world", "TypeScript", { caseSensitive: false }));
// "Hello TypeScript"

// Regex mode — replace all numbers
console.log(findReplace("abc123def456", "\\d+", "NUM", { regex: true }));
// "abcNUMdefNUM"
```

### Deduplication

Remove duplicate lines while preserving original order.

```typescript
import { dedupeLines } from "peasytext";

console.log(dedupeLines("apple\nbanana\napple\ncherry\nbanana"));
// "apple\nbanana\ncherry"
```

### Line Numbers

Add or remove line numbers from text.

```typescript
import { addLineNumbers, removeLineNumbers } from "peasytext";

console.log(addLineNumbers("first\nsecond\nthird"));
// "1: first\n2: second\n3: third"

console.log(removeLineNumbers("1: first\n2: second\n3: third"));
// "first\nsecond\nthird"
```

### Pattern Extraction

Extract emails, URLs, phone numbers, IP addresses, hashtags, and @mentions from any text using built-in regex patterns.

```typescript
import { extract } from "peasytext";

const text = "Contact info@example.com, visit https://example.com, call +1-555-0123";
console.log(extract(text, "emails"));   // ["info@example.com"]
console.log(extract(text, "urls"));     // ["https://example.com,"]
console.log(extract(text, "phones"));   // ["+1-555-0123"]
```

### Text Diffing

Compare two texts line by line and measure similarity.

```typescript
import { diffTexts } from "peasytext";

const result = diffTexts("apple\nbanana\ncherry", "banana\ncherry\ndate");
console.log(result.added);       // ["date"]
console.log(result.removed);     // ["apple"]
console.log(result.similarity);  // 0.6667
```

### Lorem Ipsum

Generate placeholder text by words, sentences, or paragraphs.

```typescript
import { loremIpsum } from "peasytext";

console.log(loremIpsum(10, "words"));       // 10 lorem ipsum words
console.log(loremIpsum(3, "paragraphs"));   // 3 paragraphs of text
```

### JSON Formatting

Format, minify, and validate JSON strings.

```typescript
import { jsonFormat, jsonMinify, jsonValidate } from "peasytext";

console.log(jsonFormat('{"a":1,"b":2}'));   // Pretty-printed with 2-space indent
console.log(jsonMinify('{ "a": 1 }'));      // '{"a":1}'
console.log(jsonValidate('{"key": "ok"}')); // true
```

Learn more: [JSON Formatter](https://peasytext.com/tools/json-formatter/)

### Text Reversal

Reverse text by characters, words, or lines.

```typescript
import { reverseText } from "peasytext";

console.log(reverseText("hello", "characters"));     // "olleh"
console.log(reverseText("hello world", "words"));     // "world hello"
console.log(reverseText("a\nb\nc", "lines"));         // "c\nb\na"
```

## API Reference

| Function | Description |
|----------|-------------|
| `toCase(text, target)` | Convert between 13 case formats |
| `slugify(text, options?)` | Generate URL-friendly slug |
| `countText(text, wpm?)` | Count words, chars, sentences, reading time |
| `sortLines(text, mode?)` | Sort lines by alpha, length, numeric, etc. |
| `base64Encode(text)` | Encode text to Base64 (UTF-8 safe) |
| `base64Decode(text)` | Decode Base64 to text (UTF-8 safe) |
| `urlEncode(text, plus?)` | URL-encode text |
| `urlDecode(text)` | URL-decode text |
| `htmlEncode(text)` | Encode HTML entities |
| `htmlDecode(text)` | Decode HTML entities |
| `findReplace(text, find, replace?, opts?)` | Find and replace with regex support |
| `dedupeLines(text, caseSensitive?)` | Remove duplicate lines |
| `addLineNumbers(text, opts?)` | Add line numbers |
| `removeLineNumbers(text)` | Remove line numbers |
| `extract(text, patternType?)` | Extract emails, URLs, phones, etc. |
| `diffTexts(textA, textB)` | Compare two texts |
| `loremIpsum(count?, unit?)` | Generate Lorem Ipsum |
| `reverseText(text, mode?)` | Reverse by chars, words, or lines |
| `jsonFormat(text, indent?)` | Pretty-print JSON |
| `jsonMinify(text)` | Minify JSON |
| `jsonValidate(text)` | Validate JSON |

## TypeScript Types

All types are exported for full type safety:

```typescript
import type {
  CaseType,        // "upper" | "lower" | "title" | "sentence" | "camel" | ...
  SortMode,        // "alpha" | "alpha-desc" | "length" | "numeric" | "reverse" | "shuffle"
  ExtractType,     // "emails" | "urls" | "phones" | "numbers" | "ips" | "hashtags" | "mentions"
  LoremUnit,       // "words" | "sentences" | "paragraphs"
  ReverseMode,     // "characters" | "words" | "lines"
  TextStats,       // { characters, words, sentences, paragraphs, lines, readingTime }
  DiffResult,      // { added, removed, unchanged, similarity }
  SlugifyOptions,  // { separator?, lowercase?, maxLength? }
} from "peasytext";
```

## Learn More About Text Processing

- **Tools**: [Text Case Converter](https://peasytext.com/tools/text-case-converter/) · [Word Counter](https://peasytext.com/tools/word-counter/) · [Slug Generator](https://peasytext.com/tools/slug-generator/) · [Base64 Encoder](https://peasytext.com/tools/base64-encoder-decoder/)
- **Guides**: [Text Processing Guide](https://peasytext.com/guides/) · [Glossary](https://peasytext.com/glossary/)
- **Hub**: [Peasy Tools](https://peasytools.com) — 255 free browser-based tools across 16 categories
- **Python**: [PyPI Package](https://pypi.org/project/peasytext/)

## Also Available for Python

| Platform | Install | Link |
|----------|---------|------|
| **PyPI** | `pip install peasytext` | [PyPI](https://pypi.org/project/peasytext/) |
| **MCP** | `uvx --from "peasytext[mcp]" python -m peasytext.mcp_server` | [Config](#) |

## Peasy Developer Tools

| Package | PyPI | npm | Description |
|---------|------|-----|-------------|
| **peasytext** | [PyPI](https://pypi.org/project/peasytext/) | [npm](https://www.npmjs.com/package/peasytext) | **Text processing toolkit — 15 tools** — [peasytext.com](https://peasytext.com) |

More packages coming soon for all 15 Peasy categories (PDF, Image, Dev, CSS, SEO, Math, and more).

## License

MIT — see [LICENSE](LICENSE).
