import { SpriteAnimationEngine } from "./sprite-animation-engine";
import { EdgeDetector } from "./edge-detector";
import { MenuEngine } from "./menu-engine";
import { PlayerEngine } from "./player-engine";
import { SpriteActionsEngine } from "./sprite-actions-engine";
import { SpriteEngine } from "./sprite-engine";
import { Constants } from "./utils/constants";

class Store {
	public edgeDetector: EdgeDetector;

	public animationEngine: SpriteAnimationEngine;

	public playerEngine: PlayerEngine;

	public spriteEngine: SpriteEngine;

	public menuEngine: MenuEngine;

	public spriteActionsEngine: SpriteActionsEngine;
}

export const store = new Store();
