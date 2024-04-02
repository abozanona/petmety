import { RectType } from "./edge-detector";
import { ObjectInstantiatorEngine, ObjectInstantiatorType } from "./objects-instantiator-engine";
import { CharacterAnimation } from "./player-engine";
import { store } from "./store";
import { UtilsEngine } from "./utils/utils";

export class MenuEngine {
	menuShadowRoot: ShadowRoot | undefined;
	addEvents() {
		if (!this.menuShadowRoot) {
			return;
		}
		// Toggle menu button
		this.menuShadowRoot.querySelector("#vp-sprite-menu-toggle")!.addEventListener("click", () => {
			this.menuShadowRoot!.querySelector(".vp-sprite-menu-list")!.classList.remove("vp-hidden");
			this.menuShadowRoot!.querySelector("#vp-sprite-menu-toggle")!.classList.add("vp-hidden");
		});

		this.menuShadowRoot.querySelector("#vp-btn-anim-eating")!.addEventListener("click", () => {
			store.playerEngine.playAnimation(CharacterAnimation.Eating, {
				loop: true,
			});
		});

		this.menuShadowRoot.querySelector("#vp-btn-anim-sleeping")!.addEventListener("click", () => {
			store.spriteEngine.spriteStatus.isSleeping = !store.spriteEngine.spriteStatus.isSleeping;
		});

		this.menuShadowRoot.querySelector("#vp-btn-create-food")!.addEventListener("click", (event: Event) => {
			ObjectInstantiatorEngine.initiateObject({
				type: ObjectInstantiatorType.FOOD,
				imagePath: UtilsEngine.browser.runtime.getURL("/images/objects/food.png"),
				width: 50,
				height: 50,
				left: (event as MouseEvent).clientX,
				top: (event as MouseEvent).clientY,
				edgeTypes: [RectType.DISTINGUISHABLE, RectType.WINDOW],
			});
		});
	}

	async init() {
		const menuTemplateHTML = await UtilsEngine.loadTemplate("/templates/menu.template.html");
		const elem = document.createElement("div");
		elem.innerHTML = menuTemplateHTML;

		this.menuShadowRoot = document.querySelector(".vp-sprite-menu-container")!.attachShadow({ mode: "open" });
		this.menuShadowRoot.appendChild(elem.childNodes[0]);

		// inject css
		var link = document.createElement("link");
		link.id = "menu-style";
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = UtilsEngine.browser.runtime.getURL("/style/content-style.css");
		link.media = "all";
		this.menuShadowRoot.appendChild(link);

		this.addEvents();
	}
}
