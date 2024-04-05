import { Point2d } from "../edge-detector";
import { store } from "../store";
import { ActionPriority, SpriteAction } from "./sprite-action";
import { UtilsEngine } from "../utils/utils";
import { SpriteEngine } from "../sprite-engine";
import { CharacterAnimation } from "../player-engine";

export class WalkOnEdgeAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_WALK_ON_EDGE;
	public minExecutionTime: number = 60;
	public maxExecutionTime: number = 60;
	public selectionPrecondition() {
		return !SpriteEngine.gameStatus.sprite.isSleeping && SpriteEngine.gameStatus.sprite.currentEdge != undefined;
	}
	public async start() {
		if (!SpriteEngine.gameStatus.sprite.currentEdge) {
			await this.cancel();
			return;
		}
		// Walk to a point in the same y axis, no less that 50 units away, pick any random point in the x axis along the edge
		const minX = SpriteEngine.gameStatus.sprite.currentEdge.start.x + 50,
			maxX = SpriteEngine.gameStatus.sprite.currentEdge.end.x - 50;
		let x: number;
		if (minX > maxX) {
			x = minX;
		} else {
			// get point between minX & maxX
			x = UtilsEngine.numberBetweenTwoNumbers(minX, maxX);
		}
		const destinationPoint: Point2d = {
			x: x,
			y: SpriteEngine.gameStatus.sprite.currentEdge.start.y,
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
