import { describe, it, expect } from "vitest";
import {
  toCase,
  slugify,
  countText,
  sortLines,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEncode,
  htmlDecode,
  findReplace,
  dedupeLines,
  addLineNumbers,
  removeLineNumbers,
  extract,
  diffTexts,
  loremIpsum,
  reverseText,
  jsonFormat,
  jsonMinify,
  jsonValidate,
} from "../src/index.js";

// ── Case conversion ──────────────────────────────────────────────

describe("toCase", () => {
  it("converts to uppercase", () => {
    expect(toCase("hello world", "upper")).toBe("HELLO WORLD");
  });

  it("converts to lowercase", () => {
    expect(toCase("HELLO WORLD", "lower")).toBe("hello world");
  });

  it("converts to title case", () => {
    expect(toCase("hello world", "title")).toBe("Hello World");
  });

  it("converts to camelCase", () => {
    expect(toCase("hello world", "camel")).toBe("helloWorld");
  });

  it("converts to PascalCase", () => {
    expect(toCase("hello world", "pascal")).toBe("HelloWorld");
  });

  it("converts to snake_case", () => {
    expect(toCase("hello world", "snake")).toBe("hello_world");
  });

  it("converts to kebab-case", () => {
    expect(toCase("hello world", "kebab")).toBe("hello-world");
  });

  it("converts to CONSTANT_CASE", () => {
    expect(toCase("hello world", "constant")).toBe("HELLO_WORLD");
  });

  it("converts to dot.case", () => {
    expect(toCase("hello world", "dot")).toBe("hello.world");
  });

  it("converts to path/case", () => {
    expect(toCase("hello world", "path")).toBe("hello/world");
  });

  it("converts to aLtErNaTiNg", () => {
    expect(toCase("hello", "alternating")).toBe("hElLo");
  });

  it("inverts case", () => {
    expect(toCase("Hello World", "inverse")).toBe("hELLO wORLD");
  });

  it("defaults to uppercase", () => {
    expect(toCase("hello")).toBe("HELLO");
  });

  it("handles camelCase input", () => {
    expect(toCase("camelCase", "snake")).toBe("camel_case");
  });

  it("returns empty for empty words", () => {
    expect(toCase("", "camel")).toBe("");
  });
});

// ── Slug generation ──────────────────────────────────────────────

describe("slugify", () => {
  it("creates basic slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(slugify("Héllo Wörld")).toBe("hello-world");
  });

  it("uses custom separator", () => {
    expect(slugify("Hello World", { separator: "_" })).toBe("hello_world");
  });

  it("preserves case when lowercase=false", () => {
    expect(slugify("Hello World", { lowercase: false })).toBe("Hello-World");
  });

  it("truncates with maxLength", () => {
    const slug = slugify("This is a very long title for testing", { maxLength: 15 });
    expect(slug.length).toBeLessThanOrEqual(15);
  });

  it("handles multiline text", () => {
    expect(slugify("Line One\nLine Two")).toBe("line-one\nline-two");
  });
});

// ── Text statistics ──────────────────────────────────────────────

describe("countText", () => {
  it("counts basic text", () => {
    const stats = countText("Hello world");
    expect(stats.characters).toBe(11);
    expect(stats.words).toBe(2);
    expect(stats.lines).toBe(1);
  });

  it("counts characters without spaces", () => {
    const stats = countText("a b c");
    expect(stats.charactersNoSpaces).toBe(3);
  });

  it("counts sentences", () => {
    const stats = countText("Hello. World! How?");
    expect(stats.sentences).toBe(3);
  });

  it("counts paragraphs", () => {
    const stats = countText("Para 1\n\nPara 2\n\nPara 3");
    expect(stats.paragraphs).toBe(3);
  });

  it("handles empty text", () => {
    const stats = countText("");
    expect(stats.words).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.lines).toBe(0);
  });

  it("calculates reading time", () => {
    const words = Array(400).fill("word").join(" ");
    const stats = countText(words);
    expect(stats.readingTime).toBe("2 min");
  });

  it("shows < 1 min for short text", () => {
    const stats = countText("Short text.");
    expect(stats.readingTime).toBe("< 1 min");
  });
});

// ── Sort lines ───────────────────────────────────────────────────

describe("sortLines", () => {
  it("sorts alphabetically", () => {
    expect(sortLines("banana\napple\ncherry")).toBe("apple\nbanana\ncherry");
  });

  it("sorts alphabetically descending", () => {
    expect(sortLines("apple\ncherry\nbanana", "alpha-desc")).toBe("cherry\nbanana\napple");
  });

  it("sorts by length", () => {
    expect(sortLines("cc\na\nbbb", "length")).toBe("a\ncc\nbbb");
  });

  it("sorts by length descending", () => {
    expect(sortLines("cc\na\nbbb", "length-desc")).toBe("bbb\ncc\na");
  });

  it("sorts numerically", () => {
    expect(sortLines("10 items\n2 items\n1 item", "numeric")).toBe(
      "1 item\n2 items\n10 items",
    );
  });

  it("reverses lines", () => {
    expect(sortLines("a\nb\nc", "reverse")).toBe("c\nb\na");
  });

  it("shuffles lines", () => {
    const input = "a\nb\nc\nd\ne";
    const result = sortLines(input, "shuffle");
    expect(result.split("\n").sort()).toEqual(input.split("\n").sort());
  });
});

// ── Base64 ───────────────────────────────────────────────────────

describe("base64Encode / base64Decode", () => {
  it("encodes and decodes ASCII", () => {
    expect(base64Encode("Hello World")).toBe("SGVsbG8gV29ybGQ=");
    expect(base64Decode("SGVsbG8gV29ybGQ=")).toBe("Hello World");
  });

  it("round-trips UTF-8", () => {
    const text = "こんにちは世界";
    expect(base64Decode(base64Encode(text))).toBe(text);
  });

  it("throws on invalid base64", () => {
    expect(() => base64Decode("!!!")).toThrow();
  });
});

// ── URL encode/decode ────────────────────────────────────────────

describe("urlEncode / urlDecode", () => {
  it("encodes special characters", () => {
    expect(urlEncode("hello world")).toBe("hello%20world");
  });

  it("encodes with plus for spaces", () => {
    expect(urlEncode("hello world", true)).toBe("hello+world");
  });

  it("decodes URL-encoded string", () => {
    expect(urlDecode("hello%20world")).toBe("hello world");
  });

  it("decodes plus as space", () => {
    expect(urlDecode("hello+world")).toBe("hello world");
  });
});

// ── HTML entities ────────────────────────────────────────────────

describe("htmlEncode / htmlDecode", () => {
  it("encodes HTML special characters", () => {
    expect(htmlEncode('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
    );
  });

  it("encodes ampersand", () => {
    expect(htmlEncode("A & B")).toBe("A &amp; B");
  });

  it("decodes HTML entities", () => {
    expect(htmlDecode("&lt;b&gt;bold&lt;/b&gt;")).toBe("<b>bold</b>");
  });

  it("round-trips", () => {
    const text = '<div class="test">A & B\'s</div>';
    expect(htmlDecode(htmlEncode(text))).toBe(text);
  });
});

// ── Find & replace ───────────────────────────────────────────────

describe("findReplace", () => {
  it("replaces plain text", () => {
    expect(findReplace("hello world", "world", "earth")).toBe("hello earth");
  });

  it("replaces all occurrences", () => {
    expect(findReplace("aaa", "a", "b")).toBe("bbb");
  });

  it("case-insensitive replace", () => {
    expect(findReplace("Hello HELLO hello", "hello", "hi", { caseSensitive: false })).toBe(
      "hi hi hi",
    );
  });

  it("regex replace", () => {
    expect(findReplace("abc 123 def 456", "\\d+", "NUM", { regex: true })).toBe(
      "abc NUM def NUM",
    );
  });

  it("returns unchanged for empty find", () => {
    expect(findReplace("hello", "", "x")).toBe("hello");
  });
});

// ── Deduplicate lines ────────────────────────────────────────────

describe("dedupeLines", () => {
  it("removes duplicate lines", () => {
    expect(dedupeLines("a\nb\na\nc\nb")).toBe("a\nb\nc");
  });

  it("case-insensitive dedup", () => {
    expect(dedupeLines("Hello\nhello\nHELLO", false)).toBe("Hello");
  });
});

// ── Line numbers ─────────────────────────────────────────────────

describe("addLineNumbers / removeLineNumbers", () => {
  it("adds line numbers", () => {
    expect(addLineNumbers("a\nb\nc")).toBe("1: a\n2: b\n3: c");
  });

  it("adds with custom start", () => {
    expect(addLineNumbers("a\nb", { start: 5 })).toBe("5: a\n6: b");
  });

  it("pads line numbers", () => {
    const lines = Array(12).fill("x").join("\n");
    const result = addLineNumbers(lines);
    expect(result.startsWith(" 1: x")).toBe(true);
  });

  it("uses custom separator", () => {
    expect(addLineNumbers("a", { separator: ") " })).toBe("1) a");
  });

  it("removes line numbers", () => {
    expect(removeLineNumbers("1: a\n2: b\n3: c")).toBe("a\nb\nc");
  });

  it("removes various formats", () => {
    expect(removeLineNumbers("1. a\n2) b\n3| c")).toBe("a\nb\nc");
  });
});

// ── Extract patterns ─────────────────────────────────────────────

describe("extract", () => {
  it("extracts emails", () => {
    expect(extract("Contact user@example.com or admin@test.org")).toEqual([
      "user@example.com",
      "admin@test.org",
    ]);
  });

  it("extracts URLs", () => {
    expect(extract("Visit https://example.com today", "urls")).toEqual([
      "https://example.com",
    ]);
  });

  it("extracts numbers", () => {
    expect(extract("Got 42 items and 3.14 pi", "numbers")).toEqual(["42", "3.14"]);
  });

  it("extracts hashtags", () => {
    expect(extract("#hello world #test", "hashtags")).toEqual(["#hello", "#test"]);
  });

  it("extracts mentions", () => {
    expect(extract("Hello @alice and @bob", "mentions")).toEqual(["@alice", "@bob"]);
  });

  it("extracts IPs", () => {
    expect(extract("Server at 192.168.1.1", "ips")).toEqual(["192.168.1.1"]);
  });
});

// ── Diff texts ───────────────────────────────────────────────────

describe("diffTexts", () => {
  it("finds added and removed lines", () => {
    const result = diffTexts("a\nb\nc", "b\nc\nd");
    expect(result.added).toEqual(["d"]);
    expect(result.removed).toEqual(["a"]);
    expect(result.unchanged).toEqual(["b", "c"]);
  });

  it("calculates similarity", () => {
    const result = diffTexts("a\nb", "a\nb");
    expect(result.similarity).toBe(1.0);
  });

  it("handles completely different texts", () => {
    const result = diffTexts("a", "b");
    expect(result.similarity).toBe(0);
  });
});

// ── Lorem Ipsum ──────────────────────────────────────────────────

describe("loremIpsum", () => {
  it("generates words", () => {
    const words = loremIpsum(5, "words");
    expect(words.split(" ").length).toBe(5);
  });

  it("generates sentences", () => {
    const text = loremIpsum(3, "sentences");
    // Each sentence ends with a period
    const sentences = text.split(". ").length;
    expect(sentences).toBeGreaterThanOrEqual(2);
  });

  it("generates paragraphs", () => {
    const text = loremIpsum(2, "paragraphs");
    expect(text.split("\n\n").length).toBe(2);
  });

  it("returns empty for zero count", () => {
    expect(loremIpsum(0)).toBe("");
  });

  it("starts with lorem", () => {
    expect(loremIpsum(1, "words").startsWith("lorem")).toBe(true);
  });
});

// ── Reverse text ─────────────────────────────────────────────────

describe("reverseText", () => {
  it("reverses characters", () => {
    expect(reverseText("hello")).toBe("olleh");
  });

  it("reverses words", () => {
    expect(reverseText("hello world", "words")).toBe("world hello");
  });

  it("reverses lines", () => {
    expect(reverseText("a\nb\nc", "lines")).toBe("c\nb\na");
  });
});

// ── JSON format/validate ─────────────────────────────────────────

describe("jsonFormat / jsonMinify / jsonValidate", () => {
  it("formats JSON", () => {
    expect(jsonFormat('{"a":1}')).toBe('{\n  "a": 1\n}');
  });

  it("formats with custom indent", () => {
    expect(jsonFormat('{"a":1}', 4)).toBe('{\n    "a": 1\n}');
  });

  it("minifies JSON", () => {
    expect(jsonMinify('{\n  "a": 1\n}')).toBe('{"a":1}');
  });

  it("validates valid JSON", () => {
    expect(jsonValidate('{"a": 1}')).toBe(true);
  });

  it("validates invalid JSON", () => {
    expect(jsonValidate("{invalid}")).toBe(false);
  });

  it("throws on invalid JSON format", () => {
    expect(() => jsonFormat("{invalid}")).toThrow("Invalid JSON");
  });

  it("throws on invalid JSON minify", () => {
    expect(() => jsonMinify("{invalid}")).toThrow("Invalid JSON");
  });
});
