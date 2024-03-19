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
	private elementId: string;
	private playerController: any;
	private timeoutID: NodeJS.Timeout;

	constructor(selector: IdSelector) {
		this.elementId = selector.substring(1);

		this.playerController = new spine.SpinePlayer(this.elementId, {
			jsonUrl: chrome.runtime.getURL("/assets/cat.json"),
			atlasUrl: chrome.runtime.getURL("/assets/cat.atlas"),
			animation: CharacterAnimation.Idle,
			showControls: false,
			alpha: true,
		});
	}

	playAnimation(
		characterAnimation: CharacterAnimation,
		options: AnimationOptions
	) {
		if (typeof this.timeoutID === "number") {
			clearTimeout(this.timeoutID);
		}

		this.playerController.setAnimation(characterAnimation, options.loop);
		if (!options.loop) {
			this.timeoutID = setTimeout(() => {
				this.playerController.setAnimation(
					CharacterAnimation.Idle,
					true
				);
			}, 3000);
		}
	}
}
