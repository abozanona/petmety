import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import * as pixiUnsaveEvalFnPatch from "@pixi/unsafe-eval";
import { logger } from "./utils/logger";
import { Constants } from "./utils/constants";
import { UtilsEngine } from "./utils/utils";
import { store } from "./engines";
import { debounce, throttle } from "throttle-debounce";
import { CustomAction } from "./sprite-engine";

declare const spine: any;

export enum CharacterAnimation {
	Idle = "Idle",
	Eating = "Eating",
	Jump = "Jump",
	Sleeping = "Sleeping",
	Walk = "Walk",
	Walk2 = "Walk2",
}

type AnimationOptions = {
	loop: boolean;
};

export class PlayerEngine {
	private timeoutID: NodeJS.Timeout | undefined;
	private pixiApp: PIXI.Application;
	private loadedResources: PIXI.utils.Dict<PIXI.LoaderResource> | undefined;
	private spriteController?: Spine;

	private mouseMovementCounter: number = 0;
	private mouseMovementCallback() {
		this.mouseMovementCounter++;
		if (this.mouseMovementCounter > 4 && this.mouseMovementCounter % 4 == 0) {
			store.spriteEngine.customActionRunning = CustomAction.PETTING;
			store.playerEngine.showHearts();
		}
	}
	private mouseMovementOffCallback() {
		this.mouseMovementCounter = 0;
		store.spriteEngine.customActionRunning = undefined;
	}
	private addAffectionListner() {
		const mouseMovementCallbackThrottle = throttle(1000, this.mouseMovementCallback.bind(this));
		const mouseMovementOffCallback = debounce(2000, this.mouseMovementOffCallback.bind(this));
		const mouseMoveCallback = () => {
			if (store.spriteEngine.customActionRunning !== undefined && store.spriteEngine.customActionRunning !== CustomAction.PETTING) {
				return;
			}
			mouseMovementCallbackThrottle();
			mouseMovementOffCallback();
		};
		// TODO: Play affection animation if not already been played
		this.pixiApp.stage.on("mouseover", mouseMoveCallback.bind(this));
	}

	constructor() {
		pixiUnsaveEvalFnPatch.install(PIXI);

		this.pixiApp = new PIXI.Application({
			backgroundColor: 0x000000,
			width: 200,
			height: 140,
			backgroundAlpha: 0,
		});
		this.pixiApp.stage.interactive = true;
		document.querySelector(Constants.stageSelector)!.appendChild(this.pixiApp.view);

		const loader = this.pixiApp.loader;
		loader.add("sprite", chrome.runtime.getURL("/assets/cat.json"));

		loader.load((loader, res) => {
			this.loadedResources = res;
			if (!this.loadedResources.sprite.spineData) {
				logger.error("Can't load spine file");
				return;
			}
			this.spriteController = new Spine(this.loadedResources.sprite.spineData);
			// spineboy
			this.spriteController.scale.set(0.35);
			this.spriteController.state.setAnimation(0, "Idle", true);
			this.spriteController.x = 0;
			this.spriteController.y = 0;

			this.spriteController.position.set(80, 140);

			this.pixiApp.stage.addChild(this.spriteController);
		});

		this.addAffectionListner();
	}

	playAnimation(characterAnimation: CharacterAnimation, options: AnimationOptions) {
		// Wait until spine is rendered
		if (!this.spriteController) {
			return;
		}
		if (typeof this.timeoutID === "number") {
			clearTimeout(this.timeoutID);
		}

		this.spriteController.state.setAnimation(0, characterAnimation, options.loop);
		if (!options.loop) {
			this.timeoutID = setTimeout(() => {
				this.spriteController?.state.setAnimation(0, CharacterAnimation.Idle, true);
			}, 3000);
		}
	}

	async showHearts() {
		if (!this.loadedResources) {
			return;
		}
		const hearts: PIXI.Sprite[] = [];
		const heartSpeed = 2;
		let heartsCount = 10;
		const gameLoop = (delta: number) => {
			for (let i = 0; i < hearts.length; i++) {
				hearts[i].y -= heartSpeed * delta;
				if (hearts[i].position.y < 0) {
					this.pixiApp.stage.removeChild(hearts[i]);
					hearts.splice(i, 1);
				}
			}
			if (!hearts.length && !heartsCount) {
				this.pixiApp.ticker.remove(gameLoop);
			}
		};

		this.pixiApp.ticker.add(gameLoop);
		for (let i = heartsCount; i > 0; i--) {
			const heart = PIXI.Sprite.from(chrome.runtime.getURL("/images/objects/heart.png"));
			heart.scale.set(0.02);
			heart.anchor;
			heart.x = UtilsEngine.numberBetweenTwoNumbers(0, this.pixiApp.stage.width);
			heart.y = UtilsEngine.numberBetweenTwoNumbers(100, 140);
			this.pixiApp.stage.addChild(heart);
			hearts.push(heart);
			await UtilsEngine.wait(500 * Math.random());
		}
	}
}
