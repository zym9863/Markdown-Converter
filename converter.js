/**
 * HTML转换器类
 * 负责处理Markdown到HTML的转换和后处理
 */
class MarkdownConverter {
    constructor() {
        this.parser = new MarkdownParser();
        
        // 代码高亮的颜色映射
        this.syntaxColors = {
            'javascript': '#f7df1e',
            'js': '#f7df1e',
            'python': '#3776ab',
            'java': '#ed8b00',
            'css': '#1572b6',
            'html': '#e34f26',
            'json': '#000000',
            'bash': '#4eaa25',
            'shell': '#4eaa25',
            'sql': '#336791',
            'php': '#777bb4',
            'cpp': '#00599c',
            'c': '#00599c'
        };
    }

    /**
     * 将Markdown转换为HTML
     * @param {string} markdown - Markdown文本
     * @returns {string} - 转换后的HTML
     */
    toHtml(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '<p>在左侧输入Markdown内容，这里将显示实时预览...</p>';
        }

        try {
            // 使用解析器转换
            let html = this.parser.parse(markdown);
            
            // 后处理
            html = this.addSyntaxHighlighting(html);
            html = this.processEmptyLines(html);
            html = this.addTableOfContents(html);
            
            return html || '<p>请输入有效的Markdown内容</p>';
        } catch (error) {
            console.error('转换错误:', error);
            return '<p style="color: red;">转换出错，请检查Markdown语法</p>';
        }
    }

    /**
     * 添加语法高亮
     * @param {string} html - HTML内容
     * @returns {string} - 添加高亮后的HTML
     */
    addSyntaxHighlighting(html) {
        return html.replace(/<code class="language-(\w+)">([\s\S]*?)<\/code>/g, (match, lang, code) => {
            const highlightedCode = this.highlightCode(code, lang);
            const color = this.syntaxColors[lang.toLowerCase()] || '#666';
            
            return `<code class="language-${lang}" data-lang="${lang}" style="position: relative;">
                <span class="language-label" style="position: absolute; top: 5px; right: 10px; font-size: 0.7em; color: ${color}; font-weight: bold;">${lang.toUpperCase()}</span>
                ${highlightedCode}
            </code>`;
        });
    }

    /**
     * 简单的代码高亮实现
     * @param {string} code - 代码内容
     * @param {string} language - 编程语言
     * @returns {string} - 高亮后的代码
     */
    highlightCode(code, language) {
        // 基础的关键词高亮
        const keywords = {
            'javascript': ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'class', 'extends', 'import', 'export', 'default', 'async', 'await'],
            'python': ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'lambda'],
            'java': ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'if', 'else', 'for', 'while', 'return', 'static', 'final'],
            'css': ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'font'],
            'html': ['div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        };

        let highlightedCode = code;
        const langKeywords = keywords[language.toLowerCase()] || [];

        // 高亮关键词
        langKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlightedCode = highlightedCode.replace(regex, `<span style="color: #d73a49; font-weight: bold;">${keyword}</span>`);
        });

        // 高亮字符串
        highlightedCode = highlightedCode.replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: #032f62;">$1$2$3</span>');
        
        // 高亮注释
        if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'java' || language.toLowerCase() === 'css') {
            highlightedCode = highlightedCode.replace(/(\/\/.*$)/gm, '<span style="color: #6a737d; font-style: italic;">$1</span>');
            highlightedCode = highlightedCode.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a737d; font-style: italic;">$1</span>');
        } else if (language.toLowerCase() === 'python') {
            highlightedCode = highlightedCode.replace(/(#.*$)/gm, '<span style="color: #6a737d; font-style: italic;">$1</span>');
        }

        // 高亮数字
        highlightedCode = highlightedCode.replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #005cc5;">$1</span>');

        return highlightedCode;
    }

    /**
     * 处理空行
     * @param {string} html - HTML内容
     * @returns {string} - 处理后的HTML
     */
    processEmptyLines(html) {
        // 移除多余的空行
        return html.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
    }

    /**
     * 添加目录功能（可选）
     * @param {string} html - HTML内容
     * @returns {string} - 添加目录后的HTML
     */
    addTableOfContents(html) {
        const headings = [];
        const headingRegex = /<h([1-6])\s+id="([^"]*)"[^>]*>([^<]+)<\/h[1-6]>/g;
        let match;

        // 提取所有标题
        while ((match = headingRegex.exec(html)) !== null) {
            headings.push({
                level: parseInt(match[1]),
                id: match[2],
                text: match[3]
            });
        }

        // 如果没有标题，直接返回原HTML
        if (headings.length === 0) {
            return html;
        }

        // 生成目录
        const tocItems = headings.map(heading => {
            const indent = '  '.repeat(heading.level - 1);
            return `${indent}<li><a href="#${heading.id}" style="color: var(--accent-color); text-decoration: none;">${heading.text}</a></li>`;
        });

        const toc = `
        <div class="table-of-contents" style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; margin: 1rem 0; border: 1px solid var(--border-color);">
            <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">📑 目录</h4>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: none;">
                ${tocItems.join('\n')}
            </ul>
        </div>
        `;

        // 在第一个标题前插入目录
        const firstHeadingIndex = html.search(/<h[1-6]/);
        if (firstHeadingIndex !== -1) {
            return html.slice(0, firstHeadingIndex) + toc + html.slice(firstHeadingIndex);
        }

        return toc + html;
    }

    /**
     * 生成完整的HTML文档
     * @param {string} markdownContent - Markdown内容
     * @param {string} title - 文档标题
     * @returns {string} - 完整的HTML文档
     */
    toFullHtml(markdownContent, title = 'Markdown文档') {
        const bodyHtml = this.toHtml(markdownContent);
        const currentDate = new Date().toLocaleString('zh-CN');
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #ffffff;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin: 1.5em 0 0.5em 0;
            font-weight: 600;
            line-height: 1.25;
        }
        
        h1 {
            font-size: 2em;
            border-bottom: 1px solid #eee;
            padding-bottom: 0.5em;
        }
        
        h2 {
            font-size: 1.5em;
            border-bottom: 1px solid #eee;
            padding-bottom: 0.3em;
        }
        
        h3 { font-size: 1.25em; }
        
        p {
            margin: 0.8em 0;
        }
        
        strong {
            font-weight: 600;
        }
        
        em {
            font-style: italic;
        }
        
        ul, ol {
            margin: 0.8em 0;
            padding-left: 2em;
        }
        
        li {
            margin: 0.3em 0;
        }
        
        blockquote {
            margin: 1em 0;
            padding: 0.5em 1em;
            border-left: 4px solid #007bff;
            background-color: #f8f9fa;
            font-style: italic;
        }
        
        code {
            background-color: #f8f9fa;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.9em;
        }
        
        pre {
            background-color: #f8f9fa;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
        }
        
        pre code {
            background-color: transparent;
            padding: 0;
        }
        
        a {
            color: #007bff;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
        }
        
        th, td {
            padding: 0.5em;
            border: 1px solid #dee2e6;
            text-align: left;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        
        hr {
            border: none;
            border-top: 2px solid #dee2e6;
            margin: 2em 0;
        }
        
        .document-meta {
            color: #6c757d;
            font-size: 0.9em;
            text-align: center;
            margin-bottom: 2em;
            padding-bottom: 1em;
            border-bottom: 1px solid #eee;
        }
        
        .table-of-contents ul {
            list-style-type: none;
            padding-left: 1em;
        }
        
        .table-of-contents a {
            color: #007bff;
        }
        
        @media print {
            body {
                padding: 1rem;
            }
            
            .table-of-contents {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="document-meta">
        <p>文档生成时间：${currentDate} | 由Markdown转换器生成</p>
    </div>
    ${bodyHtml}
</body>
</html>`;
    }

    /**
     * 获取文本统计信息
     * @param {string} text - 输入文本
     * @returns {object} - 统计信息
     */
    getStats(text) {
        if (!text || typeof text !== 'string') {
            return { characters: 0, words: 0, lines: 0, paragraphs: 0 };
        }

        const characters = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text.split('\n').length;
        const paragraphs = text.split('\n\n').filter(p => p.trim()).length;

        return { characters, words, lines, paragraphs };
    }
}