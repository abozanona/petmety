import { Point2d } from "../edge-detector";
import { store } from "../store";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class WalkOnEdgeAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_WALK_ON_EDGE;
	public minExecutionTime: number = 60;
	public maxExecutionTime: number = 60;
	public selectionPrecondition() {
		return !store.spriteEngine.spriteStatus.isSleeping && store.spriteEngine.spriteStatus.currentEdge != undefined;
	}
	public async start() {
		if (!store.spriteEngine.spriteStatus.currentEdge) {
			await this.cancel();
			return;
		}
		// Walk to a point in the same y axis, no less that 50 units away, pick any random point in the x axis along the edge
		const minX = store.spriteEngine.spriteStatus.currentEdge.start.x + 50,
			maxX = store.spriteEngine.spriteStatus.currentEdge.end.x - 50;
		let x: number;
		if (minX > maxX) {
			x = minX;
		} else {
			// get point between minX & maxX
			x = Math.floor(Math.random() * (maxX - minX + 1) + minX);
		}
		const destinationPoint: Point2d = {
			x: x,
			y: store.spriteEngine.spriteStatus.currentEdge.start.y,
		};

		await store.animationEngine.walkToPoint(destinationPoint);
		await this.cancel();
	}
	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}
}
