export enum ActionPriority {
	MAX_ACTION_PRIORITY = Infinity,
	ACTION_IDLE = 100,
	ACTION_JUMP = 101,
}

export abstract class SpriteAction {
	public abstract priority: ActionPriority;
	public abstract minExecutionTime: number;
	public abstract maxExecutionTime: number;
	public isCanceled: boolean;
	public abstract selectionPrecondition(): boolean;
	public abstract start(): Promise<void>;
	public abstract cancel(): Promise<void>;
	public finishedCallBack(action: SpriteAction) {}
}
