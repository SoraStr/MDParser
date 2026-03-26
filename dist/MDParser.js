/**
 * MDParser - 原生JavaScript Markdown解析器
 * @version 1.0.1
 * @author SoraStr
 */

(function(global) {
    'use strict';

    function MDParser(options) {
        this.options = Object.assign({
            sanitize: true,
            highlight: true,
            highlightTheme: 'github',
            linkify: true,
            breaks: false,
            gfm: true,
            tables: true,
            tasklists: true
        }, options || {});

        this.highlightThemes = {
            github: {
                keyword: 'color: #d73a49;',
                string: 'color: #032f62;',
                number: 'color: #005cc5;',
                comment: 'color: #6a737d;',
                default: 'color: #24292e;'
            }
        };
    }

    MDParser.prototype.escapeHtml = function(text) {
        return text.replace(/[&<>"']/g, function(m) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
        });
    };

    MDParser.prototype.parse = function(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        var lines = markdown.split('\n');
        var result = [];
        var i = 0;

        while (i < lines.length) {
            var line = lines[i];
            var processed = false;

            // 1. 代码块
            var codeBlockMatch = line.match(/^```(\w*)$/);
            if (codeBlockMatch && i + 1 < lines.length) {
                var codeLines = [];
                var j = i + 1;
                while (j < lines.length && lines[j] !== '```' && lines[j] !== '``` ') {
                    codeLines.push(lines[j]);
                    j++;
                }
                var code = codeLines.join('\n');
                var lang = codeBlockMatch[1];
                result.push('<pre><code class="language-' + lang + '">' + 
                    (this.options.highlight ? this._highlightCode(code, lang) : this.escapeHtml(code)) + 
                    '</code></pre>');
                i = j + 1;
                processed = true;
            }

            // 2. 区块引用
            if (!processed) {
                var quoteMatch = line.match(/^>\s?(.*)$/);
                if (quoteMatch) {
                    var quoteLines = [quoteMatch[1] || ''];
                    j = i + 1;
                    while (j < lines.length && lines[j].match(/^>/)) {
                        quoteLines.push(lines[j].replace(/^>\s?/, ''));
                        j++;
                    }
                    var innerContent = quoteLines.join('\n');
                    result.push('<blockquote>' + this.parse(innerContent) + '</blockquote>');
                    i = j;
                    processed = true;
                }
            }

            // 3. 标题
            if (!processed) {
                var headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                if (headingMatch) {
                    var level = headingMatch[1].length;
                    var content = headingMatch[2];
                    result.push('<h' + level + '>' + this._parseInline(content) + '</h' + level + '>');
                    i++;
                    processed = true;
                }
            }

            // 4. 分割线
            if (!processed) {
                if (line.match(/^[-*_]{3,}$/)) {
                    result.push('<hr>');
                    i++;
                    processed = true;
                }
            }

            // 5. 表格
            if (!processed && this.options.gfm && this.options.tables) {
                var tableMatch = line.match(/^\|(.+)\|$/);
                if (tableMatch && i + 1 < lines.length && lines[i + 1].match(/^\|[\s\-:|]+\|$/)) {
                    var table = this._parseTable(lines, i);
                    if (table) {
                        result.push(table.html);
                        i = table.endIndex;
                        processed = true;
                    }
                }
            }

            // 6. 列表
            if (!processed) {
                var listResult = this._parseList(lines, i);
                if (listResult) {
                    result.push(listResult.html);
                    i = listResult.endIndex;
                    processed = true;
                }
            }

            // 7. 普通段落
            if (!processed) {
                if (line.trim() === '') {
                    i++;
                    continue;
                }
                
                var paraLines = [line];
                j = i + 1;
                while (j < lines.length && lines[j].trim() !== '' && 
                       !lines[j].match(/^#{1,6}\s+/) && !lines[j].match(/^```/) &&
                       !lines[j].match(/^>/) && !lines[j].match(/^[-*_]{3,}$/) &&
                       !lines[j].match(/^\|.+\|$/) && !lines[j].match(/^[\*\-\+]\s/) &&
                       !lines[j].match(/^\d+\.\s/)) {
                    paraLines.push(lines[j]);
                    j++;
                }
                
                var paraContent = paraLines.join(this.options.breaks ? '<br>' : ' ');
                var inlineHtml = this._parseInline(paraContent);
                if (inlineHtml.trim()) {
                    result.push('<p>' + inlineHtml + '</p>');
                }
                i = j;
            }
        }

        return result.join('\n');
    };

    MDParser.prototype._parseInline = function(text) {
        var self = this;
        var placeholders = [];
        var placeholderIndex = 0;

        // 第一步：行内代码（最先处理）
        text = text.replace(/`([^`]+)`/g, function(m, code) {
            var placeholder = '\x02' + placeholderIndex + '\x02';
            placeholders.push({placeholder: placeholder, html: '<code>' + self.escapeHtml(code) + '</code>'});
            placeholderIndex++;
            return placeholder;
        });

        // 第二步：图片（使用占位符保护）
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(m, alt, src) {
            var placeholder = '\x02' + placeholderIndex + '\x02';
            placeholders.push({placeholder: placeholder, html: '<img src="' + src + '" alt="' + alt + '">'});
            placeholderIndex++;
            return placeholder;
        });

        // 第三步：链接（使用占位符保护）
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(m, text, href) {
            var placeholder = '\x02' + placeholderIndex + '\x02';
            placeholders.push({placeholder: placeholder, html: '<a href="' + href + '">' + text + '</a>'});
            placeholderIndex++;
            return placeholder;
        });

        // 第四步：自动链接（只在不是占位符的文本中）
        if (this.options.linkify) {
            text = text.replace(/(https?:\/\/[^\s<>\x02]+)/g, function(url) {
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            });
        }

        // 第五步：粗体
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // 第六步：斜体
        text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

        // 第七步：删除线
        text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');

        // 第八步：转义字符
        text = text.replace(/\\([\\`*{}\[\]#+\-.!|>])/g, '$1');

        // 第九步：还原占位符
        placeholders.forEach(function(item) {
            text = text.replace(item.placeholder, item.html);
        });

        return text;
    };

    MDParser.prototype._parseTable = function(lines, startIndex) {
        var headers = lines[startIndex].match(/^\|(.+)\|$/)[1].split('|').map(function(c) { 
            return c.trim(); 
        });
        
        // 跳过分隔行
        var i = startIndex + 1;
        var rows = [];
        
        while (i < lines.length && lines[i].match(/^\|.+\|$/)) {
            var cells = lines[i].match(/^\|(.+)\|$/)[1].split('|').map(function(c) { 
                return c.trim(); 
            });
            rows.push(cells);
            i++;
        }

        var html = '<table class="md-table"><thead><tr>';
        headers.forEach(function(h) {
            html += '<th>' + this._parseInline(h) + '</th>';
        }.bind(this));
        html += '</tr></thead><tbody>';

        rows.forEach(function(row) {
            html += '<tr>';
            row.forEach(function(cell) {
                html += '<td>' + this._parseInline(cell) + '</td>';
            }.bind(this));
            html += '</tr>';
        }.bind(this));

        html += '</tbody></table>';

        return { html: html, endIndex: i };
    };

    MDParser.prototype._parseList = function(lines, startIndex) {
        var i = startIndex;
        var ulItems = [];
        var olItems = [];
        var firstLine = lines[i];

        // 判断列表类型：无序 (-, *, +) 还是有序 (1., 2., etc)
        var isOrdered = /^\d+\./.test(firstLine.trim());
        var isUnordered = /^[\*\-\+]$/.test(firstLine.trim().charAt(0)) && 
                           /^[\*\-\+]\s/.test(firstLine.trim());

        while (i < lines.length) {
            var line = lines[i].trim();
            if (line === '') break;

            if (isUnordered) {
                // 无序列表 (-, *, +)
                var ulMatch = line.match(/^[\*\-\+]\s+(.+)$/);
                if (ulMatch) {
                    var content = ulMatch[1];
                    // 任务列表检查
                    if (this.options.gfm && this.options.tasklists) {
                        var taskMatch = content.match(/^\[([ xX])\]\s*(.+)$/);
                        if (taskMatch) {
                            var checked = taskMatch[1].toLowerCase() === 'x';
                            var taskContent = this._parseInline(taskMatch[2]);
                            ulItems.push('<li><input type="checkbox"' + (checked ? ' checked' : '') + ' disabled> ' + taskContent + '</li>');
                            i++;
                            continue;
                        }
                    }
                    ulItems.push('<li>' + this._parseInline(content) + '</li>');
                    i++;
                    continue;
                }
            } else if (isOrdered) {
                // 有序列表 (1., 2., etc)
                var olMatch = line.match(/^\d+\.\s+(.+)$/);
                if (olMatch) {
                    olItems.push('<li>' + this._parseInline(olMatch[1]) + '</li>');
                    i++;
                    continue;
                }
            }

            break;
        }

        if (ulItems.length > 0) {
            return { html: '<ul>' + ulItems.join('') + '</ul>', endIndex: i };
        }
        if (olItems.length > 0) {
            return { html: '<ol>' + olItems.join('') + '</ol>', endIndex: i };
        }

        return null;
    };

    MDParser.prototype._highlightCode = function(code, lang) {
        var theme = this.highlightThemes[this.options.highlightTheme] || this.highlightThemes.github;
        var keywords = {
            'js': ['const','let','var','function','return','if','else','for','while','class','import','export','async','await','try','catch','throw','new','this','true','false','null','undefined'],
            'javascript': ['const','let','var','function','return','if','else','for','while','class','import','export','async','await','try','catch','throw','new','this','true','false','null','undefined'],
            'python': ['def','class','if','elif','else','for','while','return','import','from','as','try','except','finally','with','lambda','True','False','None','and','or','not','in','is'],
            'html': ['html','head','body','div','span','p','a','img','ul','ol','li','table','tr','td','th','form','input','button','script','style'],
            'css': ['color','background','margin','padding','border','width','height','display','position','font','text','flex','grid']
        };

        // HTML转义
        var escapedCode = this.escapeHtml(code);
        var tokens = [];
        var tokenIndex = 0;

        // 第一步：提取字符串和注释，用占位符保护
        escapedCode = escapedCode.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, function(m) {
            var placeholder = '\x01STR' + tokenIndex + '\x01';
            tokens.push({placeholder: placeholder, html: '<span style="' + theme.string + '">' + m + '</span>'});
            tokenIndex++;
            return placeholder;
        });

        escapedCode = escapedCode.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#.*$)/gm, function(m) {
            var placeholder = '\x01CMT' + tokenIndex + '\x01';
            tokens.push({placeholder: placeholder, html: '<span style="' + theme.comment + '">' + m + '</span>'});
            tokenIndex++;
            return placeholder;
        });

        // 第二步：处理数字
        escapedCode = escapedCode.replace(/\b(\d+\.?\d*)\b/g, '<span style="' + theme.number + '">$1</span>');

        // 第三步：处理关键词
        var langKw = keywords[lang] || [];
        langKw.forEach(function(kw) {
            var escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var re = new RegExp('\\b(' + escapedKw + ')\\b', 'g');
            escapedCode = escapedCode.replace(re, '<span style="' + theme.keyword + '">$1</span>');
        });

        // 第四步：还原字符串和注释
        tokens.forEach(function(t) {
            escapedCode = escapedCode.replace(t.placeholder, t.html);
        });

        return escapedCode;
    };

    MDParser.prototype.getVersion = function() {
        return '1.0.1';
    };

    MDParser.prototype.getFeatures = function() {
        return ['headings','blockquotes','lists','tasklists','codeblocks','inlineCode','links','images','bold','italic','strikethrough','tables','horizontalRules','autolinks','escaping'];
    };

    MDParser.prototype.setOptions = function(options) {
        Object.assign(this.options, options);
    };

    MDParser.prototype.getOptions = function() {
        return Object.assign({}, this.options);
    };

    // Export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MDParser;
    } else {
        global.MDParser = MDParser;
    }

})(typeof window !== 'undefined' ? window : this);
