import { CharacterAnimation } from "../player-engine";
import { store } from "../engines";
import { ActionPriority, SpriteAction } from "./sprite-action";
import { StorePublic } from "../../app/app-context/store-context";

export class JumpAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_JUMP;
	public minExecutionTime: number = 5;
	public maxExecutionTime: number = 5;
	public async selectionPrecondition() {
		return !StorePublic.ctx.store.storage.sprite.isSleeping;
	}
	public async start() {
		store.playerEngine.playAnimation(CharacterAnimation.Jump, {
			loop: false,
		});
	}
	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}
}
