import { EdgeDetector, Point2d } from "./edge-detector";
import { store } from "./store";

type SpriteEngineOptions = {
	selector?: string;
};

export class SpriteEngine {
	private defaultOptions: SpriteEngineOptions = {
		selector: "#vp-player-container",
	};
	private options: SpriteEngineOptions;

	private isJumbingToViewport: boolean;

	constructor(opt: SpriteEngineOptions) {
		this.options = { ...this.defaultOptions, ...opt };
		this.isJumbingToViewport = false;
		setInterval(this.checkSpritePosition.bind(this), 5000);
	}

	async checkSpritePosition() {
		if (this.isJumbingToViewport) {
			return;
		}
		const spriteRect = document
			.querySelector(this.options.selector)
			.getBoundingClientRect();
		if (
			EdgeDetector.isPointInViewPort({ x: spriteRect.x, y: spriteRect.y })
		) {
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
		const edge =
			visibleEdges[Math.floor(Math.random() * visibleEdges.length)];
		return edge.start;
	}
}
