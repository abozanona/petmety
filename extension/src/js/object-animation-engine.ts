import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { store } from "./engines";
import { WithOptional, WithRequired } from "./utils/utils";
import { Point2d, RectType } from "./edge-detector";
import { GSAPHelper } from "./utils/gsap-helper";
import { StorePublic } from "../app/app-context/store-context";

type ObjectAnimationEngineOptions = {
	objectDom: Element;
	edgeTypes: [RectType, ...Array<RectType>];
};

export class ObjectAnimationEngine {
	private defaultOptions: WithOptional<ObjectAnimationEngineOptions, "objectDom"> = {
		edgeTypes: [RectType.WINDOW],
	};
	private options: ObjectAnimationEngineOptions;
	constructor(opt: WithRequired<Partial<ObjectAnimationEngineOptions>, "objectDom">) {
		this.options = { ...this.defaultOptions, ...opt };
		this.init();
	}
	private init() {
		gsap.registerPlugin(Draggable, MotionPathPlugin);

		Draggable.create(this.options.objectDom, {
			type: "x,y",
			dragClickables: false,
			onDragEnd: this.dropToEdgeAfterDragEnds.bind(this), // On dragging the pet, drop vertically
		});
	}

	dropToEdgeAfterDragEnds(dragEndEvent: any) {
		this.dropObject({
			x: dragEndEvent.clientX,
			y: dragEndEvent.clientY,
		});
	}

	dropObject(objectLocation: Point2d) {
		const spriteRect = this.options.objectDom.getBoundingClientRect();
		const edges = store.edgeDetector.topVisibleEdges
			.filter((el) => el.start.y > objectLocation.y + spriteRect.height && el.start.x <= objectLocation.x && el.end.x >= objectLocation.x) // enges below the sprite
			.filter((el) => this.options.edgeTypes.includes(el.rectType));

		edges.sort((a, b) => {
			return b.rectType - a.rectType;
		});
		if (!edges.length) {
			return;
		}
		const edge = edges[0];
		if (!edge) {
			return;
		}

		const moveTo = {
			left: spriteRect.x + window.scrollX, // spriteX + scrollX
			top: edge.start.y + window.scrollY - spriteRect.height, //  edgeY + scrollY - spriteHeight
			x: 0,
			y: 0,
		};
		// drop down with a constant speed
		const distance: number = Math.sqrt(Math.pow(objectLocation.y - moveTo.y, 2));
		GSAPHelper.to(this.options.objectDom, {
			...moveTo,
			duration: distance / 30,
			onComplete: () => {
				StorePublic.ctx.store.currentEdge = edge;
				StorePublic.ctx.updateState(StorePublic.ctx);
			},
		});
	}
}
