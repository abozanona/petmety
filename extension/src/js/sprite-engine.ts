import { Edge } from "./edge-detector";
import { store } from "./store";
import { Constants } from "./utils/constants";
import { GSAPHelper } from "./utils/gsap-helper";

type SpriteEngineOptions = {};

export enum SpriteDirection {
	LEFT,
	RIGHT,
}

type SpriteStatus = {
	isSleeping: boolean;
	playerLevel: number;
	playerLevelProgress: number;
	happinessLevel: number;
	satedLevel: number;
	energyLevel: number;
	currentEdge: Edge | undefined;
};

export enum CustomAction {
	PETTING,
	DRAGGING,
}

export class SpriteEngine {
	private defaultOptions: SpriteEngineOptions = {};
	private options: SpriteEngineOptions;

	public spriteStatus: SpriteStatus = {
		isSleeping: false,
		playerLevel: 5,
		playerLevelProgress: 13,
		happinessLevel: 15,
		satedLevel: 27,
		energyLevel: 61,
		currentEdge: undefined,
	};

	private _customActionRunning: CustomAction | undefined = undefined;
	public get customActionRunning(): CustomAction | undefined {
		return this._customActionRunning;
	}
	public set customActionRunning(value: CustomAction | undefined) {
		if (value !== undefined) {
			if (store.spriteActionsEngine.currentAction) {
				// We should not cancel it since it may start more actions
				store.spriteActionsEngine.currentAction = undefined;
				GSAPHelper.killCurrentAnimation();
			}
		}
		this._customActionRunning = value;
	}

	private _direction: SpriteDirection = SpriteDirection.LEFT;
	public get direction(): SpriteDirection {
		return this._direction;
	}
	public set direction(newValue: SpriteDirection) {
		const spriteElement = document.querySelector(Constants.stageSelector);
		if (!spriteElement) {
			return;
		}
		if (newValue !== this._direction) {
			if (newValue === SpriteDirection.LEFT) {
				spriteElement.classList.add("vp-direction-left");
				spriteElement.classList.remove("vp-direction-right");
			} else {
				spriteElement.classList.remove("vp-direction-left");
				spriteElement.classList.add("vp-direction-right");
			}
		}
		this._direction = newValue;
	}

	constructor(opt: Partial<SpriteEngineOptions>) {
		this.options = { ...this.defaultOptions, ...opt };
	}
}
