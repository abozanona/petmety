import { CharacterAnimation } from "../player-engine";
import { store } from "../engines";
import { ActionPriority, SpriteAction } from "./sprite-action";
import { StorePublic } from "../../app/app-context/store-context";

export class SleepAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_SLEEP;
	public minExecutionTime: number = 60;
	public maxExecutionTime: number = 60;
	private isSleepAnimationExecuted: boolean = false;
	public async selectionPrecondition() {
		return StorePublic.ctx.store.storage.sprite.isSleeping;
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
