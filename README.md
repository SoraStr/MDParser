# MDParser

> A lightweight, pure JavaScript Markdown parser with syntax highlighting and GFM support.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [中文](README-zh_CN.md)

## Features

- **Pure JavaScript** - No dependencies, works in browsers and Node.js
- **Syntax Highlighting** - Built-in code highlighting for multiple languages
- **GFM Support** - GitHub Flavored Markdown tables and task lists
- **WYSIWYG Editor** - Real-time preview with formatting toolbar
- **Customizable** - Extensive configuration options
- **Secure** - HTML sanitization to prevent XSS attacks

## Supported Syntax

| Feature | Description |
|---------|-------------|
| Headings | H1-H6 |
| Emphasis | Bold, Italic, Strikethrough |
| Lists | Ordered, Unordered, Task lists |
| Code | Inline and fenced code blocks |
| Links & Images | Standard Markdown syntax |
| Blockquotes | Nested blockquotes |
| Tables | GFM table syntax |
| Horizontal Rules | `---`, `***`, `___` |
| Auto Links | Automatic URL detection |

## Quick Start

### Browser

```html
<script src="MDParser.js"></script>
<script>
    var parser = new MDParser();
    var html = parser.parse('# Hello World');
    document.body.innerHTML = html;
</script>
```

### Node.js

```javascript
var MDParser = require('./MDParser.js');
var parser = new MDParser();
var html = parser.parse('# Hello World');
console.log(html);
```

## Usage

```javascript
var parser = new MDParser({
    sanitize: true,      // Enable XSS protection
    highlight: true,     // Syntax highlighting
    gfm: true,          // GitHub Flavored Markdown
    tables: true,       // Table support
    tasklists: true,    // Task list support
    linkify: true       // Auto-link URLs
});

var markdown = `
# Heading

This is **bold** and *italic* text.

\`\`\`javascript
function hello() {
    console.log('Hello!');
}
\`\`\`

- [x] Task 1
- [ ] Task 2

| Column 1 | Column 2 |
|---------|----------|
| Cell 1  | Cell 2  |
`;

var html = parser.parse(markdown);
document.getElementById('preview').innerHTML = html;
```

## API

### Constructor

```javascript
var parser = new MDParser(options);
```

### Methods

| Method | Description |
|--------|-------------|
| `parse(markdown)` | Parse Markdown to HTML |
| `setOptions(options)` | Update configuration |
| `getOptions()` | Get current options |
| `getVersion()` | Get parser version |
| `getFeatures()` | List supported features |
| `escapeHtml(text)` | Escape HTML entities |

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `sanitize` | `true` | HTML sanitization |
| `highlight` | `true` | Code highlighting |
| `highlightTheme` | `'github'` | Highlight theme |
| `linkify` | `true` | Auto-link URLs |
| `breaks` | `false` | Convert newlines to `<br>` |
| `gfm` | `true` | GitHub Flavored Markdown |
| `tables` | `true` | Table support |
| `tasklists` | `true` | Task list support |

## WYSIWYG Editor

Open `dist/index.html` in your browser to use the live preview editor with:

- Real-time Markdown preview
- Formatting toolbar
- Light/Dark theme toggle
- Copy HTML / Download HTML
- Resizable panels

## Supported Languages for Highlighting

- JavaScript / JS
- Python
- HTML
- CSS
- JSON
- SQL
- Bash

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

[SoraStr](https://github.com/SoraStr)
