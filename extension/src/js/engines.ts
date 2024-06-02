import { SpriteAnimationEngine } from "./sprite-animation-engine";
import { EdgeDetector } from "./edge-detector";
import { PlayerEngine } from "./player-engine";
import { SpriteActionsEngine } from "./sprite-actions-engine";
import { SpriteEngine } from "./sprite-engine";

class Engines {
	// @ts-ignore:next-line
	public edgeDetector: EdgeDetector;

	// @ts-ignore:next-line
	public animationEngine: SpriteAnimationEngine;

	// @ts-ignore:next-line
	public playerEngine: PlayerEngine;

	// @ts-ignore:next-line
	public spriteEngine: SpriteEngine;

	// @ts-ignore:next-line
	public spriteActionsEngine: SpriteActionsEngine;
}

export const store = new Engines();
