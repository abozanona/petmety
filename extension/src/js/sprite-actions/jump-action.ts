import { CharacterAnimation } from "../player-engine";
import { store } from "../store";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class JumpAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_JUMP;
	public minExecutionTime: number = 5;
	public maxExecutionTime: number = 5;
	public selectionPrecondition() {
		return !store.spriteEngine.spriteStatus.isSleeping;
	}
	public async start() {
		store.playerEngine.playAnimation(CharacterAnimation.Jump, {
			loop: false,
		});
	}
	public async cancel() {
		this.isCanceled = true;
	}

	constructor() {
		super();
	}
}
