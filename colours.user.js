// ==UserScript==
// @name         Color Word Highlighter
// @namespace    scriptcat.Yeosangist.color-word-highlighter
// @version      1.0.0
// @description  Highlights color words using their actual colors.
// @author       Yeosangist
// @license      CC BY-NC-SA
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const hostname = window.location.hostname.toLowerCase();
    const isTumblr =
        hostname === 'tumblr.com' ||
        hostname.endsWith('.tumblr.com');

    const TUMBLR_SAFE_SELECTOR = [
        'article',
        '[role="article"]',
        '[data-testid="post-body"]',
        '[data-testid="post_body"]',
        '.post-body',
        '.post_body',
        '.npf',
        '.npf_text',
        '.reblog-content'
    ].join(',');

    /*
     * ============================================================
     * WORDS / COLORS
     * ============================================================
     *
     * Add, remove, or modify entries here.
     *
     * Each entry has:
     *   words: words to match
     *   color: the hex color to apply
     */

    const COLORS = [
        // Reds
        {
            words: ['red', 'bright red', 'true red'],
            color: '#FF0000'
        },
        {
            words: ['crimson'],
            color: '#DC143C'
        },
        {
            words: ['scarlet', 'vermilion'],
            color: '#FF2400'
        },
        {
            words: ['ruby', 'ruby red'],
            color: '#E0115F'
        },
        {
            words: ['cherry', 'cherry red'],
            color: '#D2042D'
        },
        {
            words: ['carmine'],
            color: '#960018'
        },
        {
            words: ['cardinal'],
            color: '#C41E3A'
        },
        {
            words: ['firebrick'],
            color: '#B22222'
        },
        {
            words: ['brick red'],
            color: '#CB4154'
        },

        // Dark Reds
        {
            words: ['maroon'],
            color: '#800000'
        },
        {
            words: ['burgundy', 'wine', 'wine red'],
            color: '#800020'
        },
        {
            words: ['oxblood', 'blood'],
            color: '#4A0000'
        },
        {
            words: ['garnet'],
            color: '#733635'
        },

        // Oranges
        {
            words: ['orange', 'true orange'],
            color: '#FFA500'
        },
        {
            words: ['tangerine'],
            color: '#F28500'
        },
        {
            words: ['mandarin'],
            color: '#F37A1F'
        },
        {
            words: ['carrot', 'carrot orange'],
            color: '#ED9121'
        },
        {
            words: ['burnt orange'],
            color: '#CC5500'
        },
        {
            words: ['pumpkin'],
            color: '#FF7518'
        },
        {
            words: ['terracotta'],
            color: '#E2725B'
        },
        {
            words: ['rust', 'rust orange'],
            color: '#B7410E'
        },
        {
            words: ['copper'],
            color: '#B87333'
        },

        // Yellows
        {
            words: ['yellow', 'true yellow'],
            color: '#FFFF00'
        },
        {
            words: ['lemon', 'lemon yellow'],
            color: '#FFF44F'
        },
        {
            words: ['canary', 'canary yellow'],
            color: '#FFEF00'
        },
        {
            words: ['mustard'],
            color: '#FFDB58'
        },
        {
            words: ['gold', 'golden'],
            color: '#D4AF37'
        },
        {
            words: ['amber'],
            color: '#FFBF00'
        },
        {
            words: ['honey'],
            color: '#EB9605'
        },
        {
            words: ['ochre', 'yellow ochre'],
            color: '#CC7722'
        },

        // Greens
        {
            words: ['green', 'true green'],
            color: '#008000'
        },
        {
            words: ['lime', 'lime green'],
            color: '#32CD32'
        },
        {
            words: ['chartreuse'],
            color: '#7FFF00'
        },
        {
            words: ['emerald', 'emerald green'],
            color: '#50C878'
        },
        {
            words: ['jade'],
            color: '#00A86B'
        },
        {
            words: ['mint', 'mint green'],
            color: '#98FF98'
        },
        {
            words: ['seafoam', 'seafoam green'],
            color: '#93E9BE'
        },
        {
            words: ['sage', 'sage green'],
            color: '#9CAF88'
        },
        {
            words: ['olive', 'olive green'],
            color: '#808000'
        },
        {
            words: ['forest', 'forest green'],
            color: '#228B22'
        },
        {
            words: ['moss', 'moss green'],
            color: '#8A9A5B'
        },
        {
            words: ['hunter', 'hunter green'],
            color: '#355E3B'
        },
        {
            words: ['pine', 'pine green'],
            color: '#01796F'
        },
        {
            words: ['avocado'],
            color: '#568203'
        },

        // Blues
        {
            words: ['blue', 'true blue'],
            color: '#0000FF'
        },
        {
            words: ['sky', 'sky blue'],
            color: '#87CEEB'
        },
        {
            words: ['baby blue'],
            color: '#89CFF0'
        },
        {
            words: ['powder blue'],
            color: '#B0E0E6'
        },
        {
            words: ['cornflower', 'cornflower blue'],
            color: '#6495ED'
        },
        {
            words: ['azure'],
            color: '#007FFF'
        },
        {
            words: ['cerulean'],
            color: '#007BA7'
        },
        {
            words: ['cobalt', 'cobalt blue'],
            color: '#0047AB'
        },
        {
            words: ['sapphire'],
            color: '#0F52BA'
        },
        {
            words: ['royal', 'royal blue'],
            color: '#4169E1'
        },
        {
            words: ['navy', 'navy blue'],
            color: '#000080'
        },
        {
            words: ['midnight', 'midnight blue'],
            color: '#191970'
        },
        {
            words: ['steel', 'steel blue'],
            color: '#4682B4'
        },
        {
            words: ['denim'],
            color: '#1560BD'
        },
        {
            words: ['slate blue'],
            color: '#6A5ACD'
        },

        // Cyans / Blue-Greens
        {
            words: ['cyan'],
            color: '#00FFFF'
        },
        {
            words: ['aqua'],
            color: '#00FFFF'
        },
        {
            words: ['turquoise'],
            color: '#40E0D0'
        },
        {
            words: ['teal'],
            color: '#008080'
        },
        {
            words: ['aquamarine'],
            color: '#7FFFD4'
        },
        {
            words: ['cyan blue'],
            color: '#00B7EB'
        },
        {
            words: ['petrol', 'petrol blue'],
            color: '#005F6A'
        },

        // Purples
        {
            words: ['purple', 'true purple'],
            color: '#800080'
        },
        {
            words: ['violet'],
            color: '#8F00FF'
        },
        {
            words: ['amethyst'],
            color: '#9966CC'
        },
        {
            words: ['lavender'],
            color: '#E6E6FA'
        },
        {
            words: ['lilac'],
            color: '#C8A2C8'
        },
        {
            words: ['mauve'],
            color: '#E0B0FF'
        },
        {
            words: ['plum'],
            color: '#8E4585'
        },
        {
            words: ['grape'],
            color: '#6F2DA8'
        },
        {
            words: ['eggplant', 'aubergine'],
            color: '#483248'
        },
        {
            words: ['orchid'],
            color: '#DA70D6'
        },
        {
            words: ['wisteria'],
            color: '#BDB5D5'
        },

        // Indigos
        {
            words: ['indigo'],
            color: '#4B0082'
        },
        {
            words: ['periwinkle'],
            color: '#CCCCFF'
        },
        {
            words: ['blue violet', 'blue-violet'],
            color: '#8A2BE2'
        },

        // Pinks
        {
            words: ['pink', 'true pink'],
            color: '#FFC0CB'
        },
        {
            words: ['hot pink'],
            color: '#FF69B4'
        },
        {
            words: ['bubblegum', 'bubblegum pink'],
            color: '#FFC1CC'
        },
        {
            words: ['blush', 'blush pink'],
            color: '#DE5D83'
        },
        {
            words: ['rose', 'rose pink'],
            color: '#FF007F'
        },
        {
            words: ['dusty rose'],
            color: '#C08081'
        },
        {
            words: ['salmon'],
            color: '#FA8072'
        },
        {
            words: ['watermelon'],
            color: '#FC6C85'
        },
        {
            words: ['fuchsia'],
            color: '#FF00FF'
        },
        {
            words: ['magenta'],
            color: '#FF00FF'
        },
        {
            words: ['raspberry'],
            color: '#E30B5C'
        },
        {
            words: ['cerise'],
            color: '#DE3163'
        },

        // Corals / Peaches
        {
            words: ['coral'],
            color: '#FF7F50'
        },
        {
            words: ['light coral'],
            color: '#F08080'
        },
        {
            words: ['peach'],
            color: '#FFE5B4'
        },
        {
            words: ['apricot'],
            color: '#FBCEB1'
        },
        {
            words: ['peachy'],
            color: '#F8B878'
        },
        {
            words: ['melon'],
            color: '#FDBCB4'
        },

        // Browns
        {
            words: ['brown', 'true brown'],
            color: '#8B4513'
        },
        {
            words: ['chocolate'],
            color: '#7B3F00'
        },
        {
            words: ['coffee'],
            color: '#6F4E37'
        },
        {
            words: ['espresso'],
            color: '#4B3621'
        },
        {
            words: ['chestnut'],
            color: '#954535'
        },
        {
            words: ['mahogany'],
            color: '#C04000'
        },
        {
            words: ['sienna'],
            color: '#A0522D'
        },
        {
            words: ['burnt sienna'],
            color: '#E97451'
        },
        {
            words: ['umber'],
            color: '#635147'
        },
        {
            words: ['raw umber'],
            color: '#826644'
        },
        {
            words: ['tan'],
            color: '#D2B48C'
        },
        {
            words: ['camel'],
            color: '#C19A6B'
        },
        {
            words: ['taupe'],
            color: '#483C32'
        },

        // Beiges / Creams
        {
            words: ['beige'],
            color: '#F5F5DC'
        },
        {
            words: ['cream'],
            color: '#FFFDD0'
        },
        {
            words: ['ivory'],
            color: '#FFFFF0'
        },
        {
            words: ['ecru'],
            color: '#C2B280'
        },
        {
            words: ['sand', 'sandstone'],
            color: '#C2B280'
        },
        {
            words: ['khaki'],
            color: '#C3B091'
        },

        // Whites
        {
            words: ['off white', 'off-white'],
            color: '#FAF9F6'
        },
        {
            words: ['snow'],
            color: '#FFFAFA'
        },
        {
            words: ['pearl'],
            color: '#EAE0C8'
        },
        {
            words: ['alabaster'],
            color: '#EDEAE0'
        },

        // Grays
        {
            words: ['gray', 'grey'],
            color: '#808080'
        },
        {
            words: ['light gray', 'light grey'],
            color: '#D3D3D3'
        },
        {
            words: ['dark gray', 'dark grey'],
            color: '#A9A9A9'
        },
        {
            words: ['charcoal'],
            color: '#36454F'
        },
        {
            words: ['slate', 'slate gray', 'slate grey'],
            color: '#708090'
        },
        {
            words: ['ash', 'ash gray'],
            color: '#B2BEB5'
        },
        {
            words: ['smoke', 'smoky gray'],
            color: '#848884'
        },
        {
            words: ['graphite'],
            color: '#41424C'
        },

        // Blacks
        {
            words: ['jet', 'jet black', 'onyx'],
            color: '#343434'
        },

        // Metallic / Special Colours
        {
            words: ['silver'],
            color: '#C0C0C0'
        },
        {
            words: ['platinum'],
            color: '#E5E4E2'
        },
        {
            words: ['gold'],
            color: '#D4AF37'
        },
        {
            words: ['bronze'],
            color: '#CD7F32'
        },
        {
            words: ['brass'],
            color: '#B5A642'
        },
        {
            words: ['copper'],
            color: '#B87333'
        },
    ];


    /*
     * ============================================================
     * SETTINGS
     * ============================================================
     */

    // Case-insensitive matching.
    const CASE_INSENSITIVE = true;

    // Highlight whole words rather than arbitrary substrings.
    const WHOLE_WORDS_ONLY = true;

    // Don't process text inside these elements.
    const IGNORED_ELEMENTS = new Set([
        'SCRIPT',
        'STYLE',
        'NOSCRIPT',
        'TEXTAREA',
        'INPUT',
        'SELECT',
        'OPTION',
        'CODE',
        'PRE',
        'KBD',
        'SAMP',
        'SVG',
        'MATH'
    ]);

    // Class added to generated spans.
    const HIGHLIGHT_CLASS = '__color_word_highlight';


    /*
     * ============================================================
     * CSS
     * ============================================================
     */

    const style = document.createElement('style');

    style.textContent = `
        .${HIGHLIGHT_CLASS} {
            display: inline;
            color: var(--cwh-color) !important;
            font: inherit !important;
        }
    `;

    // document-start means <head> may not exist yet.
    function installStyle() {
        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.documentElement.appendChild(style);
        }
    }

    installStyle();


    /*
     * ============================================================
     * BUILD REGEX
     * ============================================================
     */

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Make a lookup table so each match knows which color it belongs to.
    const wordToColor = new Map();

    for (const colorEntry of COLORS) {
        for (const word of colorEntry.words) {
            wordToColor.set(word.toLowerCase(), colorEntry.color);
        }
    }

    // Longest words first.
    // This prevents shorter entries from stealing matches.
    const words = [...wordToColor.keys()]
        .sort((a, b) => b.length - a.length)
        .map(escapeRegex);

    if (words.length === 0) {
        return;
    }

    let boundaryStart = '';
    let boundaryEnd = '';

    if (WHOLE_WORDS_ONLY) {
        boundaryStart = '(?<![\\p{L}\\p{N}_-])';
        boundaryEnd = '(?![\\p{L}\\p{N}_-])';
    }

    const regex = new RegExp(
        boundaryStart +
        `(${words.join('|')})` +
        boundaryEnd,
        CASE_INSENSITIVE ? 'giu' : 'gu'
    );


    /*
     * ============================================================
     * CREATE HIGHLIGHT
     * ============================================================
     */

    function makeHighlight(text) {
        const color = wordToColor.get(text.toLowerCase());

        if (!color) {
            return document.createTextNode(text);
        }

        const span = document.createElement('span');

        span.className = HIGHLIGHT_CLASS;
        span.textContent = text;

        span.style.setProperty('--cwh-color', color);

        return span;
    }


    /*
     * ============================================================
     * PROCESS TEXT NODE
     * ============================================================
     */

    function isTumblrSafeNode(node) {
        if (!isTumblr) {
            return true;
        }

        const element = node.nodeType === Node.ELEMENT_NODE
            ? node
            : node.parentElement;

        return !!element && !!element.closest(TUMBLR_SAFE_SELECTOR);
    }

    function processTextNode(node) {
        if (!node || !node.parentElement) {
            return;
        }

        const parent = node.parentElement;

        if (
            !isTumblrSafeNode(node) ||
            IGNORED_ELEMENTS.has(parent.tagName) ||
            parent.closest('[contenteditable]:not([contenteditable="false"])')
        ) {
            return;
        }

        if (parent.closest(`.${HIGHLIGHT_CLASS}`)) {
            return;
        }

        const text = node.nodeValue;

        if (!text || !regex.test(text)) {
            regex.lastIndex = 0;
            return;
        }

        // Reset regex because RegExp objects with /g retain lastIndex.
        regex.lastIndex = 0;

        const fragment = document.createDocumentFragment();

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            if (start > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(
                        text.slice(lastIndex, start)
                    )
                );
            }

            fragment.appendChild(makeHighlight(match[0]));

            lastIndex = end;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(
                document.createTextNode(
                    text.slice(lastIndex)
                )
            );
        }

        node.parentNode.replaceChild(fragment, node);

        regex.lastIndex = 0;
    }


    /*
     * ============================================================
     * WALK A SUBTREE
     * ============================================================
     */

    function processElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        if (IGNORED_ELEMENTS.has(element.tagName)) {
            return;
        }

        if (element.isContentEditable) {
            return;
        }

        if (
            isTumblr &&
            !element.matches(TUMBLR_SAFE_SELECTOR) &&
            !element.closest(TUMBLR_SAFE_SELECTOR) &&
            !element.querySelector(TUMBLR_SAFE_SELECTOR)
        ) {
            return;
        }

        if (element.classList.contains(HIGHLIGHT_CLASS)) {
            return;
        }

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;

                    if (!parent) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (!isTumblrSafeNode(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (IGNORED_ELEMENTS.has(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.closest('[contenteditable]:not([contenteditable="false"])')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.closest(`.${HIGHLIGHT_CLASS}`)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];

        let node;

        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        for (const textNode of nodes) {
            processTextNode(textNode);
        }
    }


    /*
     * ============================================================
     * INITIAL PAGE
     * ============================================================
     */

    function processPage() {
        if (document.body) {
            processElement(document.body);
        }
    }


    /*
     * ============================================================
     * DYNAMIC CONTENT
     * ============================================================
     *
     * Modern websites constantly add/change content without
     * reloading the page. MutationObserver catches that.
     */

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {

            // Newly inserted elements.
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    processElement(addedNode);
                } else if (addedNode.nodeType === Node.TEXT_NODE) {
                    processTextNode(addedNode);
                }
            }

            // Existing text that has changed.
            if (mutation.type === 'characterData') {
                processTextNode(mutation.target);
            }
        }
    });


    /*
     * ============================================================
     * START
     * ============================================================
     */

    function start() {
        processPage();

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, {
            once: true
        });
    } else {
        start();
    }

})();
