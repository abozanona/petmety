import { ICompare, PriorityQueue } from "@datastructures-js/priority-queue";
import { logger } from "./utils/logger";
import { IdleAction, JumpAction, SleepAction, SpriteAction, JumpRecursiveToPointInViewAction, WalkOnEdgeAction, JumpToEdgeAction, EatFoodAction, ScatterLettersAction } from "./sprite-actions";
import { throttle } from "throttle-debounce";
import { store } from "./engines";

const allActions: SpriteAction[] = [];

// TODO: Change how this works
const fillAvailableActions = () => {
	allActions.push(new IdleAction());
	allActions.push(new JumpAction());
	allActions.push(new JumpRecursiveToPointInViewAction());
	allActions.push(new SleepAction());
	allActions.push(new WalkOnEdgeAction());
	allActions.push(new JumpToEdgeAction());
	allActions.push(new EatFoodAction());
	allActions.push(new ScatterLettersAction());
};

export class SpriteActionsEngine {
	actionsArray: SpriteAction[] = [];

	compareActions: ICompare<SpriteAction> = (a: SpriteAction, b: SpriteAction) => a.priority - b.priority;

	pq: PriorityQueue<SpriteAction> = PriorityQueue.fromArray<SpriteAction>(this.actionsArray, this.compareActions);

	MAX_QUEUED_ACTIONS: number = 5;

	currentAction: SpriteAction | undefined;

	calcelationTimeout: NodeJS.Timeout | undefined;

	get isActionRunning(): boolean {
		return !!this.calcelationTimeout;
	}

	private throttleTick: throttle<() => Promise<void>>;

	constructor() {
		this.throttleTick = throttle(1000, this.tick);
		setInterval(this.throttleTick.bind(this), 1000);
		fillAvailableActions();
	}

	async tick() {
		await this.fillNextAction();
		if (!this.isActionRunning && store.spriteEngine.customActionRunning === undefined) {
			await this.executeNextAction();
		}
	}

	async fillNextAction() {
		if (this.pq.size() >= this.MAX_QUEUED_ACTIONS) {
			return;
		}
		// TODO: should add more randomness
		const nextAction: SpriteAction = allActions
			.filter(async (action) => await action.selectionPrecondition())
			// Sort based on priority
			.sort((a1, a2) => {
				// Don't add already existing actions
				if (this.actionsArray.find((action) => a1.constructor === action.constructor)) {
					return 1;
				}
				// Sort based on priority
				return a2.priority - a1.priority;
			})
			// Get all actions with same priority
			.reduce((res: SpriteAction[], action: SpriteAction) => {
				if (!res.length || parseInt((action.priority / 100).toString()) === parseInt((res[0].priority / 100).toString())) {
					res.push(action);
				}
				return res;
			}, [])
			// Randomize elements
			.sort((_, __) => Math.random() - Math.random())[0];
		if (!nextAction) {
			return;
		}
		this.pq.enqueue(nextAction);
	}

	async executeNextAction() {
		if (this.calcelationTimeout) {
			clearTimeout(this.calcelationTimeout);
			this.calcelationTimeout = undefined;
		}
		if (this.currentAction) {
			if (!this.currentAction.isCanceled) {
				await this.currentAction.cancel();
			}
		}
		if (this.pq.isEmpty()) {
			return;
		}
		const action = this.pq.dequeue();
		if (!(await action.selectionPrecondition())) {
			await this.fillNextAction();
			// TODO: We should have a default action to run here
			return;
		}
		this.currentAction = action;
		const calcelationTimeoutCallback = async () => {
			clearTimeout(this.calcelationTimeout);
			this.calcelationTimeout = undefined;
			if (this.currentAction) {
				if (!this.currentAction.isCanceled) {
					await this.currentAction.cancel();
				}
				// Reset action cancel status ofr future runs
				this.currentAction.isCanceled = false;
			}
			this.throttleTick();
		};
		this.calcelationTimeout = setTimeout(calcelationTimeoutCallback.bind(this), this.currentAction.maxExecutionTime * 1000);

		this.currentAction.cancelCallback(calcelationTimeoutCallback.bind(this));
		await this.currentAction.start();
		logger.info("Executing action", this.currentAction.constructor.name);
	}
}
