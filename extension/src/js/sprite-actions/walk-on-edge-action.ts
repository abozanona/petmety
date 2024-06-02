import { Point2d } from "../edge-detector";
import { store } from "../engines";
import { ActionPriority, SpriteAction } from "./sprite-action";
import { UtilsEngine } from "../utils/utils";
import { CharacterAnimation } from "../player-engine";
import { StorePublic } from "../../app/app-context/store-context";

export class WalkOnEdgeAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_WALK_ON_EDGE;
	public minExecutionTime: number = 60;
	public maxExecutionTime: number = 60;
	public async selectionPrecondition() {
		return !StorePublic.ctx.store.storage.sprite.isSleeping && StorePublic.ctx.store.currentEdge != undefined;
	}
	public async start() {
		if (!StorePublic.ctx.store.currentEdge) {
			await this.cancel();
			return;
		}
		// Walk to a point in the same y axis, no less that 50 units away, pick any random point in the x axis along the edge
		const minX = StorePublic.ctx.store.currentEdge.start.x + 50,
			maxX = StorePublic.ctx.store.currentEdge.end.x - 50;
		let x: number;
		if (minX > maxX) {
			x = minX;
		} else {
			// get point between minX & maxX
			x = UtilsEngine.numberBetweenTwoNumbers(minX, maxX);
		}
		const destinationPoint: Point2d = {
			x: x,
			y: StorePublic.ctx.store.currentEdge.start.y,
		};

		await store.animationEngine.walkToPoint(destinationPoint);
		await this.cancel();
	}
	public async cancel() {
		store.playerEngine.playAnimation(CharacterAnimation.Idle, { loop: true });
		super.cancel();
	}

	constructor() {
		super();
	}
}
