import { SpriteAction } from "./sprite-actions/sprite-action";
import { ICompare, PriorityQueue } from "@datastructures-js/priority-queue";
import { IdleAction } from "./sprite-actions/idle-action";
import { JumpAction } from "./sprite-actions/jump-action";
import { logger } from "./utils/logger";
import { jumpRecursiveToPointInViewAction } from "./sprite-actions/jump-recursive-to-point-in-view-action";

const allActions: SpriteAction[] = [];

// TODO: Change how this works
const fillAvailableActions = () => {
	allActions.push(new IdleAction());
	allActions.push(new JumpAction());
	allActions.push(new jumpRecursiveToPointInViewAction());
};

export class SpriteActionsEngine {
	actionsArray: SpriteAction[] = [];

	compareActions: ICompare<SpriteAction> = (a: SpriteAction, b: SpriteAction) => a.priority - b.priority;

	pq: PriorityQueue<SpriteAction> = PriorityQueue.fromArray<SpriteAction>(this.actionsArray, this.compareActions);

	MAX_QUEUED_ACTIONS: number = 5;

	currentAction: SpriteAction;

	calcelationTimeout: NodeJS.Timeout;

	get isActionRunning(): boolean {
		return !!this.calcelationTimeout && !this.currentAction?.isCanceled;
	}

	constructor() {
		setInterval(this.tick.bind(this), 1000);
		fillAvailableActions();
	}

	async tick() {
		await this.fillNextAction();
		if (!this.isActionRunning) {
			await this.executeNextAction();
		}
	}

	async fillNextAction() {
		if (this.pq.size() >= this.MAX_QUEUED_ACTIONS) {
			return;
		}
		let actionsList: SpriteAction[] = [];
		// TODO: should add more randomness
		const nextAction: SpriteAction = allActions
			.filter((action) => action.selectionPrecondition())
			// Sort based on priority
			.sort((a1, a2) => {
				// Don't add already existing actions
				if (actionsList.find((action) => a1.constructor === action.constructor)) {
					return -1;
				}
				if (actionsList.find((action) => a2.constructor === action.constructor)) {
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
		logger.info("Queuing action", nextAction);
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
		if (!action.selectionPrecondition()) {
			await this.fillNextAction();
			// TODO: We should have a default action to run here
			return;
		}
		this.currentAction = action;
		const calcelationTimeoutCallback = async () => {
			clearTimeout(this.calcelationTimeout);
			this.calcelationTimeout = undefined;
			await this.currentAction.cancel();
			// Reset action cancel status ofr future runs
			this.currentAction.isCanceled = false;
			this.tick();
		};
		this.calcelationTimeout = setTimeout(calcelationTimeoutCallback.bind(this), this.currentAction.maxExecutionTime * 1000);

		await this.currentAction.start();
		logger.info("Executing action", this.currentAction);
	}
}
