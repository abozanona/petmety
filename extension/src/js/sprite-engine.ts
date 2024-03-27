import { EdgeDetector, Point2d } from "./edge-detector";
import { store } from "./store";

type SpriteEngineOptions = {
	selector?: string;
};

export enum SpriteDirection {
	LEFT,
	RIGHT,
}

type SpriteStatus = {
	isSleeping: boolean;
	playerLevel: number;
	playerLevelProgress: number;
	happinessLevel: number;
	satedLevel: number;
	energyLevel: number;
};

export class SpriteEngine {
	private defaultOptions: SpriteEngineOptions = {
		selector: "#vp-player-container",
	};
	private options: SpriteEngineOptions;

	private isJumbingToViewport: boolean;

	public spriteStatus: SpriteStatus = {
		isSleeping: false,
		playerLevel: 5,
		playerLevelProgress: 13,
		happinessLevel: 15,
		satedLevel: 27,
		energyLevel: 61,
	};

	private _direction: SpriteDirection = SpriteDirection.LEFT;
	public get direction(): SpriteDirection {
		return this._direction;
	}
	public set direction(newValue: SpriteDirection) {
		if (newValue !== this._direction) {
			if (newValue === SpriteDirection.LEFT) {
				document.querySelector(this.options.selector).classList.add("vp-direction-left");
				document.querySelector(this.options.selector).classList.remove("vp-direction-right");
			} else {
				document.querySelector(this.options.selector).classList.remove("vp-direction-left");
				document.querySelector(this.options.selector).classList.add("vp-direction-right");
			}
		}
		this._direction = newValue;
	}

	constructor(opt: SpriteEngineOptions) {
		this.options = { ...this.defaultOptions, ...opt };
		this.isJumbingToViewport = false;
		setInterval(this.checkSpritePosition.bind(this), 5000);
	}

	async checkSpritePosition() {
		if (this.isJumbingToViewport) {
			return;
		}
		const spriteRect = document.querySelector(this.options.selector).getBoundingClientRect();
		if (EdgeDetector.isPointInViewPort({ x: spriteRect.x, y: spriteRect.y })) {
			return;
		}
		// If sprite goes out of range, jump to view port again
		this.isJumbingToViewport = true;
		await store.animationEngine.moveCloserToPoint(this.getVisiblePoint());
		this.isJumbingToViewport = false;
	}

	async jumpRecursivlyToPointInViewport(pointInViewportMovingTo: Point2d) {
		if (!EdgeDetector.isPointInViewPort(pointInViewportMovingTo)) {
			await this.jumpRecursivlyToPointInViewport(this.getVisiblePoint());
			return;
		}
		await store.animationEngine.moveCloserToPoint(pointInViewportMovingTo);
	}

	getVisiblePoint(): Point2d {
		const visibleEdges = store.edgeDetector.horizontalVisibleEdges;
		const edge = visibleEdges[Math.floor(Math.random() * visibleEdges.length)];
		return edge.start;
	}
}
