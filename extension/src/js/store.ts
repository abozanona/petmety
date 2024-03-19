import { AnimationEngine } from "./animation-engine";
import { EdgeDetector } from "./edge-detector";
import { MenuEngine } from "./menu-engine";
import { PlayerEngine } from "./player-engine";
import { SpriteEngine } from "./sprite-engine";

class Store {
	public edgeDetector: EdgeDetector;

	public animationEngine: AnimationEngine;

	public playerEngine: PlayerEngine;

	public spriteEngine: SpriteEngine;

	public menuEngine: MenuEngine;
}

export const store = new Store();
