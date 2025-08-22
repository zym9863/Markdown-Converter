/**
 * Markdown转换器主应用
 * 负责整体的用户交互和功能实现
 */
class MarkdownConverterApp {
    constructor() {
        this.converter = new MarkdownConverter();
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.debounceTimer = null;
        this.debounceDelay = 300; // 防抖延迟300ms
        
        this.initializeElements();
        this.bindEvents();
        this.applyTheme();
        this.updatePreview(); // 初始化预览
    }

    /**
     * 初始化DOM元素引用
     */
    initializeElements() {
        this.elements = {
            markdownInput: document.getElementById('markdown-input'),
            htmlPreview: document.getElementById('html-preview'),
            themeToggle: document.getElementById('theme-toggle'),
            clearBtn: document.getElementById('clear-btn'),
            exportBtn: document.getElementById('export-btn'),
            copyBtn: document.getElementById('copy-btn'),
            charCount: document.getElementById('char-count'),
            wordCount: document.getElementById('word-count')
        };

        // 检查必需元素是否存在
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.error(`未找到元素: ${key}`);
            }
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // Markdown输入框事件
        if (this.elements.markdownInput) {
            this.elements.markdownInput.addEventListener('input', () => {
                this.debouncedUpdatePreview();
                this.updateStats();
            });

            this.elements.markdownInput.addEventListener('scroll', () => {
                this.syncScroll();
            });

            // 支持Tab键缩进
            this.elements.markdownInput.addEventListener('keydown', (e) => {
                this.handleKeydown(e);
            });
        }

        // 工具栏按钮事件
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => {
                this.clearContent();
            });
        }

        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', () => {
                this.exportHtml();
            });
        }

        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => {
                this.copyHtml();
            });
        }

        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
    }

    /**
     * 防抖更新预览
     */
    debouncedUpdatePreview() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.updatePreview();
        }, this.debounceDelay);
    }

    /**
     * 更新HTML预览
     */
    updatePreview() {
        if (!this.elements.markdownInput || !this.elements.htmlPreview) {
            return;
        }

        const markdown = this.elements.markdownInput.value;
        try {
            const html = this.converter.toHtml(markdown);
            this.elements.htmlPreview.innerHTML = html;
            
            // 更新预览区域的链接，使其在新窗口中打开
            this.updatePreviewLinks();
        } catch (error) {
            console.error('预览更新失败:', error);
            this.elements.htmlPreview.innerHTML = '<p style="color: red;">预览更新失败，请检查Markdown语法</p>';
        }
    }

    /**
     * 更新预览区域的链接
     */
    updatePreviewLinks() {
        const links = this.elements.htmlPreview.querySelectorAll('a[href^="http"]');
        links.forEach(link => {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        });
    }

    /**
     * 更新文本统计信息
     */
    updateStats() {
        if (!this.elements.markdownInput) {
            return;
        }

        const text = this.elements.markdownInput.value;
        const stats = this.converter.getStats(text);

        if (this.elements.charCount) {
            this.elements.charCount.textContent = `字符数: ${stats.characters}`;
        }

        if (this.elements.wordCount) {
            this.elements.wordCount.textContent = `单词数: ${stats.words}`;
        }
    }

    /**
     * 同步滚动（可选功能）
     */
    syncScroll() {
        if (!this.elements.markdownInput || !this.elements.htmlPreview) {
            return;
        }

        const inputScrollPercentage = this.elements.markdownInput.scrollTop / 
            (this.elements.markdownInput.scrollHeight - this.elements.markdownInput.clientHeight);
        
        const previewScrollTop = inputScrollPercentage * 
            (this.elements.htmlPreview.scrollHeight - this.elements.htmlPreview.clientHeight);
        
        this.elements.htmlPreview.scrollTop = previewScrollTop;
    }

    /**
     * 处理键盘按键事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeydown(e) {
        // Tab键缩进支持
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.elements.markdownInput.selectionStart;
            const end = this.elements.markdownInput.selectionEnd;
            const value = this.elements.markdownInput.value;

            if (e.shiftKey) {
                // Shift+Tab: 减少缩进
                const lineStart = value.lastIndexOf('\n', start - 1) + 1;
                const lineEnd = value.indexOf('\n', start);
                const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
                
                if (line.startsWith('    ')) {
                    this.elements.markdownInput.value = value.substring(0, lineStart) + 
                        line.substring(4) + 
                        value.substring(lineEnd === -1 ? value.length : lineEnd);
                    this.elements.markdownInput.setSelectionRange(start - 4, end - 4);
                } else if (line.startsWith('\t')) {
                    this.elements.markdownInput.value = value.substring(0, lineStart) + 
                        line.substring(1) + 
                        value.substring(lineEnd === -1 ? value.length : lineEnd);
                    this.elements.markdownInput.setSelectionRange(start - 1, end - 1);
                }
            } else {
                // Tab: 增加缩进
                this.elements.markdownInput.value = value.substring(0, start) + 
                    '    ' + 
                    value.substring(end);
                this.elements.markdownInput.setSelectionRange(start + 4, start + 4);
            }

            this.debouncedUpdatePreview();
            this.updateStats();
        }
    }

    /**
     * 处理全局键盘快捷键
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleGlobalKeydown(e) {
        // Ctrl/Cmd + S: 导出HTML
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.exportHtml();
        }

        // Ctrl/Cmd + Shift + C: 复制HTML
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            this.copyHtml();
        }

        // Ctrl/Cmd + Shift + T: 切换主题
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            this.toggleTheme();
        }

        // Ctrl/Cmd + Shift + X: 清空内容
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
            e.preventDefault();
            this.clearContent();
        }
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
        
        this.showToast(`已切换到${this.currentTheme === 'light' ? '亮色' : '暗色'}主题`, 'success');
    }

    /**
     * 应用主题
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        if (this.elements.themeToggle) {
            this.elements.themeToggle.innerHTML = this.currentTheme === 'light' ? '🌙 暗色主题' : '☀️ 亮色主题';
        }
    }

    /**
     * 清空内容
     */
    clearContent() {
        if (confirm('确定要清空所有内容吗？此操作无法撤销。')) {
            if (this.elements.markdownInput) {
                this.elements.markdownInput.value = '';
                this.elements.markdownInput.focus();
            }
            this.updatePreview();
            this.updateStats();
            this.showToast('内容已清空', 'success');
        }
    }

    /**
     * 导出HTML文件
     */
    exportHtml() {
        if (!this.elements.markdownInput) {
            this.showToast('无法获取内容', 'error');
            return;
        }

        const markdown = this.elements.markdownInput.value;
        if (!markdown.trim()) {
            this.showToast('请先输入一些Markdown内容', 'error');
            return;
        }

        try {
            const fullHtml = this.converter.toFullHtml(markdown, 'Markdown文档');
            const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `markdown-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            this.showToast('HTML文件已导出', 'success');
        } catch (error) {
            console.error('导出失败:', error);
            this.showToast('导出失败，请重试', 'error');
        }
    }

    /**
     * 复制HTML代码
     */
    async copyHtml() {
        if (!this.elements.markdownInput) {
            this.showToast('无法获取内容', 'error');
            return;
        }

        const markdown = this.elements.markdownInput.value;
        if (!markdown.trim()) {
            this.showToast('请先输入一些Markdown内容', 'error');
            return;
        }

        try {
            const html = this.converter.toHtml(markdown);
            await navigator.clipboard.writeText(html);
            this.showToast('HTML代码已复制到剪贴板', 'success');
        } catch (error) {
            console.error('复制失败:', error);
            
            // 降级方案：使用传统方法复制
            try {
                const textArea = document.createElement('textarea');
                textArea.value = this.converter.toHtml(markdown);
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showToast('HTML代码已复制到剪贴板', 'success');
            } catch (fallbackError) {
                console.error('降级复制也失败:', fallbackError);
                this.showToast('复制失败，请手动选择复制', 'error');
            }
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 可以在这里添加响应式处理逻辑
        // 例如：调整编辑器布局等
    }

    /**
     * 显示提示信息
     * @param {string} message - 提示信息
     * @param {string} type - 提示类型 ('success' | 'error')
     */
    showToast(message, type = 'success') {
        // 移除现有的toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 3秒后移除toast
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    /**
     * 插入Markdown格式文本
     * @param {string} prefix - 前缀
     * @param {string} suffix - 后缀
     * @param {string} placeholder - 占位符
     */
    insertMarkdown(prefix, suffix = '', placeholder = '') {
        if (!this.elements.markdownInput) return;

        const textarea = this.elements.markdownInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const replacement = prefix + (selectedText || placeholder) + suffix;

        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        
        // 设置光标位置
        const newPos = selectedText ? start + replacement.length : start + prefix.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();

        this.debouncedUpdatePreview();
        this.updateStats();
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new MarkdownConverterApp();
        
        // 将应用实例挂载到全局对象，便于调试
        window.markdownApp = app;
        
        console.log('Markdown转换器已成功初始化');
        
        // 显示键盘快捷键提示
        setTimeout(() => {
            console.log(`
键盘快捷键：
- Ctrl/Cmd + S: 导出HTML文件
- Ctrl/Cmd + Shift + C: 复制HTML代码
- Ctrl/Cmd + Shift + T: 切换主题
- Ctrl/Cmd + Shift + X: 清空内容
- Tab: 增加缩进
- Shift + Tab: 减少缩进
            `);
        }, 1000);
        
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
});