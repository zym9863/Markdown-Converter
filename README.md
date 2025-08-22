# Markdown转换器

**🌐 Language:** [中文](README.md) | [English](README-EN.md)

一个功能丰富、界面美观的在线Markdown转HTML转换器，支持实时预览、语法高亮、主题切换等功能。

## 功能特性

### 🚀 核心功能
- **实时预览**: 在您输入的同时即时查看HTML效果
- **语法高亮**: 支持多种编程语言的代码高亮显示
- **导出功能**: 一键导出为完整的HTML文件
- **复制功能**: 快速复制生成的HTML代码
- **主题切换**: 支持亮色/暗色两种主题模式

### 📝 支持的Markdown语法
- ✅ 标题 (H1-H6)
- ✅ 粗体、斜体、删除线
- ✅ 无序列表和有序列表
- ✅ 代码块和行内代码
- ✅ 链接和图片
- ✅ 引用块
- ✅ 表格
- ✅ 水平分割线
- ✅ 自动生成目录

### 🎨 界面特性
- **响应式设计**: 适配桌面和移动设备
- **分栏布局**: 左侧输入，右侧预览
- **实时统计**: 显示字符数和单词数
- **主题记忆**: 自动保存用户的主题选择
- **键盘快捷键**: 提高操作效率

## 使用方法

### 基本使用
1. 在左侧文本框中输入Markdown内容
2. 右侧会实时显示转换后的HTML预览
3. 使用顶部工具栏的按钮执行各种操作

### 工具栏功能
- **🌓 切换主题**: 在亮色和暗色主题间切换
- **🗑️ 清空**: 清空输入框中的所有内容
- **📁 导出HTML**: 将当前内容导出为HTML文件
- **📋 复制HTML**: 复制生成的HTML代码到剪贴板

### 键盘快捷键
| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + S` | 导出HTML文件 |
| `Ctrl/Cmd + Shift + C` | 复制HTML代码 |
| `Ctrl/Cmd + Shift + T` | 切换主题 |
| `Ctrl/Cmd + Shift + X` | 清空内容 |
| `Tab` | 增加缩进 |
| `Shift + Tab` | 减少缩进 |

## 技术实现

### 架构设计
```
├── index.html           # 主页面文件
├── styles.css          # 样式文件
├── markdown-parser.js   # Markdown解析器
├── converter.js        # HTML转换器
└── script.js           # 主应用逻辑
```

### 核心技术
- **纯JavaScript实现**: 无需外部依赖
- **模块化设计**: 代码结构清晰，易于维护
- **正则表达式解析**: 高效的文本处理
- **CSS变量**: 支持主题切换
- **本地存储**: 保存用户设置

### 浏览器兼容性
- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## 项目结构

```
Markdown Converter/
│
├── index.html              # 主页面
├── styles.css              # 样式文件
├── script.js               # 主应用逻辑
├── markdown-parser.js      # Markdown解析器
├── converter.js            # HTML转换器
└── README.md              # 项目说明
```

## 开发说明

### 核心类说明

#### MarkdownParser
负责将Markdown文本解析为HTML结构：
- `parse(markdown)`: 主要解析方法
- `parseHeaders()`: 解析标题
- `parseCodeBlocks()`: 解析代码块
- `parseLists()`: 解析列表
- `parseLinks()`: 解析链接和图片

#### MarkdownConverter
负责HTML转换和后处理：
- `toHtml(markdown)`: 转换为HTML
- `toFullHtml()`: 生成完整HTML文档
- `addSyntaxHighlighting()`: 添加语法高亮
- `getStats()`: 获取文本统计

#### MarkdownConverterApp
主应用类，负责用户交互：
- `updatePreview()`: 更新实时预览
- `exportHtml()`: 导出HTML文件
- `toggleTheme()`: 切换主题
- `copyHtml()`: 复制HTML代码

### 扩展开发

如需添加新的Markdown语法支持：

1. 在`MarkdownParser`类中添加对应的解析规则
2. 在`rules`对象中定义正则表达式
3. 实现对应的解析方法
4. 在`parse`方法中调用新的解析方法

示例：
```javascript
// 添加新的解析规则
this.rules.customSyntax = /^custom:(.+)$/gm;

// 实现解析方法
parseCustomSyntax(text) {
    return text.replace(this.rules.customSyntax, '<div class="custom">$1</div>');
}

// 在parse方法中调用
html = this.parseCustomSyntax(html);
```

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 更新日志

### v1.0.0 (2024-12-XX)
- ✨ 初始版本发布
- 🚀 支持基础Markdown语法
- 🎨 实现亮色/暗色主题
- 📱 响应式设计
- ⚡ 实时预览功能
- 📁 HTML导出功能
- 📋 复制功能
- ⌨️ 键盘快捷键支持

## 反馈与支持

如果您在使用过程中遇到问题或有改进建议，请：

1. 提交 GitHub Issue
2. 发送邮件反馈
3. 在项目页面留言

---

**享受Markdown写作的乐趣！** ✨