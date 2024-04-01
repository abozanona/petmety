import { RectType } from "./edge-detector";
import { ObjectInstantiatorEngine, ObjectInstantiatorType } from "./objects-instantiator-engine";
import { CharacterAnimation } from "./player-engine";
import { store } from "./store";
import { UtilsEngine } from "./utils/utils";

export class MenuEngine {
	constructor() {
		// Toggle menu button
		document.querySelector("#vp-sprite-menu-toggle")!.addEventListener("click", () => {
			document.querySelector(".vp-sprite-menu-list")!.classList.remove("vp-hidden");
			document.querySelector("#vp-sprite-menu-toggle")!.classList.add("vp-hidden");
		});

		document.querySelector("#vp-btn-anim-eating")!.addEventListener("click", () => {
			store.playerEngine.playAnimation(CharacterAnimation.Eating, {
				loop: true,
			});
		});

		document.querySelector("#vp-btn-anim-sleeping")!.addEventListener("click", () => {
			store.spriteEngine.spriteStatus.isSleeping = !store.spriteEngine.spriteStatus.isSleeping;
		});

		document.querySelector("#vp-btn-create-food")!.addEventListener("click", () => {
			ObjectInstantiatorEngine.initiateObject({
				type: ObjectInstantiatorType.FOOD,
				imagePath: UtilsEngine.browser.runtime.getURL("/images/objects/food.png"),
				width: 50,
				height: 50,
				edgeTypes: [RectType.DISTINGUISHABLE, RectType.WINDOW],
			});
		});

		document.querySelector("#vp-btn-show-hearts")!.addEventListener("click", () => {
			store.playerEngine.showHearts();
		});
	}
}
