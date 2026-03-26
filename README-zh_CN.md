# MDParser

> 轻量级纯 JavaScript 编写的 Markdown 解析器，支持语法高亮和 GFM 扩展。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [中文](README-zh_CN.md)

## 特性

- **纯 JavaScript** - 无依赖，支持浏览器和 Node.js
- **语法高亮** - 内置多种语言代码高亮
- **GFM 支持** - GitHub 风格 Markdown 表格和任务列表
- **所见即所得编辑器** - 实时预览，支持格式化工具栏
- **可定制** - 丰富的配置选项
- **安全** - HTML 过滤，防止 XSS 攻击

## 支持的语法

| 功能 | 描述 |
|------|------|
| 标题 | H1-H6 |
| 强调 | 粗体、斜体、删除线 |
| 列表 | 有序、无序、任务列表 |
| 代码 | 行内代码和代码块 |
| 链接与图片 | 标准 Markdown 语法 |
| 区块引用 | 嵌套引用 |
| 表格 | GFM 表格语法 |
| 分割线 | `---`、`***`、`___` |
| 自动链接 | 自动识别 URL |

## 快速开始

### 浏览器环境

```html
<script src="MDParser.js"></script>
<script>
    var parser = new MDParser();
    var html = parser.parse('# 你好世界');
    document.body.innerHTML = html;
</script>
```

### Node.js 环境

```javascript
var MDParser = require('./MDParser.js');
var parser = new MDParser();
var html = parser.parse('# 你好世界');
console.log(html);
```

## 使用方法

```javascript
var parser = new MDParser({
    sanitize: true,      // 启用 XSS 防护
    highlight: true,     // 语法高亮
    gfm: true,          // GitHub 风格 Markdown
    tables: true,       // 表格支持
    tasklists: true,    // 任务列表支持
    linkify: true       // 自动链接 URL
});

var markdown = `
# 标题

这是**粗体**和*斜体*文本。

\`\`\`javascript
function hello() {
    console.log('你好！');
}
\`\`\`

- [x] 任务 1
- [ ] 任务 2

| 列1 | 列2 |
|-----|-----|
| 单元格1 | 单元格2 |
`;

var html = parser.parse(markdown);
document.getElementById('preview').innerHTML = html;
```

## API

### 构造函数

```javascript
var parser = new MDParser(options);
```

### 方法

| 方法 | 描述 |
|------|------|
| `parse(markdown)` | 将 Markdown 解析为 HTML |
| `setOptions(options)` | 更新配置 |
| `getOptions()` | 获取当前配置 |
| `getVersion()` | 获取版本号 |
| `getFeatures()` | 获取支持的特性列表 |
| `escapeHtml(text)` | 转义 HTML 实体 |

### 配置选项

| 选项 | 默认值 | 描述 |
|------|--------|------|
| `sanitize` | `true` | HTML 过滤 |
| `highlight` | `true` | 代码高亮 |
| `highlightTheme` | `'github'` | 高亮主题 |
| `linkify` | `true` | 自动链接 URL |
| `breaks` | `false` | 换行转 `<br>` |
| `gfm` | `true` | GitHub 风格 Markdown |
| `tables` | `true` | 表格支持 |
| `tasklists` | `true` | 任务列表支持 |

## 所见即所得编辑器

在浏览器中打开 `dist/index.html` 即可使用实时预览编辑器，包含：

- 实时 Markdown 预览
- 格式化工具栏
- 浅色/深色主题切换
- 复制 HTML / 下载 HTML
- 可调节大小的面板

## 支持高亮的语言

- JavaScript / JS
- Python
- HTML
- CSS
- JSON
- SQL
- Bash

## 浏览器兼容性

- Chrome / Edge（最新版）
- Firefox（最新版）
- Safari（最新版）
- Opera（最新版）

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)。

## 作者

[SoraStr](https://github.com/SoraStr)
