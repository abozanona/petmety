const minNodeWidth = 200, minNodeHeight = 1;

type EdgeDetectorOptions = {
    startNode?: HTMLElement;
    debugMode?: boolean;
    ignoreSelector?: string;
}

enum EdgeOrientation {
    HORIZONTAL,
    VERTICAL,
}

type Edge = {
    orientation: EdgeOrientation,
    rectType: RectType,
    start: {
        x: number,
        y: number,
    },
    end: {
        x: number,
        y: number,
    },
    size: number,
}

enum RectType {
    DISTINGUISHABLE = 99,
    TEXT = 50,
    OTHER = 10,
}

type Rect = {
    rectType: RectType;
    visibility: RectVisibility;
    translate: RectTranslate;
}

type RectVisibility = {
    top: {
        isVisible: boolean;
        offset: number;
    },
    bottom: {
        isVisible: boolean;
        offset: number;
    },
    right: {
        isVisible: boolean;
        offset: number;
    },
    left: {
        isVisible: boolean;
        offset: number;
    }
}

class RectTranslate {
    private rect: DOMRect
    private rectType: RectType
    public constructor(rect: DOMRect, rectType: RectType) {
        this.rect = rect;
        this.rectType = rectType;
    }

    public get topEdge(): Edge {
        return {
            orientation: EdgeOrientation.HORIZONTAL,
            rectType: this.rectType,
            start: {
                x: this.rect.x,
                y: this.rect.y,
            },
            end: {
                x: this.rect.x + this.rect.width,
                y: this.rect.y,
            },
            size: this.rect.width,
        }
    }

    public get bottomEdge(): Edge {
        return {
            orientation: EdgeOrientation.HORIZONTAL,
            rectType: this.rectType,
            start: {
                x: this.rect.x,
                y: this.rect.y + this.rect.height,
            },
            end: {
                x: this.rect.x + this.rect.width,
                y: this.rect.y + this.rect.height,
            },
            size: this.rect.width,
        }
    }

    public get rightEdge(): Edge {
        return {
            orientation: EdgeOrientation.VERTICAL,
            rectType: this.rectType,
            start: {
                x: this.rect.x + this.rect.width,
                y: this.rect.y,
            },
            end: {
                x: this.rect.x + this.rect.width,
                y: this.rect.y + this.rect.height,
            },
            size: this.rect.height,
        }
    }

    public get leftEdge(): Edge {
        return {
            orientation: EdgeOrientation.VERTICAL,
            rectType: this.rectType,
            start: {
                x: this.rect.x,
                y: this.rect.y,
            },
            end: {
                x: this.rect.x,
                y: this.rect.y + this.rect.height,
            },
            size: this.rect.height,
        }
    }

    public get width() {
        return this.rect.width;
    }

    public get height() {
        return this.rect.height;
    }
}

export class EdgeDetector {
    private nodesCount: number = 0;
    private defaultOptions: EdgeDetectorOptions = {
        startNode: document.body,
        debugMode: false,
        ignoreSelector: "#vp-player-container",
    };
    private options: EdgeDetectorOptions;

    private _foundRects: Rect[]

    constructor(opt: EdgeDetectorOptions) {
        this.nodesCount = 0;
        this.options = { ...this.defaultOptions, ...opt }
        this._foundRects = [];
    }

    public get edges() {
        return this._foundRects;
    }

    public get horizontalRects(): Rect[] {
        return this._foundRects.filter(edge => edge.visibility.top || edge.visibility.bottom);
    }

    public get verticalRects(): Rect[] {
        return this._foundRects.filter(edge => edge.visibility.right || edge.visibility.left);
    }

    public get horizontalEdges(): Edge[] {
        return this._foundRects.filter(edge => edge.visibility.top || edge.visibility.bottom).flatMap(edge =>
            [].concat(
                edge.visibility.top ? edge.translate.topEdge : [],
                edge.visibility.bottom ? edge.translate.bottomEdge : []
            )
        );
    }

    public get topEdges(): Edge[] {
        return this._foundRects.filter(edge => edge.visibility.top).flatMap(edge =>
            [].concat(
                edge.visibility.top ? edge.translate.topEdge : [],
                edge.visibility.bottom ? edge.translate.bottomEdge : []
            )
        );
    }

    public get verticalEdges(): Edge[] {
        return this._foundRects.filter(edge => edge.visibility.right || edge.visibility.left).flatMap(edge =>
            [].concat(
                edge.visibility.right ? edge.translate.rightEdge : [],
                edge.visibility.left ? edge.translate.leftEdge : []
            )
        );
    }

    getRectEdgesInViewPort(rect: DOMRect): RectVisibility {
        const viewPortHeight: number = window.innerHeight || document.documentElement.clientHeight;
        const viewPortWidth: number = window.innerWidth || document.documentElement.clientWidth;

        const isTop = rect.top >= 0 && rect.top <= viewPortHeight;
        const isBottom = rect.bottom <= viewPortHeight && rect.bottom >= 0;
        const isRight = rect.right <= viewPortWidth;
        const isLeft = rect.left >= 0;

        return {
            top: {
                isVisible: isTop,// && (isRight || isLeft),
                offset: rect.top,
            },
            bottom: {
                isVisible: isBottom,// && (isRight || isLeft),
                offset: viewPortHeight - rect.bottom,
            },
            right: {
                isVisible: isRight && (isTop || isBottom),
                offset: viewPortWidth - rect.right,
            },
            left: {
                isVisible: isLeft && (isTop || isBottom),
                offset: rect.left,
            },
        };
    }

    injectCalculator() {
        if (this.options.debugMode) {
            document.body.classList.add("vp-debug-mode")
        } else {
            document.body.classList.remove("vp-debug-mode")
        }
        this._foundRects = [];
        this.caclulateEdges(this.options.startNode)
        let isScrolling: NodeJS.Timeout;
        let _this = this;
        document.addEventListener("scroll", (event) => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(function () {
                _this._foundRects = [];
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
        const edgesVisibility = this.getRectEdgesInViewPort(nodeRect);
        if (!edgesVisibility.top.isVisible && !edgesVisibility.bottom.isVisible && !edgesVisibility.right.isVisible && !edgesVisibility.left.isVisible) {
            addNode = false;
        }
        if (!edgesVisibility.top.isVisible) {
            node.classList.remove("vp-edge-detector-top-text");
            node.classList.remove("vp-edge-detector-top-full");
            node.classList.remove("vp-edge-detector-top-partial");
        }
        if (!edgesVisibility.bottom.isVisible) {
            node.classList.remove("vp-edge-detector-bottom-text");
            node.classList.remove("vp-edge-detector-bottom-full");
            node.classList.remove("vp-edge-detector-bottom-partial");
        }
        if (!edgesVisibility.right.isVisible) {
            node.classList.remove("vp-edge-detector-right-text");
            node.classList.remove("vp-edge-detector-right-full");
            node.classList.remove("vp-edge-detector-right-partial");
        }
        if (!edgesVisibility.left.isVisible) {
            node.classList.remove("vp-edge-detector-left-text");
            node.classList.remove("vp-edge-detector-left-full");
            node.classList.remove("vp-edge-detector-left-partial");
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
            let rectType: RectType = RectType.OTHER;
            if (node.nodeType === Node.TEXT_NODE || ['b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup', 'span', 'p', 'code'].includes(node.tagName?.toLowerCase())) {
                // If it's a text or an inline element
                if (edgesVisibility.top.isVisible) {
                    node.classList.add("vp-edge-detector-top-text")
                }
                if (edgesVisibility.bottom.isVisible) {
                    node.classList.add("vp-edge-detector-bottom-text")
                }
                if (edgesVisibility.right.isVisible) {
                    node.classList.add("vp-edge-detector-right-text")
                }
                if (edgesVisibility.left.isVisible) {
                    node.classList.add("vp-edge-detector-left-text")
                }
                rectType = RectType.TEXT;
            } else if (
                // If we have difference in top
                (window.getComputedStyle(node).borderStyle !== 'none' && window.getComputedStyle(node).borderTopColor && (window.getComputedStyle(node).borderTopColor !== window.getComputedStyle(node).backgroundColor || window.getComputedStyle(node).borderTopColor !== window.getComputedStyle(node.parentNode as HTMLElement).backgroundColor)) ||
                // If we have difference in bottom
                (window.getComputedStyle(node).borderStyle !== 'none' && window.getComputedStyle(node).borderBottomColor && (window.getComputedStyle(node).borderBottomColor !== window.getComputedStyle(node).backgroundColor || window.getComputedStyle(node).borderBottomColor !== window.getComputedStyle(node.parentNode as HTMLElement).backgroundColor)) ||
                // If we have difference in backgroundColors
                window.getComputedStyle(node).backgroundColor !== window.getComputedStyle((node.parentNode as HTMLElement)).backgroundColor
            ) {
                // If element has border || has different background from it's parent
                if (edgesVisibility.top.isVisible) {
                    node.classList.add("vp-edge-detector-top-full")
                }
                if (edgesVisibility.bottom.isVisible) {
                    node.classList.add("vp-edge-detector-bottom-full")
                }
                if (edgesVisibility.right.isVisible) {
                    node.classList.add("vp-edge-detector-right-full")
                }
                if (edgesVisibility.left.isVisible) {
                    node.classList.add("vp-edge-detector-left-full")
                }
                rectType = RectType.DISTINGUISHABLE;
            } else {
                // If it shares same area with parent
                if (edgesVisibility.top.isVisible) {
                    node.classList.add("vp-edge-detector-top-partial")
                }
                if (edgesVisibility.bottom.isVisible) {
                    node.classList.add("vp-edge-detector-bottom-partial")
                }
                if (edgesVisibility.right.isVisible) {
                    node.classList.add("vp-edge-detector-right-partial")
                }
                if (edgesVisibility.left.isVisible) {
                    node.classList.add("vp-edge-detector-left-partial")
                }
                rectType = RectType.OTHER;
            }
            this._foundRects.push({
                rectType: rectType,
                visibility: edgesVisibility,
                translate: new RectTranslate(nodeRect, rectType),
            })
        }
        let _this = this;
        node.childNodes.forEach(element => {
            _this.caclulateEdges(element as HTMLElement, level + 1);
        });
    }
}