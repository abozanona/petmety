import { ObjectInstantiatorEngine } from "./objects-instantiator-engine";
import { CharacterAnimation } from "./player-engine";
import { CatFood } from "./spawnable-objects";
import { SpriteEngine } from "./sprite-engine";
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
			SpriteEngine.gameStatus.sprite.isSleeping = !SpriteEngine.gameStatus.sprite.isSleeping;
			SpriteEngine.updateGameStatus(SpriteEngine.gameStatus);
		});

		this.menuShadowRoot.querySelector("#vp-btn-create-food")!.addEventListener("click", async (event: Event) => {
			await ObjectInstantiatorEngine.initiateObject(new CatFood(), { left: (event as MouseEvent).clientX, top: (event as MouseEvent).clientY });
		});

		this.menuShadowRoot.querySelector("#vp-btn-show-spawned-objects")!.addEventListener("click", async (event: Event) => {
			document.getElementById("#vp-spawned-objects-target")!.style.display = "block";
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
