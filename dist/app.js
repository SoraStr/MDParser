/**
 * MDParser 所见即所得编辑器
 */

(function() {
    'use strict';

    // DOM Elements
    var editor = document.getElementById('editor');
    var preview = document.getElementById('preview');
    var divider = document.getElementById('divider');
    var copyBtn = document.getElementById('copyBtn');
    var clearBtn = document.getElementById('clearBtn');
    var downloadBtn = document.getElementById('downloadBtn');
    var lineCountEl = document.getElementById('lineCount');
    var charCountEl = document.getElementById('charCount');
    var statusMessage = document.getElementById('statusMessage');
    var toastContainer = document.getElementById('toastContainer');
    var formatButtons = document.querySelectorAll('.format-btn');
    var themeButtons = document.querySelectorAll('.theme-btn');

    // Initialize parser
    var parser = new MDParser({
        sanitize: true,
        highlight: true,
        gfm: true,
        tables: true,
        tasklists: true,
        linkify: true
    });

    // Debounce function
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Show toast notification
    function showToast(message, type) {
        type = type || 'info';
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.innerHTML = '<span>' + message + '</span>';
        toastContainer.appendChild(toast);

        setTimeout(function() {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 2500);
    }

    // Update status bar
    function updateStatus() {
        var text = editor.value;
        var lines = text.split('\n').length;
        var chars = text.length;

        lineCountEl.textContent = lines;
        charCountEl.textContent = chars;
    }

    // Render preview
    function renderPreview() {
        var markdown = editor.value;
        try {
            var html = parser.parse(markdown);
            preview.innerHTML = html;
            statusMessage.textContent = '渲染成功';
        } catch (e) {
            statusMessage.textContent = '渲染错误: ' + e.message;
            preview.innerHTML = '<p style="color: var(--error-color);">解析错误: ' + e.message + '</p>';
        }
    }

    // Debounced render
    var debouncedRender = debounce(renderPreview, 150);

    // Insert text at cursor
    function insertText(before, after, placeholder) {
        var start = editor.selectionStart;
        var end = editor.selectionEnd;
        var text = editor.value;
        var selectedText = text.substring(start, end) || placeholder;

        var newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        editor.value = newText;

        // Set cursor position
        if (selectedText === placeholder) {
            editor.setSelectionRange(start + before.length, start + before.length + placeholder.length);
        } else {
            editor.setSelectionRange(start + before.length + selectedText.length + after.length);
        }

        editor.focus();
        renderPreview();
        updateStatus();
    }

    // Insert at line start
    function insertAtLineStart(prefix) {
        var start = editor.selectionStart;
        var text = editor.value;

        // Find line start
        var lineStart = text.lastIndexOf('\n', start - 1) + 1;
        var lineEnd = text.indexOf('\n', start);
        if (lineEnd === -1) lineEnd = text.length;

        var line = text.substring(lineStart, lineEnd);

        // Remove existing prefix if any
        var cleanLine = line.replace(/^#{1,6}\s+/, '').replace(/^[\*\-\+]\s+/, '').replace(/^\d+\.\s+/, '').replace(/^>\s+/, '');

        var newLine = prefix + cleanLine;
        var newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd);

        editor.value = newText;
        var newPos = lineStart + prefix.length + cleanLine.length;
        editor.setSelectionRange(newPos, newPos);
        editor.focus();
        renderPreview();
        updateStatus();
    }

    // Handle format button click
    function handleFormat(format) {
        var selection = editor.value.substring(editor.selectionStart, editor.selectionEnd);

        switch (format) {
            case 'bold':
                insertText('**', '**', '粗体文字');
                break;
            case 'italic':
                insertText('*', '*', '斜体文字');
                break;
            case 'strikethrough':
                insertText('~~', '~~', '删除线文字');
                break;
            case 'h1':
                insertAtLineStart('# ');
                break;
            case 'h2':
                insertAtLineStart('## ');
                break;
            case 'h3':
                insertAtLineStart('### ');
                break;
            case 'ul':
                insertAtLineStart('- ');
                break;
            case 'ol':
                insertAtLineStart('1. ');
                break;
            case 'task':
                insertAtLineStart('- [ ] ');
                break;
            case 'link':
                insertText('[', '](url)', '链接文字');
                break;
            case 'image':
                insertText('![', '](image-url)', '图片描述');
                break;
            case 'code':
                insertText('`', '`', '代码');
                break;
            case 'codeblock':
                insertText('\n```\n', '\n```\n', '代码块');
                break;
            case 'blockquote':
                insertAtLineStart('> ');
                break;
            case 'hr':
                insertText('\n---\n', '', '');
                break;
            case 'table':
                insertText('\n| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| ', ' |  |  |\n', '');
                break;
        }
    }

    // Copy HTML to clipboard
    function copyHTML() {
        var html = preview.innerHTML;
        navigator.clipboard.writeText(html).then(function() {
            showToast('HTML 已复制到剪贴板', 'success');
        }).catch(function() {
            showToast('复制失败', 'error');
        });
    }

    // Clear editor
    function clearEditor() {
        if (editor.value && !confirm('确定要清空编辑器吗？')) {
            return;
        }
        editor.value = '';
        renderPreview();
        updateStatus();
        editor.focus();
        showToast('编辑器已清空', 'info');
    }

    // Download as HTML
    function downloadHTML() {
        var htmlContent = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>MDParser Export</title>\n    <style>\n        body {\n            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;\n            max-width: 900px;\n            margin: 0 auto;\n            padding: 40px 20px;\n            line-height: 1.6;\n            color: #24292f;\n        }\n        h1, h2, h3 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }\n        h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }\n        h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }\n        h3 { font-size: 1.25em; }\n        p { margin-bottom: 16px; }\n        code { padding: 0.2em 0.4em; background: #f6f8fa; border-radius: 4px; font-family: monospace; font-size: 85%; }\n        pre { margin: 16px 0; padding: 16px; background: #f6f8fa; border-radius: 8px; overflow-x: auto; }\n        pre code { padding: 0; background: transparent; }\n        blockquote { margin: 16px 0; padding: 0 16px; border-left: 4px solid #d0d7de; color: #57606a; }\n        ul, ol { margin-bottom: 16px; padding-left: 2em; }\n        li { margin-bottom: 4px; }\n        table { width: 100%; margin: 16px 0; border-collapse: collapse; }\n        th, td { padding: 8px 12px; border: 1px solid #d0d7de; }\n        th { background: #f6f8fa; font-weight: 600; }\n        a { color: #0969da; }\n        img { max-width: 100%; }\n        hr { margin: 24px 0; border: none; border-top: 1px solid #d0d7de; }\n    </style>\n</head>\n<body>\n' + preview.innerHTML + '\n</body>\n</html>';

        var blob = new Blob([htmlContent], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-export.html';
        a.click();
        URL.revokeObjectURL(url);
        showToast('HTML 文件已下载', 'success');
    }

    // Toggle theme
    function toggleTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('mdparser-theme', theme);

        themeButtons.forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        showToast('主题已切换为' + (theme === 'dark' ? '深色' : '浅色') + '模式', 'info');
    }

    // Resize panels
    function initResize() {
        var isResizing = false;
        var editorPanel = document.querySelector('.editor-panel');
        var previewPanel = document.querySelector('.preview-panel');

        divider.addEventListener('mousedown', function(e) {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;

            var container = document.querySelector('.editor-container');
            var containerRect = container.getBoundingClientRect();
            var newEditorWidth = e.clientX - containerRect.left;
            var newPreviewWidth = containerRect.width - newEditorWidth - 6;

            if (newEditorWidth >= 300 && newPreviewWidth >= 300) {
                editorPanel.style.flex = 'none';
                editorPanel.style.width = newEditorWidth + 'px';
                previewPanel.style.flex = 'none';
                previewPanel.style.width = newPreviewWidth + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        });
    }

    // Keyboard shortcuts
    function initKeyboardShortcuts() {
        editor.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + B for bold
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                handleFormat('bold');
            }
            // Ctrl/Cmd + I for italic
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                handleFormat('italic');
            }
            // Ctrl/Cmd + K for link
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                handleFormat('link');
            }

            // Tab for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = editor.selectionStart;
                var end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.setSelectionRange(start + 4, start + 4);
                renderPreview();
            }
        });
    }

    // Initialize
    function init() {
        // Load saved theme
        var savedTheme = localStorage.getItem('mdparser-theme') || 'light';
        toggleTheme(savedTheme);

        // Load sample content
        editor.value = '# MDParser 所见即所得编辑器\n\n欢迎使用 MDParser 编辑器！这是一个基于原生 JavaScript 的 Markdown 解析器。\n\n## 特性\n\n- **实时预览**：左侧编辑，右侧即时查看渲染效果\n- **丰富语法支持**：支持标题、列表、代码块、表格等常用 Markdown 语法\n- **快捷键支持**：使用 Ctrl+B 加粗，Ctrl+I 斜体，Ctrl+K 插入链接\n- **主题切换**：支持浅色/深色主题\n- **代码高亮**：内置代码语法高亮功能\n\n## 代码示例\n\n```javascript\nfunction fibonacci(n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10)); // 输出: 55\n```\n\n## 任务列表\n\n- [x] 实现 Markdown 解析器\n- [x] 开发所见即所得编辑器\n- [ ] 添加更多高级功能\n\n## 表格\n\n| 功能 | 状态 | 说明 |\n|------|------|------|\n| 标题解析 | ✅ 完成 | 支持 H1-H6 |\n| 列表解析 | ✅ 完成 | 支持有序和无序 |\n| 代码高亮 | ✅ 完成 | 内置语法高亮 |\n\n## 引用\n\n> Markdown 的设计哲学是：「让可读性成为最高原则」。\n\n## 链接与图片\n\n[访问 MDParser GitHub](https://github.com)\n\n![示例图片](https://picsum.photos/600/300)\n\n---\n\n*开始编辑你的 Markdown 吧！*\n';

        // Event listeners
        editor.addEventListener('input', function() {
            debouncedRender();
            updateStatus();
        });

        editor.addEventListener('scroll', function() {
            // Optional: sync scroll positions
        });

        // Format buttons
        formatButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleFormat(btn.dataset.format);
            });
        });

        // Theme buttons
        themeButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                toggleTheme(btn.dataset.theme);
            });
        });

        // Action buttons
        copyBtn.addEventListener('click', copyHTML);
        clearBtn.addEventListener('click', clearEditor);
        downloadBtn.addEventListener('click', downloadHTML);

        // Initialize resize
        initResize();

        // Initialize keyboard shortcuts
        initKeyboardShortcuts();

        // Initial render
        renderPreview();
        updateStatus();

        showToast('编辑器已就绪', 'success');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
