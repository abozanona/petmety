import { EdgeDetector } from "./edge-detector";
import { AnimationEngine } from "./animation-engine";
import { store } from "./store";
import { UtilsEngine } from "./utils/utils";
import { MenuEngine } from "./menu-engine";
import { PlayerEngine } from "./player-engine";
import { SpriteEngine } from "./sprite-engine";

const DEBUG_MODE: boolean = false;

(async () => {
	const elementSelector = `#vp-player-container`;

	const spriteTemplateHTML = await UtilsEngine.loadTemplate(
		"/templates/sprite.template.html"
	);
	const elem = document.createElement("div");
	elem.innerHTML = spriteTemplateHTML;
	document.body.appendChild(elem.childNodes[0]);

	const playerEngine = new PlayerEngine(elementSelector);

	const edgeDetector = new EdgeDetector({
		debugMode: DEBUG_MODE,
		ignoreSelector: elementSelector,
	});
	edgeDetector.injectCalculator();

	const animationEngine = new AnimationEngine({
		debugMode: DEBUG_MODE,
		selector: elementSelector,
	});
	animationEngine.init();

	const menuEngine = new MenuEngine();

	const spriteEngine = new SpriteEngine({
		selector: elementSelector,
	});

	store.playerEngine = playerEngine;
	store.edgeDetector = edgeDetector;
	store.animationEngine = animationEngine;
	store.spriteEngine = spriteEngine;
})();
