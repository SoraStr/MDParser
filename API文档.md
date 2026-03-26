# MDParser API 文档

> 原生JavaScript Markdown解析器 - 二次开发指南

**版本**: 1.0.1  
**更新时间**: 2026年3月25日

---

## 目录

1. [快速开始](#快速开始)
2. [构造函数](#构造函数)
3. [核心方法](#核心方法)
4. [配置选项](#配置选项)
5. [辅助方法](#辅助方法)
6. [使用示例](#使用示例)
7. [支持的Markdown语法](#支持的markdown语法)

---

## 快速开始

### 浏览器环境

```html
<script src="MDParser.js"></script>
<script>
    var parser = new MDParser();
    var html = parser.parse('# Hello World');
    document.body.innerHTML = html;
</script>
```

### Node.js环境

```javascript
var MDParser = require('./MDParser.js');
var parser = new MDParser();
var html = parser.parse('# Hello World');
console.log(html);
```

---

## 构造函数

### `new MDParser(options)`

创建MDParser实例。

**参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| options | Object | 否 | {} | 配置选项对象 |

**返回值**: `MDParser` 实例

**示例**:

```javascript
// 使用默认配置
var parser = new MDParser();

// 自定义配置
var parser = new MDParser({
    sanitize: true,
    highlight: true,
    gfm: true,
    tables: true
});
```

---

## 核心方法

### `parse(markdown)`

将Markdown文本解析为HTML。

**语法**:

```javascript
var html = parser.parse(markdown);
```

**参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| markdown | string | 是 | Markdown格式的文本 |

**返回值**: `string` - 转换后的HTML字符串

**示例**:

```javascript
var parser = new MDParser();

// 解析简单文本
var html1 = parser.parse('# 标题');
// 返回: <h1>标题</h1>

// 解析复杂内容
var html2 = parser.parse(`
# 主标题

这是一个**粗体**和*斜体*的示例。

## 代码示例

\`\`\`javascript
function hello() {
    console.log('Hello!');
}
\`\`\`

## 无序列表
- 列表项1
- 列表项2
- 列表项3

## 有序列表
1. 第一项
2. 第二项
3. 第三项

## 任务列表
- [x] 已完成
- [ ] 未完成

## 区块引用
> 这是引用内容

## 表格
| 名称 | 版本 | 状态 |
|------|------|------|
| MDParser | 1.0.1 | 正式版 |
`);
```

---

## 配置选项

### 选项详情

| 选项名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| sanitize | boolean | true | 是否启用HTML安全过滤 |
| highlight | boolean | true | 是否启用代码高亮 |
| highlightTheme | string | 'github' | 代码高亮主题（暂支持 github） |
| linkify | boolean | true | 是否自动转换URL为链接 |
| breaks | boolean | false | 是否将单个换行转为`<br>` |
| gfm | boolean | true | 是否启用GitHub风格Markdown |
| tables | boolean | true | 是否支持表格语法 |
| tasklists | boolean | true | 是否支持任务列表 |

### `setOptions(options)`

设置配置选项。

**语法**:

```javascript
parser.setOptions(options);
```

**示例**:

```javascript
var parser = new MDParser();

// 修改配置
parser.setOptions({
    highlightTheme: 'github',
    breaks: true,
    tables: false
});
```

### `getOptions()`

获取当前配置。

**语法**:

```javascript
var options = parser.getOptions();
```

**返回值**: `Object` - 当前配置对象的副本

**示例**:

```javascript
var parser = new MDParser();
var currentOptions = parser.getOptions();
console.log(currentOptions.highlight); // true
```

---

## 辅助方法

### `escapeHtml(text)`

转义HTML特殊字符，防止XSS攻击。

**语法**:

```javascript
var escaped = parser.escapeHtml(text);
```

**参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| text | string | 是 | 需要转义的文本 |

**返回值**: `string` - 转义后的文本

**示例**:

```javascript
var parser = new MDParser();
var safe = parser.escapeHtml('<script>alert("XSS")</script>');
// 返回: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### `getVersion()`

获取解析器版本号。

**语法**:

```javascript
var version = parser.getVersion();
```

**返回值**: `string` - 版本号

**示例**:

```javascript
var parser = new MDParser();
console.log(parser.getVersion()); // "1.0.1"
```

### `getFeatures()`

获取支持的特性列表。

**语法**:

```javascript
var features = parser.getFeatures();
```

**返回值**: `Array` - 支持的特性名称数组

**示例**:

```javascript
var parser = new MDParser();
var features = parser.getFeatures();
console.log(features);
// ["headings", "blockquotes", "lists", "tasklists", "codeblocks", ...]
```

---

## 使用示例

### 完整示例：基础用法

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MDParser 示例</title>
    <script src="MDParser.js"></script>
</head>
<body>
    <textarea id="editor" placeholder="在此输入Markdown..."></textarea>
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

### 完整示例：博客文章渲染

```javascript
var parser = new MDParser({
    sanitize: true,
    highlight: true,
    gfm: true,
    tables: true,
    tasklists: true
});

var markdownContent = `
# 我的博客文章

**作者**: 张三  
**日期**: 2026-03-25

## 简介

这是一篇使用Markdown编写的示例文章。

## 代码示例

\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10)); // 55
\`\`\`

## 任务清单

- [x] Markdown解析
- [x] 代码高亮
- [x] 表格支持
- [ ] 更多功能开发中

## 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| 标题解析 | 已完成 | 支持 H1-H6 |
| 列表解析 | 已完成 | 支持有序和无序 |
| 代码高亮 | 已完成 | 内置语法高亮 |

## 链接与图片

[访问GitHub](https://github.com)

![示例图片](https://example.com/image.jpg)

## 引用

> 感谢使用MDParser！
`;

var html = parser.parse(markdownContent);
document.getElementById('article').innerHTML = html;
```

### 完整示例：评论系统

```javascript
var parser = new MDParser({
    sanitize: true,      // 必须开启，防止XSS
    gfm: true,
    tasklists: false     // 评论中不需要任务列表
});

function renderComment(markdownText) {
    return parser.parse(markdownText);
}

// 使用
var commentHTML = renderComment('用户说: 这篇文章**太棒了**！[查看原文](https://example.com)');
document.getElementById('comment').innerHTML = commentHTML;
```

---

## 支持的Markdown语法

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

### 强调

```markdown
**粗体文字**
*斜体文字*
~~删除线文字~~
```

### 列表

**无序列表**:
```markdown
- 项目一
- 项目二
  - 嵌套项目
```

**有序列表**:
```markdown
1. 第一项
2. 第二项
3. 第三项
```

**任务列表**:
```markdown
- [x] 已完成
- [ ] 未完成
```

### 代码

**行内代码**: 
```markdown
这是一段 `行内代码`
```

**代码块**:
````markdown
```javascript
function hello() {
    console.log('Hello');
}
```
````

> 支持的代码语言: javascript, js, python, html, css, json, sql, bash

### 链接与图片

```markdown
[链接文字](https://example.com)
![图片描述](image.jpg)
```

> 图片 alt 文本可选

### 引用

```markdown
> 这是引用内容
> 可以多行
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容 | 内容 | 内容 |
```

### 分割线

```markdown
---
```

### 自动链接

```markdown
https://example.com
```

> 会自动转换为可点击链接

### 转义

```markdown
使用 \* 转义星号
使用 \\ 转义反斜杠
```

---

## 注意事项

1. **安全性**: 建议将`sanitize`选项保持为`true`，以防止XSS攻击。

2. **性能**: 对于大量内容，建议使用防抖(debounce)优化渲染频率。

3. **代码高亮**: 支持 JavaScript、Python、HTML、CSS、JSON、SQL、Bash 等语言的语法高亮。

4. **兼容性**: 解析器使用原生JavaScript编写，支持所有现代浏览器。

---

## 更新日志

### v1.0.1 (2026-03-25)
- 修复代码块、表格、引用、链接、图片渲染问题
- 修复列表内行内元素渲染问题
- 优化代码高亮逻辑
- 改进正则表达式匹配

### v1.0.0 (2026-03-25)
- 初始版本发布
- 支持所有常用Markdown语法
- 支持代码高亮
- 支持GFM扩展（表格、任务列表）
- 支持多种配置选项
