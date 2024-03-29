import { EdgeDetector } from "./edge-detector";
import { AnimationEngine } from "./animation-engine";
import { store } from "./store";
import { UtilsEngine } from "./utils/utils";
import { MenuEngine } from "./menu-engine";
import { PlayerEngine } from "./player-engine";
import { SpriteEngine } from "./sprite-engine";
import { SpriteActionsEngine } from "./sprite-actions-engine";

const DEBUG_MODE: boolean = false;

(async () => {
	const elementSelector = `#vp-player-container`;

	const spriteTemplateHTML = await UtilsEngine.loadTemplate("/templates/sprite.template.html");
	const elem = document.createElement("div");
	elem.innerHTML = spriteTemplateHTML;
	document.body.appendChild(elem.childNodes[0]);

	store.edgeDetector = new EdgeDetector({
		debugMode: DEBUG_MODE,
		ignoreSelector: elementSelector,
	});

	store.spriteActionsEngine = new SpriteActionsEngine();

	store.playerEngine = new PlayerEngine(elementSelector);

	store.animationEngine = new AnimationEngine({
		debugMode: DEBUG_MODE,
		selector: elementSelector,
	});

	store.menuEngine = new MenuEngine();

	store.spriteEngine = new SpriteEngine({
		selector: elementSelector,
	});
})();
