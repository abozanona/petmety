import { Edge } from "./edge-detector";
import { SpawnableObject } from "./spawnable-objects/spawnable-object";
import { store } from "./store";
import { Constants } from "./utils/constants";
import { GSAPHelper } from "./utils/gsap-helper";
import { SettingName, UtilsEngine } from "./utils/utils";

type SpriteEngineOptions = {};

export enum SpriteDirection {
	LEFT,
	RIGHT,
}

export type GameStatus = {
	sprite: {
		isSleeping: boolean;
		happinessLevel: {
			value: number;
			lastUpdated: Date;
		};
		satedLevel: {
			value: number;
			lastUpdated: Date;
		};
		energyLevel: {
			value: number;
			lastUpdated: Date;
		};
		currentEdge: Edge | undefined;
	};
	player: {
		level: number;
		levelProgress: number;
	};
	spawnedObjects: SpawnableObject[];
};

export const defaultGameStatus: GameStatus = {
	sprite: {
		isSleeping: false,
		happinessLevel: {
			value: 100,
			lastUpdated: new Date(),
		},
		satedLevel: {
			value: 100,
			lastUpdated: new Date(),
		},
		energyLevel: {
			value: 100,
			lastUpdated: new Date(),
		},
		currentEdge: undefined,
	},
	player: {
		level: 5,
		levelProgress: 13,
	},
	spawnedObjects: [],
};

export enum CustomAction {
	PETTING,
	DRAGGING,
}

export class SpriteEngine {
	private defaultOptions: SpriteEngineOptions = {};
	private options: SpriteEngineOptions;

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

	public async updateSpriteStatus() {
		await SpriteEngine.updateGameStatus(SpriteEngine.gameStatus);
		// read curent sprite status. If no status exists, get default one
	}

	public static gameStatus: GameStatus = defaultGameStatus;

	public static updateGameStatus(gameStatus: GameStatus): Promise<void> {
		return UtilsEngine.setSettings(SettingName.GAME_STATUS, gameStatus);
	}

	public static async getGameStatus(): Promise<GameStatus> {
		SpriteEngine.gameStatus = await UtilsEngine.getSettings(SettingName.GAME_STATUS, defaultGameStatus);
		return SpriteEngine.gameStatus;
	}

	constructor(opt: Partial<SpriteEngineOptions>) {
		this.options = { ...this.defaultOptions, ...opt };
		SpriteEngine.getGameStatus().then((gameStatus: GameStatus) => {
			SpriteEngine.gameStatus = gameStatus;
		});
	}
}
