import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import * as pixiUnsaveEvalFnPatch from "@pixi/unsafe-eval";

declare const spine: any;

type IdSelector = `#${string}`;

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
	private selector: IdSelector;
	private timeoutID: NodeJS.Timeout;
	spriteController: Spine;

	constructor(selector: IdSelector) {
		pixiUnsaveEvalFnPatch.install(PIXI);

		this.selector = selector;

		const app = new PIXI.Application({
			backgroundColor: 0x000000,
			width: 200,
			height: 140,
			backgroundAlpha: 0,
		});
		app.stage.interactive = true;
		document.querySelector(this.selector).appendChild(app.view);

		const loader = app.loader.add("sprite", chrome.runtime.getURL("/assets/cat.json"));

		loader.load((loader, res) => {
			this.spriteController = new Spine(res.sprite.spineData);
			// spineboy
			this.spriteController.scale.set(0.35);
			this.spriteController.state.setAnimation(0, "Idle", true);
			this.spriteController.x = 0;
			this.spriteController.y = 0;

			this.spriteController.position.set(80, 140);

			app.stage.addChild(this.spriteController);
		});
	}

	playAnimation(characterAnimation: CharacterAnimation, options: AnimationOptions) {
		if (typeof this.timeoutID === "number") {
			clearTimeout(this.timeoutID);
		}

		this.spriteController.state.setAnimation(0, characterAnimation, options.loop);
		if (!options.loop) {
			this.timeoutID = setTimeout(() => {
				this.spriteController.state.setAnimation(0, CharacterAnimation.Idle, true);
			}, 3000);
		}
	}
}
