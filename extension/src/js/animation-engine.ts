import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { store } from "./store";
import { Point2d } from "./edge-detector";
import { UtilsEngine } from "./utils/utils";
import { Parser } from "expr-eval";
import { SpriteDirection } from "./sprite-engine";
import { CharacterAnimation } from "./player-engine";
import { logger } from "./utils/logger";

type AnimationEngineOptions = {
	selector?: string;
	debugMode?: boolean;
};

export class AnimationEngine {
	private defaultOptions: AnimationEngineOptions = {
		debugMode: false,
		selector: "#vp-player-container",
	};
	private options: AnimationEngineOptions;
	constructor(opt: AnimationEngineOptions) {
		this.options = { ...this.defaultOptions, ...opt };
		this.init();
	}
	private init() {
		gsap.registerPlugin(Draggable, MotionPathPlugin);

		Draggable.create(this.options.selector, {
			type: "x,y",
			dragClickables: false,
			onDragEnd: this.dropToEdgeAfterDragEnds.bind(this), // On dragging the pet, drop vertically
		});
	}

	dropToEdgeAfterDragEnds(dragEndEvent: any) {
		logger.info("dropToEdgeAfterDragEnds");
		const spriteRect = document.querySelector(this.options.selector).getBoundingClientRect();

		const edges = store.edgeDetector.topVisibleEdges.filter(
			(el) => el.start.y > dragEndEvent.clientY + spriteRect.height && el.start.x <= dragEndEvent.clientX && el.end.x >= dragEndEvent.clientX
		); // enges below the sprite

		// Sort based on priority randomly, get edge with highest priority
		edges.sort((a, b) => {
			return Math.random() * 10 * b.rectType * b.rectType - Math.random() * 10 * a.rectType * a.rectType;
		});
		const edge = edges[0];

		const moveTo = {
			left: spriteRect.x + window.scrollX, // spriteX + scrollX
			top: edge.start.y + window.scrollY - spriteRect.height, //  edgeY + scrollY - spriteHeight
			x: 0,
			y: 0,
		};
		// drop down with a constant speed
		const distance: number = Math.sqrt(Math.pow(dragEndEvent.clientY - moveTo.y, 2));
		gsap.to(this.options.selector, { ...moveTo, duration: distance / 30 });
	}

	async singleJumpToPoint(destinationPoint: Point2d) {
		logger.info("singleJumpToPoint");
		const spriteRect = document.querySelector(this.options.selector).getBoundingClientRect();
		const startPoint: Point2d = {
			x: spriteRect.x,
			y: spriteRect.y + spriteRect.height,
		};

		let animationsTemplates = await UtilsEngine.loadTemplate("/templates/animations.template.html");
		animationsTemplates = animationsTemplates.replace(/{(.+?)}/g, (match) => {
			match = match.replace("{", "").replace("}", "");
			const parser = new Parser();
			const expr = parser.parse(match);
			return expr.evaluate({
				WIDTH: Math.abs(destinationPoint.x - startPoint.x),
				HEIGHT: Math.abs(destinationPoint.y - startPoint.y),
			});
		});
		const elem = document.createElement("div");
		elem.innerHTML = animationsTemplates;

		// TOTO: don't jump if diffX<100 || diffY<100; walk instead

		// Detect correct jump animation
		let animation = "jumpNorthWest";
		if (destinationPoint.x <= startPoint.x && destinationPoint.y <= startPoint.y) {
			store.spriteEngine.direction = SpriteDirection.LEFT;
			animation = "jumpNorthWest";
		} else if (destinationPoint.x >= startPoint.x && destinationPoint.y <= startPoint.y) {
			store.spriteEngine.direction = SpriteDirection.RIGHT;
			animation = "jumpNorthEast";
		} else if (destinationPoint.x <= startPoint.x && destinationPoint.y >= startPoint.y) {
			store.spriteEngine.direction = SpriteDirection.LEFT;
			animation = "jumpSouthWest";
		} else if (destinationPoint.x >= startPoint.x && destinationPoint.y >= startPoint.y) {
			store.spriteEngine.direction = SpriteDirection.RIGHT;
			animation = "jumpSouthEast";
		}

		const animationSvg: HTMLElement = elem.querySelector(".vp-" + animation);
		const pathId = "path-" + crypto.randomUUID();
		animationSvg.querySelector("path").id = pathId;
		if (this.options.debugMode) {
			animationSvg.classList.add("vp-animation-debug");
		}
		document.body.appendChild(animationSvg);
		animationSvg.style.position = "absolute";
		animationSvg.style.width = Math.abs(destinationPoint.x - startPoint.x) + "px";
		animationSvg.style.height = Math.abs(destinationPoint.y - startPoint.y) + "px";
		animationSvg.style.left = window.scrollX + Math.min(destinationPoint.x, startPoint.x) + "px";
		animationSvg.style.top = window.scrollY + Math.min(destinationPoint.y, startPoint.y) + "px";
		if (this.options.debugMode) {
			animationSvg.style.border = "solid 1px red";
			animationSvg.style.zIndex = "999999999";
		} else {
			animationSvg.style.visibility = "hidden";
		}

		const animationDuration = 2;

		// Move to edge
		await new Promise<void>((resolve) => {
			gsap.to(this.options.selector, {
				duration: animationDuration,
				ease: "power1.inOut",
				motionPath: {
					path: "#" + pathId,
					align: "#" + pathId,
					alignOrigin: [0, 1],
				},
				onComplete: () => resolve(),
			});
		});
		animationSvg.remove();
	}

	async moveCloserToPoint(destinationPoint: Point2d) {
		logger.info("moveCloserToPoint");
		const maxJumpDistance = 200;
		const negligtableDistance = 20;
		// How to select next edge to jump to?
		// 1. Should be within the max jump distance. If can't find one, then select the next closest edge to the sprite
		// 2. Should be closer than other edges to the destination point
		const spriteRect = document.querySelector(this.options.selector).getBoundingClientRect();
		const spriteLocation: Point2d = {
			x: spriteRect.x,
			y: spriteRect.y + spriteRect.height,
		};

		const horizontalEdges = store.edgeDetector.horizontalEdges.filter((edge) => Math.abs(edge.start.y - spriteLocation.y) > negligtableDistance);
		// Sort based on the closest to destination
		horizontalEdges.sort((edge) => destinationPoint.y - edge.start.y);

		// Filter by max jump distance
		const edgesWithinJumpDistance = horizontalEdges.filter((edge) => Math.abs(spriteLocation.y - edge.start.y) <= maxJumpDistance);
		if (edgesWithinJumpDistance.length) {
			await this.singleJumpToPoint(edgesWithinJumpDistance[0].start);
		} else if (horizontalEdges.length) {
			await this.singleJumpToPoint(horizontalEdges[horizontalEdges.length - 1].start);
		} else {
			await this.singleJumpToPoint(destinationPoint);
		}
	}

	async walkToPoint(destinationPoint: Point2d) {
		logger.info("walkToPoint");
		const spriteRect = document.querySelector(this.options.selector).getBoundingClientRect();
		const spriteLocation: Point2d = {
			x: spriteRect.x,
			y: spriteRect.y + spriteRect.height,
		};

		// walk with a constant speed
		const distance: number = Math.sqrt(Math.pow(spriteLocation.x - destinationPoint.x, 2) + Math.pow(spriteLocation.y - destinationPoint.y, 2));
		store.playerEngine.playAnimation(CharacterAnimation.Walk, { loop: true });
		if (destinationPoint.x < spriteLocation.x) {
			store.spriteEngine.direction = SpriteDirection.LEFT;
		} else {
			store.spriteEngine.direction = SpriteDirection.RIGHT;
		}
		const moveTo = {
			left: destinationPoint.x + spriteRect.x - (store.spriteEngine.direction = SpriteDirection.RIGHT ? spriteRect.width : 0), // destinationPointX + spriteX - spriteWidth
			top: destinationPoint.y + window.scrollY - spriteRect.height, //  destinationPointY + scrollY - spriteHeight
			x: 0,
			y: 0,
		};
		await new Promise<void>((resolve) => {
			gsap.to(this.options.selector, {
				...moveTo,
				duration: distance / 100,
				onComplete: () => resolve(),
			});
		});
		store.playerEngine.playAnimation(CharacterAnimation.Idle, { loop: true });
	}
}
