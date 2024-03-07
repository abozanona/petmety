const minNodeWidth = 200, minNodeHeight = 1;

type EdgeDetectorOptions = {
    startNode?: HTMLElement;
    debugMode?: boolean;
    ignoreSelector?: string;
}

export class EdgeDetector {
    private nodesCount: number = 0;
    private defaultOptions: EdgeDetectorOptions = {
        startNode: document.body,
        debugMode: false,
        ignoreSelector: "#vp-player-container",
    };
    private options: EdgeDetectorOptions;

    constructor(opt: EdgeDetectorOptions) {
        this.nodesCount = 0;
        this.options = { ...this.defaultOptions, ...opt }
    }

    isRectInViewPort(rect: DOMRect) {
        const viewPortBottom: number = window.innerHeight || document.documentElement.clientHeight;
        const viewPortRight: number = window.innerWidth || document.documentElement.clientWidth;

        // // check if element is completely visible inside the viewport
        // return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= viewPortBottom && rect.right <= viewPortRight);

        // check if element is visible inside the viewport
        return (rect.top >= 0 || rect.bottom <= viewPortBottom);
    }

    injectCalculator() {
        if (this.options.debugMode) {
            document.body.classList.add("vp-debug-mode")
        } else {
            document.body.classList.remove("vp-debug-mode")
        }
        this.caclulateEdges(this.options.startNode)
        let isScrolling: NodeJS.Timeout;
        let _this = this;
        document.addEventListener("scroll", (event) => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(function () {
                _this.caclulateEdges(_this.options.startNode)
            }, 93);
        })
    }

    caclulateEdges(node: HTMLElement, level: number = 0) {
        if (node.matches && node.matches(this.options.ignoreSelector)) {
            return;
        }
        // Remove old classes
        let addNode = true;
        // Don't add non-renereable nodes
        if ([+Node.COMMENT_NODE, +Node.CDATA_SECTION_NODE, +Node.PROCESSING_INSTRUCTION_NODE, +Node.DOCUMENT_TYPE_NODE].includes(node.nodeType)) {
            return;
        }
        // Don't add hidden nodes
        if (node.style?.display === 'none' || node.style?.visibility === 'hidden') {
            return;
        }
        // Don't add script & css
        if (!node.tagName || ['script', 'style'].includes(node.tagName?.toLowerCase())) {
            return;
        }
        if (!level) {
            level = 1;
        }
        let nodeRect;
        // handle text nodes
        if (node.nodeType === Node.TEXT_NODE) {
            const range = document.createRange();
            range.selectNode(node);
            nodeRect = range.getBoundingClientRect();
            range.detach();
        } else {
            nodeRect = node.getBoundingClientRect();
        }
        // Ignore nodes outside viewport
        if (!this.isRectInViewPort(nodeRect)) {
            addNode = false;
            node.classList.remove("vp-edge-detector-text");
            node.classList.remove("vp-edge-detector-full");
            node.classList.remove("vp-edge-detector-partial");
        }
        // Don't add small nodes
        if (nodeRect.width < minNodeWidth || nodeRect.height < minNodeHeight) {
            return;
        }
        // Don't add nodes that has same size as parent node, but still loob thru child nodes
        if (node.parentNode) {
            const parentRect = (node.parentNode as HTMLElement).getBoundingClientRect();
            if (Math.abs(nodeRect.width - parentRect.width) < 10 && Math.abs(nodeRect.height - parentRect.height) < 10) {
                addNode = false;
            }
        }
        if (addNode) {
            this.nodesCount++;
            if (node.nodeType === Node.TEXT_NODE || ['b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup', 'span', 'p', 'code'].includes(node.tagName?.toLowerCase())) {
                // If it's a text or an inline element
                node.classList.add("vp-edge-detector-text")
            } else if (
                // If we have difference in top
                (window.getComputedStyle(node).borderStyle !== 'none' && window.getComputedStyle(node).borderTopColor && (window.getComputedStyle(node).borderTopColor !== window.getComputedStyle(node).backgroundColor || window.getComputedStyle(node).borderTopColor !== window.getComputedStyle(node.parentNode as HTMLElement).backgroundColor)) ||
                // If we have difference in bottom
                (window.getComputedStyle(node).borderStyle !== 'none' && window.getComputedStyle(node).borderBottomColor && (window.getComputedStyle(node).borderBottomColor !== window.getComputedStyle(node).backgroundColor || window.getComputedStyle(node).borderBottomColor !== window.getComputedStyle(node.parentNode as HTMLElement).backgroundColor)) ||
                // If we have difference in backgroundColors
                window.getComputedStyle(node).backgroundColor !== window.getComputedStyle((node.parentNode as HTMLElement)).backgroundColor
            ) {
                // If element has border || has different background from it's parent
                node.classList.add("vp-edge-detector-full")
            } else {
                // If it shares same area with parent
                node.classList.add("vp-edge-detector-partial")
            }
        }
        let _this = this;
        node.childNodes.forEach(element => {
            _this.caclulateEdges(element as HTMLElement, level + 1);
        });
    }
}