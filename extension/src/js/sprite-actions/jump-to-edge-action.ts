import { StorePublic } from "../../app/app-context/store-context";
import { RectType } from "../edge-detector";
import { store } from "../engines";
import { UtilsEngine } from "../utils/utils";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class JumpToEdgeAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_JUMP_TO_EDGE;
	public minExecutionTime: number = 30;
	public maxExecutionTime: number = 30;
	public async selectionPrecondition() {
		return !StorePublic.ctx.store.storage.sprite.isSleeping;
	}
	public async start() {
		const edges = store.edgeDetector.topVisibleEdges.filter((edge) => edge.rectType !== RectType.WINDOW);
		const edge = edges[Math.floor(Math.random() * edges.length)];
		store.animationEngine.singleJumpToPoint({
			x: UtilsEngine.numberBetweenTwoNumbers(edge.start.x, edge.end.x),
			y: edge.start.y,
		});
	}
	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}
}
