import { SpriteAnimationEngine } from "../js/sprite-animation-engine";
import { EdgeDetector } from "../js/edge-detector";
import { MenuEngine } from "../js/menu-engine";
import { PlayerEngine } from "../js/player-engine";
import { SpriteActionsEngine } from "../js/sprite-actions-engine";
import { SpriteEngine } from "../js/sprite-engine";
import { store } from "../js/engines";
import { Constants } from "../js/utils/constants";
import { UtilsEngine } from "../js/utils/utils";

export const renderPet = async () => {
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
	await store.menuEngine.init();

	store.spriteEngine = new SpriteEngine({});
	return elem;
};
