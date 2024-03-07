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
            onDragEnd: function (e: any) {
                // On dragging the pet, drop vertically
                const moveTo = { y: 0 }
                const distance: number = Math.sqrt(Math.pow(e.layerY - moveTo.y, 2))
                gsap.to(_this.selector, { y: moveTo.y, duration: distance / 100 });
            },
        });
    }
}
