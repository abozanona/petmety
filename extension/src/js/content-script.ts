import { SpriteAnimationEngine } from "./sprite-animation-engine";
import { EdgeDetector } from "./edge-detector";
import { MenuEngine } from "./menu-engine";
import { PlayerEngine } from "./player-engine";
import { SpriteActionsEngine } from "./sprite-actions-engine";
import { SpriteEngine } from "./sprite-engine";
import { store } from "./store";
import { Constants } from "./utils/constants";
import { UtilsEngine } from "./utils/utils";

(async () => {
	const spriteTemplateHTML = await UtilsEngine.loadTemplate("/templates/sprite.template.html");
	const elem = document.createElement("div");
	elem.innerHTML = spriteTemplateHTML;
	document.body.appendChild(elem.childNodes[0]);

	store.edgeDetector = new EdgeDetector({
		ignoreSelector: Constants.stageSelector,
	});

	store.spriteActionsEngine = new SpriteActionsEngine();

	store.playerEngine = new PlayerEngine();

	store.animationEngine = new SpriteAnimationEngine({});

	store.menuEngine = new MenuEngine();

	store.spriteEngine = new SpriteEngine({});
})();
