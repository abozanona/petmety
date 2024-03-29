export enum ActionPriority {
	MAX_ACTION_PRIORITY = Infinity,
	ACTION_IDLE = 100,
	ACTION_JUMP = 101,
	ACTION_JUMP_RECURSIVE_TO_POINT_IN_VIEW = 500,
}

export abstract class SpriteAction {
	public abstract priority: ActionPriority;
	public abstract minExecutionTime: number;
	public abstract maxExecutionTime: number;
	public isCanceled: boolean;
	public abstract selectionPrecondition(): boolean;
	public abstract start(): Promise<void>;
	// TODO: Force linting error if children are not calling super
	public async cancel(): Promise<void> {
		this.isCanceled = true;
		if (this.cancelCallbackFn) {
			this.cancelCallbackFn();
		}
	}
	cancelCallbackFn: () => void;
	public cancelCallback(cancelCallbackFn: () => void) {
		this.cancelCallbackFn = cancelCallbackFn;
	}
}
