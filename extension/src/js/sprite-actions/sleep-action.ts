import { CharacterAnimation } from "../player-engine";
import { SpriteEngine } from "../sprite-engine";
import { store } from "../store";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class SleepAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_SLEEP;
	public minExecutionTime: number = 60;
	public maxExecutionTime: number = 60;
	private isSleepAnimationExecuted: boolean = false;
	public async selectionPrecondition() {
		return SpriteEngine.gameStatus.sprite.isSleeping;
	}
	public async start() {
		if (!this.isSleepAnimationExecuted) {
			this.isSleepAnimationExecuted = true;
			// TODO: create a new animation to prepare the cal for sleeping
			store.playerEngine.playAnimation(CharacterAnimation.Sleeping, {
				loop: true,
			});
		}
	}
	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}
}
