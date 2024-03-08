import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import { store } from "./store";

export class AnimationHelper {
    private selector: string;
    constructor(selector: string) {
        this.selector = selector;
    }
    init() {
        gsap.registerPlugin(Draggable)
        let _this = this;

        Draggable.create(this.selector, {
            type: "x,y",
            onDragEnd: function (e: any) { // On dragging the pet, drop vertically
                const spriteRect = document.querySelector(_this.selector).getBoundingClientRect();

                const edges = store
                    .edgeDetector
                    .topEdges
                    .filter(el => el.start.y > e.clientY + spriteRect.height && el.start.x <= e.clientX && el.end.x >= e.clientX); // enges below the sprite

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
                const distance: number = Math.sqrt(Math.pow(e.clientY - moveTo.y, 2))
                gsap.to(_this.selector, { ...moveTo, duration: distance / 100 });
            },
        });
    }
}
