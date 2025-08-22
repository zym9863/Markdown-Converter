# Markdown Converter

**🌐 Language:** [中文](README.md) | [English](README-EN.md)

A feature-rich, beautifully designed online Markdown to HTML converter that supports real-time preview, syntax highlighting, theme switching, and more.

## Features

### 🚀 Core Functions
- **Real-time Preview**: See HTML output instantly as you type
- **Syntax Highlighting**: Support for multiple programming languages
- **Export Function**: One-click export to complete HTML files
- **Copy Function**: Quick copy generated HTML code
- **Theme Switching**: Support for light/dark theme modes

### 📝 Supported Markdown Syntax
- ✅ Headers (H1-H6)
- ✅ Bold, italic, strikethrough
- ✅ Unordered and ordered lists
- ✅ Code blocks and inline code
- ✅ Links and images
- ✅ Blockquotes
- ✅ Tables
- ✅ Horizontal rules
- ✅ Auto-generated table of contents

### 🎨 Interface Features
- **Responsive Design**: Adapts to desktop and mobile devices
- **Split Layout**: Input on the left, preview on the right
- **Real-time Statistics**: Display character and word count
- **Theme Memory**: Automatically save user's theme preference
- **Keyboard Shortcuts**: Improve operation efficiency

## Usage

### Basic Usage
1. Enter Markdown content in the left text box
2. The right side will display real-time HTML preview
3. Use toolbar buttons at the top for various operations

### Toolbar Functions
- **🌓 Toggle Theme**: Switch between light and dark themes
- **🗑️ Clear**: Clear all content in the input box
- **📁 Export HTML**: Export current content as HTML file
- **📋 Copy HTML**: Copy generated HTML code to clipboard

### Keyboard Shortcuts
| Shortcut | Function |
|----------|----------|
| `Ctrl/Cmd + S` | Export HTML file |
| `Ctrl/Cmd + Shift + C` | Copy HTML code |
| `Ctrl/Cmd + Shift + T` | Toggle theme |
| `Ctrl/Cmd + Shift + X` | Clear content |
| `Tab` | Increase indentation |
| `Shift + Tab` | Decrease indentation |

## Technical Implementation

### Architecture Design
```
├── index.html           # Main page file
├── styles.css          # Style file
├── markdown-parser.js   # Markdown parser
├── converter.js        # HTML converter
└── script.js           # Main application logic
```

### Core Technologies
- **Pure JavaScript Implementation**: No external dependencies required
- **Modular Design**: Clear code structure, easy to maintain
- **Regular Expression Parsing**: Efficient text processing
- **CSS Variables**: Support for theme switching
- **Local Storage**: Save user settings

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## Project Structure

```
Markdown Converter/
│
├── index.html              # Main page
├── styles.css              # Style file
├── script.js               # Main application logic
├── markdown-parser.js      # Markdown parser
├── converter.js            # HTML converter
├── README.md              # Project documentation (Chinese)
└── README-EN.md           # Project documentation (English)
```

## Development Guide

### Core Class Description

#### MarkdownParser
Responsible for parsing Markdown text into HTML structure:
- `parse(markdown)`: Main parsing method
- `parseHeaders()`: Parse headers
- `parseCodeBlocks()`: Parse code blocks
- `parseLists()`: Parse lists
- `parseLinks()`: Parse links and images

#### MarkdownConverter
Responsible for HTML conversion and post-processing:
- `toHtml(markdown)`: Convert to HTML
- `toFullHtml()`: Generate complete HTML document
- `addSyntaxHighlighting()`: Add syntax highlighting
- `getStats()`: Get text statistics

#### MarkdownConverterApp
Main application class, responsible for user interaction:
- `updatePreview()`: Update real-time preview
- `exportHtml()`: Export HTML file
- `toggleTheme()`: Toggle theme
- `copyHtml()`: Copy HTML code

### Extension Development

To add new Markdown syntax support:

1. Add corresponding parsing rules in the `MarkdownParser` class
2. Define regular expressions in the `rules` object
3. Implement corresponding parsing methods
4. Call new parsing methods in the `parse` method

Example:
```javascript
// Add new parsing rule
this.rules.customSyntax = /^custom:(.+)$/gm;

// Implement parsing method
parseCustomSyntax(text) {
    return text.replace(this.rules.customSyntax, '<div class="custom">$1</div>');
}

// Call in parse method
html = this.parseCustomSyntax(html);
```

## License

MIT License - See [LICENSE](LICENSE) file for details

## Contributing

Issues and Pull Requests are welcome to help improve the project!

## Changelog

### v1.0.0 (2024-12-XX)
- ✨ Initial release
- 🚀 Support for basic Markdown syntax
- 🎨 Implement light/dark themes
- 📱 Responsive design
- ⚡ Real-time preview functionality
- 📁 HTML export functionality
- 📋 Copy functionality
- ⌨️ Keyboard shortcut support

## Feedback & Support

If you encounter problems or have suggestions for improvement:

1. Submit GitHub Issues
2. Send email feedback
3. Leave comments on the project page

---

**Enjoy the fun of Markdown writing!** ✨