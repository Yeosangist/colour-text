# Color Word Highlighter

A userscript that automatically highlights color words on web pages using their actual colors.

## Features

- **200+ color words** mapped to their corresponding hex colors
- **Works on all websites** - matches `*://*/*`
- **Case-insensitive matching** - "Red", "red", and "RED" all match
- **Whole word matching** - prevents partial matches (e.g., "red" won't match inside "bored")
- **Dynamic content support** - uses MutationObserver to handle content added after page load
- **Tumblr-safe mode** - only processes post content on Tumblr to avoid UI interference
- **Configurable** - easily add, remove, or modify color entries and settings

## Installation

1. Install a userscript manager:
   - [Violentmonkey](https://violentmonkey.github.io/)
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [ScriptCat](https://scriptcat.org/)

2. Install this script by clicking on `colours.user.js`. It should automatically open in your userscript manager. Or copy the script content and create a new userscript.

## Customization

### Adding or Modifying Colors

Edit the `COLORS` array (lines 45-623) to add, remove, or modify color entries:

```javascript
{
    words: ['red', 'bright red', 'true red'],
    color: '#FF0000'
}
```

Each entry has:
- `words`: Array of word strings to match
- `color`: Hex color code to apply

### Settings

Modify these constants (lines 632-656) to change behavior:

```javascript
// Case-insensitive matching
const CASE_INSENSITIVE = true;

// Highlight whole words only
const WHOLE_WORDS_ONLY = true;

// Elements to ignore (text inside these won't be processed)
const IGNORED_ELEMENTS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA',
    'INPUT', 'SELECT', 'OPTION', 'CODE',
    'PRE', 'KBD', 'SAMP', 'SVG', 'MATH'
]);

// CSS class added to highlighted spans
const HIGHLIGHT_CLASS = '__color_word_highlight';
```

### Tumblr-Specific Behavior

On Tumblr domains, the script only processes content within post-related elements to avoid highlighting UI elements. The safe selectors include:

- `article`
- `[role="article"]`
- `[data-testid="post-body"]`
- `[data-testid="post_body"]`
- `.post-body`, `.post_body`
- `.npf`, `.npf_text`
- `.reblog-content`

To modify this behavior, edit the `TUMBLR_SAFE_SELECTOR` array (lines 21-31).

## How It Works

1. The script runs at `document-start` to inject CSS styles early
2. On page load, it walks the DOM tree and processes text nodes
3. Color words are wrapped in `<span>` elements with the appropriate color
4. A MutationObserver watches for new content and processes it dynamically
5. Text inside code blocks, inputs, and other interactive elements is ignored

## Author

Yeosangist

## License

This userscript is released under the GPLv3 License.
