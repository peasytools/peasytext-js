Output demo.gif

Set Shell zsh
Set Width 900
Set Height 550
Set FontSize 14
Set Padding 15
Set TypingSpeed 40ms

Type `node`
Enter
Sleep 1s

Type `const { toCase, slugify, countText, loremIpsum } = await import('./dist/index.js')`
Enter
Sleep 1s

Type `// Case conversion — 13 styles`
Enter
Sleep 300ms
Type `toCase('hello world demo', 'title')`
Enter
Sleep 1.5s

Type `toCase('hello world demo', 'camel')`
Enter
Sleep 1.5s

Type `// Slug generation`
Enter
Sleep 300ms
Type `slugify('Hello World! 안녕하세요')`
Enter
Sleep 1.5s

Type `// Word counting`
Enter
Sleep 300ms
Type `countText('The quick brown fox jumps over the lazy dog')`
Enter
Sleep 1.5s

Type `// Lorem Ipsum`
Enter
Sleep 300ms
Type `loremIpsum({ paragraphs: 1, sentences: 2 })`
Enter
Sleep 2s

Type `.exit`
Enter
Sleep 500ms
