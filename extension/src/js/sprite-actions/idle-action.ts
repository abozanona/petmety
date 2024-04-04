import { CharacterAnimation } from "../player-engine";
import { SpriteEngine } from "../sprite-engine";
import { store } from "../store";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class IdleAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_IDLE;
	public minExecutionTime: number = 5;
	public maxExecutionTime: number = 5;
	public selectionPrecondition() {
		return !SpriteEngine.gameStatus.sprite.isSleeping;
	}
	public async start() {
		store.playerEngine.playAnimation(CharacterAnimation.Idle, {
			loop: true,
		});
	}
	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}
}
