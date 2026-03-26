# MDParser API Documentation

> Pure JavaScript Markdown Parser - Developer Guide

**Version**: 1.0.1  
**Last Updated**: March 25, 2026

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Constructor](#constructor)
3. [Core Methods](#core-methods)
4. [Configuration Options](#configuration-options)
5. [Helper Methods](#helper-methods)
6. [Usage Examples](#usage-examples)
7. [Supported Markdown Syntax](#supported-markdown-syntax)

---

## Quick Start

### Browser Environment

```html
<script src="MDParser.js"></script>
<script>
    var parser = new MDParser();
    var html = parser.parse('# Hello World');
    document.body.innerHTML = html;
</script>
```

### Node.js Environment

```javascript
var MDParser = require('./MDParser.js');
var parser = new MDParser();
var html = parser.parse('# Hello World');
console.log(html);
```

---

## Constructor

### `new MDParser(options)`

Creates a new MDParser instance.

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| options | Object | No | {} | Configuration options object |

**Returns**: `MDParser` instance

**Example**:

```javascript
// Default configuration
var parser = new MDParser();

// Custom configuration
var parser = new MDParser({
    sanitize: true,
    highlight: true,
    gfm: true,
    tables: true
});
```

---

## Core Methods

### `parse(markdown)`

Converts Markdown text to HTML.

**Syntax**:

```javascript
var html = parser.parse(markdown);
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| markdown | string | Yes | Markdown formatted text |

**Returns**: `string` - Converted HTML string

**Example**:

```javascript
var parser = new MDParser();

// Simple text
var html1 = parser.parse('# Heading');
// Returns: <h1>Heading</h1>

// Complex content
var html2 = parser.parse(`
# Main Heading

This is **bold** and *italic* text.

## Code Example

\`\`\`javascript
function hello() {
    console.log('Hello!');
}
\`\`\`

## Unordered List
- Item 1
- Item 2
- Item 3

## Ordered List
1. First item
2. Second item
3. Third item

## Task List
- [x] Completed
- [ ] Incomplete

## Blockquote
> This is a blockquote

## Table
| Name | Version | Status |
|------|---------|--------|
| MDParser | 1.0.1 | Stable |
`);
```

---

## Configuration Options

### Option Details

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| sanitize | boolean | true | Enable HTML sanitization for XSS protection |
| highlight | boolean | true | Enable syntax highlighting for code blocks |
| highlightTheme | string | 'github' | Code highlighting theme (github only for now) |
| linkify | boolean | true | Auto-convert URLs to clickable links |
| breaks | boolean | false | Convert single newlines to `<br>` tags |
| gfm | boolean | true | Enable GitHub Flavored Markdown |
| tables | boolean | true | Enable table syntax |
| tasklists | boolean | true | Enable task list syntax |

### `setOptions(options)`

Set configuration options.

**Syntax**:

```javascript
parser.setOptions(options);
```

**Example**:

```javascript
var parser = new MDParser();

// Modify options
parser.setOptions({
    highlightTheme: 'github',
    breaks: true,
    tables: false
});
```

### `getOptions()`

Get current configuration.

**Syntax**:

```javascript
var options = parser.getOptions();
```

**Returns**: `Object` - Copy of current configuration

**Example**:

```javascript
var parser = new MDParser();
var currentOptions = parser.getOptions();
console.log(currentOptions.highlight); // true
```

---

## Helper Methods

### `escapeHtml(text)`

Escape HTML special characters to prevent XSS attacks.

**Syntax**:

```javascript
var escaped = parser.escapeHtml(text);
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Text to escape |

**Returns**: `string` - Escaped text

**Example**:

```javascript
var parser = new MDParser();
var safe = parser.escapeHtml('<script>alert("XSS")</script>');
// Returns: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### `getVersion()`

Get parser version number.

**Syntax**:

```javascript
var version = parser.getVersion();
```

**Returns**: `string` - Version number

**Example**:

```javascript
var parser = new MDParser();
console.log(parser.getVersion()); // "1.0.1"
```

### `getFeatures()`

Get list of supported features.

**Syntax**:

```javascript
var features = parser.getFeatures();
```

**Returns**: `Array` - Array of supported feature names

**Example**:

```javascript
var parser = new MDParser();
var features = parser.getFeatures();
console.log(features);
// ["headings", "blockquotes", "lists", "tasklists", "codeblocks", ...]
```

---

## Usage Examples

### Complete Example: Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MDParser Demo</title>
    <script src="MDParser.js"></script>
</head>
<body>
    <textarea id="editor" placeholder="Enter Markdown here..."></textarea>
    <div id="preview"></div>

    <script>
        var parser = new MDParser({
            highlight: true,
            gfm: true
        });
        
        var editor = document.getElementById('editor');
        var preview = document.getElementById('preview');
        
        editor.addEventListener('input', function() {
            var html = parser.parse(editor.value);
            preview.innerHTML = html;
        });
    </script>
</body>
</html>
```

### Complete Example: Blog Article Rendering

```javascript
var parser = new MDParser({
    sanitize: true,
    highlight: true,
    gfm: true,
    tables: true,
    tasklists: true
});

var markdownContent = `
# My Blog Article

**Author**: John Doe  
**Date**: 2026-03-25

## Introduction

This is a sample article written in Markdown.

## Code Example

\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10)); // 55
\`\`\`

## Task List

- [x] Markdown parsing
- [x] Code highlighting
- [x] Table support
- [ ] More features coming

## Table

| Feature | Status | Description |
|---------|--------|-------------|
| Headings | Done | Supports H1-H6 |
| Lists | Done | Ordered and unordered |
| Highlighting | Done | Built-in syntax highlighting |

## Links & Images

[Visit GitHub](https://github.com)

![Sample Image](https://example.com/image.jpg)

## Blockquote

> Thanks for using MDParser!
`;

var html = parser.parse(markdownContent);
document.getElementById('article').innerHTML = html;
```

### Complete Example: Comment System

```javascript
var parser = new MDParser({
    sanitize: true,      // Required for XSS protection
    gfm: true,
    tasklists: false     // Not needed in comments
});

function renderComment(markdownText) {
    return parser.parse(markdownText);
}

// Usage
var commentHTML = renderComment('User says: This article is **awesome**! [View original](https://example.com)');
document.getElementById('comment').innerHTML = commentHTML;
```

---

## Supported Markdown Syntax

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Emphasis

```markdown
**Bold text**
*Italic text*
~~Strikethrough text~~
```

### Lists

**Unordered List**:
```markdown
- Item 1
- Item 2
  - Nested item
```

**Ordered List**:
```markdown
1. First item
2. Second item
3. Third item
```

**Task List**:
```markdown
- [x] Completed
- [ ] Incomplete
```

### Code

**Inline Code**: 
```markdown
This is `inline code`
```

**Code Block**:
````markdown
```javascript
function hello() {
    console.log('Hello');
}
```
````

> Supported languages: javascript, js, python, html, css, json, sql, bash

### Links & Images

```markdown
[Link Text](https://example.com)
![Alt Text](image.jpg)
```

> Image alt text is optional

### Blockquotes

```markdown
> This is a blockquote
> Can span multiple lines
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Content  | Content  | Content  |
```

### Horizontal Rules

```markdown
---
```

### Auto Links

```markdown
https://example.com
```

> Automatically converted to clickable links

### Escaping

```markdown
Use \* to escape asterisks
Use \\ to escape backslashes
```

---

## Notes

1. **Security**: Keep `sanitize` option as `true` to prevent XSS attacks.

2. **Performance**: For large content, use debounce to optimize rendering frequency.

3. **Code Highlighting**: Supports syntax highlighting for JavaScript, Python, HTML, CSS, JSON, SQL, Bash and more.

4. **Compatibility**: Written in pure JavaScript, compatible with all modern browsers.

---

## Changelog

### v1.0.1 (2026-03-25)
- Fixed code blocks, tables, blockquotes, links, and images rendering issues
- Fixed inline elements rendering inside lists
- Optimized code highlighting logic
- Improved regex matching

### v1.0.0 (2026-03-25)
- Initial release
- Support for common Markdown syntax
- Code highlighting support
- GitHub Flavored Markdown extensions (tables, task lists)
- Multiple configuration options
