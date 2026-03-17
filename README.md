# peasytext

[![npm version](https://agentgif.com/badge/npm/peasytext/version.svg)](https://www.npmjs.com/package/peasytext)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/peasytext)
[![GitHub stars](https://agentgif.com/badge/github/peasytools/peasytext-js/stars.svg)](https://github.com/peasytools/peasytext-js)

Pure TypeScript text processing toolkit — 15 tools for case conversion, slug generation, word counting, line sorting, Base64/URL/HTML encoding, find & replace, deduplication, line numbering, pattern extraction, text diffing, Lorem Ipsum generation, JSON formatting, and text reversal. Zero dependencies. Tree-shakeable ESM.

Extracted from the client-side engines at [peasytext.com](https://peasytext.com), where all 15 text tools run entirely in the browser. This package provides the same functionality for Node.js, Deno, Bun, and browser environments.

> **Try the interactive tools at [peasytext.com](https://peasytext.com)** — text case conversion, word counting, slug generation, Base64 encoding, JSON formatting, and 10 more tools

<p align="center">
  <img src="demo.gif" alt="peasytext demo — case conversion, slug generation, word counting in terminal" width="800">
</p>

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
- [REST API Client](#rest-api-client)
- [Learn More](#learn-more)
- [Also Available](#also-available)
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

Learn more: [Text Case Converter](https://peasytext.com/text/text-case-converter/) · [Convert Case and Clean Text Guide](https://peasytext.com/guides/convert-case-clean-text/) · [What is Case Conversion?](https://peasytext.com/glossary/case-conversion/)

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

Learn more: [Slug Generator](https://peasytext.com/text/slug-generator/) · [Slug Generation and URL-Safe Strings](https://peasytext.com/guides/slug-generation-url-safe-strings/) · [What is a Slug?](https://peasytext.com/glossary/slug/)

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

Learn more: [Text Counter](https://peasytext.com/text/text-counter/) · [Word Character Line Counting Best Practices](https://peasytext.com/guides/word-character-line-counting-best-practices/) · [What is Word Count?](https://peasytext.com/glossary/word-count/)

### Line Sorting

Sort lines alphabetically, by length, numerically, or reverse order. The `shuffle` mode uses Fisher-Yates for uniform random distribution.

```typescript
import { sortLines } from "peasytext";

const text = "banana\napple\ncherry";
console.log(sortLines(text, "alpha"));        // apple\nbanana\ncherry
console.log(sortLines(text, "length"));       // apple\nbanana\ncherry
console.log(sortLines("10\n2\n30", "numeric"));  // 2\n10\n30
```

Learn more: [Sort Lines Tool](https://peasytext.com/text/sort-lines/) · [How to Sort Text Lines](https://peasytext.com/guides/how-to-sort-text-lines/) · [What is Line Ending?](https://peasytext.com/glossary/line-ending/)

### Base64 Encoding

Encode and decode Base64 with full UTF-8 support — handles emoji, CJK characters, and all Unicode. Works in both browser (using `btoa`/`atob` + `TextEncoder`) and Node.js (using `Buffer`).

```typescript
import { base64Encode, base64Decode } from "peasytext";

const encoded = base64Encode("Hello, 世界! 🌍");
console.log(encoded);                    // "SGVsbG8sIOS4lueVjCEg8J+MjQ=="
console.log(base64Decode(encoded));      // "Hello, 世界! 🌍"
```

Learn more: [Base64 Encode Decode Tool](https://peasytext.com/text/base64-encode-decode/) · [Base64 Encoding Guide](https://peasytext.com/guides/base64-encoding-guide/) · [How to Encode Decode Base64](https://peasytext.com/guides/how-to-encode-decode-base64/)

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

Learn more: [URL Encode Decode Tool](https://peasytext.com/text/url-encode-decode/) · [HTML Entity Encoder](https://peasytext.com/text/html-entity-encoder/) · [What is an Escape Character?](https://peasytext.com/glossary/escape-character/)

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

Learn more: [Find and Replace Tool](https://peasytext.com/text/find-and-replace/) · [How to Find and Replace with Regex](https://peasytext.com/guides/how-to-find-replace-regex/) · [Regex Cheat Sheet Essential Patterns](https://peasytext.com/guides/regex-cheat-sheet-essential-patterns/)

### Deduplication

Remove duplicate lines while preserving original order.

```typescript
import { dedupeLines } from "peasytext";

console.log(dedupeLines("apple\nbanana\napple\ncherry\nbanana"));
// "apple\nbanana\ncherry"
```

Learn more: [Remove Duplicate Lines Tool](https://peasytext.com/text/remove-duplicate-lines/) · [How to Remove Duplicate Lines](https://peasytext.com/guides/how-to-remove-duplicate-lines/)

### Line Numbers

Add or remove line numbers from text.

```typescript
import { addLineNumbers, removeLineNumbers } from "peasytext";

console.log(addLineNumbers("first\nsecond\nthird"));
// "1: first\n2: second\n3: third"

console.log(removeLineNumbers("1: first\n2: second\n3: third"));
// "first\nsecond\nthird"
```

Learn more: [Line Numbers Tool](https://peasytext.com/text/line-numbers/) · [What is Plain Text?](https://peasytext.com/glossary/plain-text/) · [What is Whitespace?](https://peasytext.com/glossary/whitespace/)

### Pattern Extraction

Extract emails, URLs, phone numbers, IP addresses, hashtags, and @mentions from any text using built-in regex patterns.

```typescript
import { extract } from "peasytext";

const text = "Contact info@example.com, visit https://example.com, call +1-555-0123";
console.log(extract(text, "emails"));   // ["info@example.com"]
console.log(extract(text, "urls"));     // ["https://example.com,"]
console.log(extract(text, "phones"));   // ["+1-555-0123"]
```

Learn more: [Text Extractor Tool](https://peasytext.com/text/text-extractor/) · [How to Extract Data from Text](https://peasytext.com/guides/how-to-extract-data-from-text/) · [Regex Practical Guide](https://peasytext.com/guides/regex-practical-guide/)

### Text Diffing

Compare two texts line by line and measure similarity.

```typescript
import { diffTexts } from "peasytext";

const result = diffTexts("apple\nbanana\ncherry", "banana\ncherry\ndate");
console.log(result.added);       // ["date"]
console.log(result.removed);     // ["apple"]
console.log(result.similarity);  // 0.6667
```

Learn more: [Text Diff Tool](https://peasytext.com/text/text-diff/) · [What is Text Diff?](https://peasytext.com/glossary/text-diff/) · [What is String Distance?](https://peasytext.com/glossary/string-distance/)

### Lorem Ipsum

Generate placeholder text by words, sentences, or paragraphs.

```typescript
import { loremIpsum } from "peasytext";

console.log(loremIpsum(10, "words"));       // 10 lorem ipsum words
console.log(loremIpsum(3, "paragraphs"));   // 3 paragraphs of text
```

Learn more: [Lorem Ipsum Generator](https://peasytext.com/text/lorem-ipsum-generator/) · [Lorem Ipsum Placeholder Text Guide](https://peasytext.com/guides/lorem-ipsum-placeholder-text-guide/) · [What is Lorem Ipsum?](https://peasytext.com/glossary/lorem-ipsum/)

### JSON Formatting

Format, minify, and validate JSON strings.

```typescript
import { jsonFormat, jsonMinify, jsonValidate } from "peasytext";

console.log(jsonFormat('{"a":1,"b":2}'));   // Pretty-printed with 2-space indent
console.log(jsonMinify('{ "a": 1 }'));      // '{"a":1}'
console.log(jsonValidate('{"key": "ok"}')); // true
```

Learn more: [JSON Formatter Tool](https://peasytext.com/text/json-formatter/) · [What is Text Encoding?](https://peasytext.com/glossary/text-encoding/) · [JSON Format Reference](https://peasytext.com/formats/json/)

### Text Reversal

Reverse text by characters, words, or lines.

```typescript
import { reverseText } from "peasytext";

console.log(reverseText("hello", "characters"));     // "olleh"
console.log(reverseText("hello world", "words"));     // "world hello"
console.log(reverseText("a\nb\nc", "lines"));         // "c\nb\na"
```

Learn more: [Reverse Text Tool](https://peasytext.com/text/reverse-text/) · [What is ROT13?](https://peasytext.com/glossary/rot13/) · [What is Unicode?](https://peasytext.com/glossary/unicode/)

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

## REST API Client

The API client connects to the [PeasyText developer API](https://peasytext.com/developers/) for tool discovery and content.

```typescript
import { PeasyTextClient } from "peasytext";

const client = new PeasyTextClient();

// List available tools
const tools = await client.listTools();
console.log(tools.results);

// Search across all content
const results = await client.search("case");
console.log(results);

// Browse the glossary
const glossary = await client.listGlossary({ search: "format" });
for (const term of glossary.results) {
  console.log(`${term.term}: ${term.definition}`);
}

// Discover guides
const guides = await client.listGuides({ category: "text" });
for (const guide of guides.results) {
  console.log(`${guide.title} (${guide.audience_level})`);
}
```

Full API documentation at [peasytext.com/developers/](https://peasytext.com/developers/).

## Learn More

- **Tools**: [Text Counter](https://peasytext.com/text/text-counter/) · [Text Case Converter](https://peasytext.com/text/text-case-converter/) · [Sort Lines](https://peasytext.com/text/sort-lines/) · [Lorem Ipsum Generator](https://peasytext.com/text/lorem-ipsum-generator/) · [Slug Generator](https://peasytext.com/text/slug-generator/) · [Find and Replace](https://peasytext.com/text/find-and-replace/) · [Remove Duplicate Lines](https://peasytext.com/text/remove-duplicate-lines/) · [Base64 Encode Decode](https://peasytext.com/text/base64-encode-decode/) · [URL Encode Decode](https://peasytext.com/text/url-encode-decode/) · [JSON Formatter](https://peasytext.com/text/json-formatter/) · [HTML Entity Encoder](https://peasytext.com/text/html-entity-encoder/) · [Reverse Text](https://peasytext.com/text/reverse-text/) · [Line Numbers](https://peasytext.com/text/line-numbers/) · [Text Diff](https://peasytext.com/text/text-diff/) · [Text Extractor](https://peasytext.com/text/text-extractor/) · [All Tools](https://peasytext.com/)
- **Guides**: [Text Encoding UTF-8 ASCII](https://peasytext.com/guides/text-encoding-utf8-ascii/) · [Regex Cheat Sheet Essential Patterns](https://peasytext.com/guides/regex-cheat-sheet-essential-patterns/) · [Lorem Ipsum Placeholder Text Guide](https://peasytext.com/guides/lorem-ipsum-placeholder-text-guide/) · [Regex Practical Guide](https://peasytext.com/guides/regex-practical-guide/) · [Base64 Encoding Guide](https://peasytext.com/guides/base64-encoding-guide/) · [Convert Case and Clean Text](https://peasytext.com/guides/convert-case-clean-text/) · [Word Character Line Counting Best Practices](https://peasytext.com/guides/word-character-line-counting-best-practices/) · [How to Find and Replace with Regex](https://peasytext.com/guides/how-to-find-replace-regex/) · [Slug Generation URL-Safe Strings](https://peasytext.com/guides/slug-generation-url-safe-strings/) · [Troubleshooting Line Endings CRLF LF](https://peasytext.com/guides/troubleshooting-line-endings-crlf-lf/) · [Troubleshooting Character Encoding](https://peasytext.com/guides/troubleshooting-character-encoding/) · [All Guides](https://peasytext.com/guides/)
- **Glossary**: [ASCII](https://peasytext.com/glossary/ascii/) · [BOM](https://peasytext.com/glossary/bom/) · [Case Conversion](https://peasytext.com/glossary/case-conversion/) · [Diacritics](https://peasytext.com/glossary/diacritics/) · [Escape Character](https://peasytext.com/glossary/escape-character/) · [Line Ending](https://peasytext.com/glossary/line-ending/) · [Lorem Ipsum](https://peasytext.com/glossary/lorem-ipsum/) · [Normalization](https://peasytext.com/glossary/normalization-text/) · [Plain Text](https://peasytext.com/glossary/plain-text/) · [Slug](https://peasytext.com/glossary/slug/) · [Text Encoding](https://peasytext.com/glossary/text-encoding/) · [Unicode](https://peasytext.com/glossary/unicode/) · [Whitespace](https://peasytext.com/glossary/whitespace/) · [Word Count](https://peasytext.com/glossary/word-count/) · [All Terms](https://peasytext.com/glossary/)
- **Formats**: [TXT](https://peasytext.com/formats/txt/) · [CSV](https://peasytext.com/formats/csv/) · [JSON](https://peasytext.com/formats/json/) · [HTML](https://peasytext.com/formats/html/) · [Markdown](https://peasytext.com/formats/md/) · [XML](https://peasytext.com/formats/xml/) · [YAML](https://peasytext.com/formats/yaml/) · [All Formats](https://peasytext.com/formats/)
- **API**: [REST API Docs](https://peasytext.com/developers/) · [OpenAPI Spec](https://peasytext.com/api/openapi.json)

## Also Available

| Language | Package | Install |
|----------|---------|---------|
| **Python** | [peasytext](https://pypi.org/project/peasytext/) | `pip install "peasytext[all]"` |
| **Go** | [peasytext-go](https://pkg.go.dev/github.com/peasytools/peasytext-go) | `go get github.com/peasytools/peasytext-go` |
| **Rust** | [peasytext](https://crates.io/crates/peasytext) | `cargo add peasytext` |
| **Ruby** | [peasytext](https://rubygems.org/gems/peasytext) | `gem install peasytext` |

## Peasy Developer Tools

Part of the [Peasy Tools](https://peasytools.com) open-source developer ecosystem.

| Package | PyPI | npm | Description |
|---------|------|-----|-------------|
| peasy-pdf | [PyPI](https://pypi.org/project/peasy-pdf/) | [npm](https://www.npmjs.com/package/peasy-pdf) | PDF merge, split, rotate, compress, 21 operations — [peasypdf.com](https://peasypdf.com) |
| peasy-image | [PyPI](https://pypi.org/project/peasy-image/) | [npm](https://www.npmjs.com/package/peasy-image) | Image resize, crop, convert, compress — [peasyimage.com](https://peasyimage.com) |
| peasy-audio | [PyPI](https://pypi.org/project/peasy-audio/) | [npm](https://www.npmjs.com/package/peasy-audio) | Audio trim, merge, convert, normalize — [peasyaudio.com](https://peasyaudio.com) |
| peasy-video | [PyPI](https://pypi.org/project/peasy-video/) | [npm](https://www.npmjs.com/package/peasy-video) | Video trim, resize, thumbnails, GIF — [peasyvideo.com](https://peasyvideo.com) |
| peasy-css | [PyPI](https://pypi.org/project/peasy-css/) | [npm](https://www.npmjs.com/package/peasy-css) | CSS minify, format, analyze — [peasycss.com](https://peasycss.com) |
| peasy-compress | [PyPI](https://pypi.org/project/peasy-compress/) | [npm](https://www.npmjs.com/package/peasy-compress) | ZIP, TAR, gzip compression — [peasytools.com](https://peasytools.com) |
| peasy-document | [PyPI](https://pypi.org/project/peasy-document/) | [npm](https://www.npmjs.com/package/peasy-document) | Markdown, HTML, CSV, JSON conversion — [peasyformats.com](https://peasyformats.com) |
| **peasytext** | **[PyPI](https://pypi.org/project/peasytext/)** | **[npm](https://www.npmjs.com/package/peasytext)** | **Text case conversion, slugify, word count — [peasytext.com](https://peasytext.com)** |

## License

MIT
