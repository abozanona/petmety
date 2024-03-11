import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { store } from "./store";
import { Edge, EdgeDetector } from "./edge-detector";
import { logger } from "./utils/logger";

export class AnimationEngine {
    private selector: string;
    constructor(selector: string) {
        this.selector = selector;
    }
    init() {
        gsap.registerPlugin(Draggable, MotionPathPlugin)
        
        Draggable.create(this.selector, {
            type: "x,y",
            dragClickables: false,
            onDragEnd: this.dropToEdgeAfterDragEnds.bind(this) // On dragging the pet, drop vertically
        });
    }

    dropToEdgeAfterDragEnds(dragEndEvent: any) {
        const spriteRect = document.querySelector(this.selector).getBoundingClientRect();

        const edges = store
            .edgeDetector
            .topEdges
            .filter(el => el.start.y > dragEndEvent.clientY + spriteRect.height && el.start.x <= dragEndEvent.clientX && el.end.x >= dragEndEvent.clientX); // enges below the sprite

        // Sort based on priority randomly, get edge with highest priority
        edges.sort((a, b) => {
            return Math.random() * 10 * b.rectType * b.rectType - Math.random() * 10 * a.rectType * a.rectType;
        })
        const edge = edges[0];

        const moveTo = {
            left: spriteRect.left + window.scrollX, // spriteX + scrollX
            top: edge.start.y + window.scrollY - spriteRect.height, //  edgeY + scrollY - spriteHeight
            x: 0,
            y: 0
        }
        // drop down with a constant speed
        const distance: number = Math.sqrt(Math.pow(dragEndEvent.clientY - moveTo.y, 2))
        gsap.to(this.selector, { ...moveTo, duration: distance / 100 });
    }

    jumpToEdge(edgeTo: Edge) {
        // Can't jump to a point out of view port
        if (!EdgeDetector.isPointInViewPort(edgeTo.start)) {
            logger.warn("start point out of viewport")
            return;
        }

        const spriteRect = document.querySelector(this.selector).getBoundingClientRect();

        // Move to edge
        // TODO: This needs to be with a jump & a MotionPath helper
        const moveTo = {
            left: edgeTo.start.x + window.scrollX, // edgeX + scrollX
            top: edgeTo.start.y + window.scrollY - spriteRect.height, //  edgeY + scrollY - spriteHeight
            x: 0,
            y: 0
        }

        gsap.to(this.selector, { ...moveTo, duration: 5 });
    }
}
