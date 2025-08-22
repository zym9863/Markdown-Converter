/**
 * Markdown解析器类
 * 负责将Markdown文本解析为结构化的HTML元素
 */
class MarkdownParser {
    constructor() {
        // 初始化解析规则
        this.rules = {
            // 标题规则 (h1-h6)
            heading: /^(#{1,6})\s+(.+)$/gm,
            
            // 水平分割线
            hr: /^(-{3,}|_{3,}|\*{3,})$/gm,
            
            // 代码块
            codeBlock: /```(\w+)?\n([\s\S]*?)```/g,
            
            // 行内代码
            inlineCode: /`([^`]+)`/g,
            
            // 图片
            image: /!\[([^\]]*)\]\(([^\)]+)\)/g,
            
            // 链接
            link: /\[([^\]]+)\]\(([^\)]+)\)/g,
            
            // 粗体
            bold: /\*\*([^*]+)\*\*/g,
            
            // 斜体
            italic: /\*([^*]+)\*/g,
            
            // 删除线
            strikethrough: /~~([^~]+)~~/g,
            
            // 无序列表
            unorderedList: /^[\s]*[-*+]\s+(.+)$/gm,
            
            // 有序列表
            orderedList: /^[\s]*\d+\.\s+(.+)$/gm,
            
            // 引用块
            blockquote: /^>\s+(.+)$/gm,
            
            // 表格
            table: /^\|(.+)\|\s*\n\|[-:|\s]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm,
            
            // 段落
            paragraph: /^(?!#|>|\||```|[-*+]\s|\d+\.\s|---|___|\*\*\*)(.+)$/gm
        };
    }

    /**
     * 主要的解析方法
     * @param {string} markdown - Markdown文本
     * @returns {string} - 解析后的HTML结构
     */
    parse(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        // 预处理：标准化换行符
        let html = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // 按优先级顺序解析各种元素
        html = this.parseCodeBlocks(html);
        html = this.parseHeaders(html);
        html = this.parseHorizontalRules(html);
        html = this.parseTables(html);
        html = this.parseBlockquotes(html);
        html = this.parseLists(html);
        html = this.parseImages(html);
        html = this.parseLinks(html);
        html = this.parseInlineFormatting(html);
        html = this.parseInlineCode(html);
        html = this.parseParagraphs(html);
        
        return html.trim();
    }

    /**
     * 解析代码块
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseCodeBlocks(text) {
        return text.replace(this.rules.codeBlock, (match, language, code) => {
            const lang = language || 'text';
            const escapedCode = this.escapeHtml(code.trim());
            return `<pre><code class="language-${lang}">${escapedCode}</code></pre>\n`;
        });
    }

    /**
     * 解析标题
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseHeaders(text) {
        return text.replace(this.rules.heading, (match, hashes, title) => {
            const level = hashes.length;
            const id = this.generateId(title);
            return `<h${level} id="${id}">${title.trim()}</h${level}>\n`;
        });
    }

    /**
     * 解析水平分割线
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseHorizontalRules(text) {
        return text.replace(this.rules.hr, '<hr>\n');
    }

    /**
     * 解析表格
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseTables(text) {
        return text.replace(this.rules.table, (match, header, separator, rows) => {
            // 解析表头
            const headerCells = header.split('|').map(cell => cell.trim()).filter(cell => cell);
            const headerRow = '<tr>' + headerCells.map(cell => `<th>${cell}</th>`).join('') + '</tr>';
            
            // 解析表格行
            const tableRows = rows.trim().split('\n').map(row => {
                const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
                return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
            }).join('\n');
            
            return `<table>\n<thead>\n${headerRow}\n</thead>\n<tbody>\n${tableRows}\n</tbody>\n</table>\n`;
        });
    }

    /**
     * 解析引用块
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseBlockquotes(text) {
        const lines = text.split('\n');
        const result = [];
        let inBlockquote = false;
        let blockquoteContent = [];

        for (let line of lines) {
            if (line.startsWith('> ')) {
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteContent = [];
                }
                blockquoteContent.push(line.substring(2));
            } else {
                if (inBlockquote) {
                    result.push(`<blockquote>${blockquoteContent.join('<br>')}</blockquote>`);
                    inBlockquote = false;
                }
                result.push(line);
            }
        }

        if (inBlockquote) {
            result.push(`<blockquote>${blockquoteContent.join('<br>')}</blockquote>`);
        }

        return result.join('\n');
    }

    /**
     * 解析列表
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseLists(text) {
        const lines = text.split('\n');
        const result = [];
        let inOrderedList = false;
        let inUnorderedList = false;
        let listItems = [];

        for (let line of lines) {
            const orderedMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
            const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);

            if (orderedMatch) {
                if (inUnorderedList) {
                    result.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
                    inUnorderedList = false;
                    listItems = [];
                }
                if (!inOrderedList) {
                    inOrderedList = true;
                    listItems = [];
                }
                listItems.push(orderedMatch[2]);
            } else if (unorderedMatch) {
                if (inOrderedList) {
                    result.push(`<ol>${listItems.map(item => `<li>${item}</li>`).join('')}</ol>`);
                    inOrderedList = false;
                    listItems = [];
                }
                if (!inUnorderedList) {
                    inUnorderedList = true;
                    listItems = [];
                }
                listItems.push(unorderedMatch[2]);
            } else {
                if (inOrderedList) {
                    result.push(`<ol>${listItems.map(item => `<li>${item}</li>`).join('')}</ol>`);
                    inOrderedList = false;
                }
                if (inUnorderedList) {
                    result.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
                    inUnorderedList = false;
                }
                result.push(line);
            }
        }

        // 处理结尾的列表
        if (inOrderedList) {
            result.push(`<ol>${listItems.map(item => `<li>${item}</li>`).join('')}</ol>`);
        }
        if (inUnorderedList) {
            result.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
        }

        return result.join('\n');
    }

    /**
     * 解析图片
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseImages(text) {
        return text.replace(this.rules.image, (match, alt, src) => {
            return `<img src="${src}" alt="${alt}" />`;
        });
    }

    /**
     * 解析链接
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseLinks(text) {
        return text.replace(this.rules.link, (match, text, url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        });
    }

    /**
     * 解析行内格式化（粗体、斜体、删除线）
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseInlineFormatting(text) {
        // 粗体
        text = text.replace(this.rules.bold, '<strong>$1</strong>');
        // 斜体
        text = text.replace(this.rules.italic, '<em>$1</em>');
        // 删除线
        text = text.replace(this.rules.strikethrough, '<del>$1</del>');
        
        return text;
    }

    /**
     * 解析行内代码
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseInlineCode(text) {
        return text.replace(this.rules.inlineCode, (match, code) => {
            return `<code>${this.escapeHtml(code)}</code>`;
        });
    }

    /**
     * 解析段落
     * @param {string} text - 输入文本
     * @returns {string} - 处理后的文本
     */
    parseParagraphs(text) {
        const lines = text.split('\n');
        const result = [];
        let currentParagraph = [];

        for (let line of lines) {
            // 跳过已经处理的HTML标签行和空行
            if (this.isHtmlLine(line) || line.trim() === '') {
                if (currentParagraph.length > 0) {
                    result.push(`<p>${currentParagraph.join(' ').trim()}</p>`);
                    currentParagraph = [];
                }
                if (line.trim() !== '') {
                    result.push(line);
                }
            } else {
                currentParagraph.push(line.trim());
            }
        }

        // 处理最后的段落
        if (currentParagraph.length > 0) {
            result.push(`<p>${currentParagraph.join(' ').trim()}</p>`);
        }

        return result.join('\n');
    }

    /**
     * 检查是否为HTML行
     * @param {string} line - 文本行
     * @returns {boolean} - 是否为HTML行
     */
    isHtmlLine(line) {
        return /^<[^>]+>/.test(line.trim());
    }

    /**
     * 转义HTML特殊字符
     * @param {string} text - 输入文本
     * @returns {string} - 转义后的文本
     */
    escapeHtml(text) {
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        
        return text.replace(/[&<>"']/g, char => htmlEscapes[char]);
    }

    /**
     * 为标题生成ID
     * @param {string} title - 标题文本
     * @returns {string} - 生成的ID
     */
    generateId(title) {
        return title.toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文字符
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim('-');
    }
}