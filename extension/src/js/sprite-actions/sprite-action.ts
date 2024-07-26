export enum ActionPriority {
	MAX_ACTION_PRIORITY = Infinity,
	ACTION_IDLE = 100,
	ACTION_JUMP = 101,
	ACTION_SLEEP = 102,
	ACTION_WALK_ON_EDGE = 103,
	ACTION_JUMP_TO_EDGE = 104,
	ACTION_SCATTER_LETTERS = 105,
	ACTION_JUMP_RECURSIVE_TO_POINT_IN_VIEW = 500,
	ACTION_EAT_FOOD = 1000,
}

export abstract class SpriteAction {
	public abstract priority: ActionPriority;
	public abstract minExecutionTime: number;
	public abstract maxExecutionTime: number;
	public isCanceled: boolean = false;
	public abstract selectionPrecondition(): Promise<boolean>;
	public abstract start(): Promise<void>;
	// TODO: Force linting error if children are not calling super
	public async cancel(): Promise<void> {
		this.isCanceled = true;
		if (this.cancelCallbackFn) {
			this.cancelCallbackFn();
		}
	}
	cancelCallbackFn: (() => void) | undefined;
	public cancelCallback(cancelCallbackFn: () => void) {
		this.cancelCallbackFn = cancelCallbackFn;
	}
}
