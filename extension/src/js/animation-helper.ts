import { gsap, Draggable } from "gsap/all";

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
            onDragEnd: function (e: any) {
                const moveTo = { x: e.layerX, y: 0 }
                const distance: number = Math.sqrt(Math.pow(e.layerX - moveTo.x, 2) + Math.pow(e.layerY - moveTo.y, 2))
                gsap.to(_this.selector, { x: moveTo.x, y: moveTo.y, scale: 1, duration: distance / 100 });
            },
        });
    }
}
