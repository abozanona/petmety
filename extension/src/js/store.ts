import { AnimationEngine } from "./animation-engine";
import { EdgeDetector } from "./edge-detector";
import { PlayerEngine } from "./player-engine";
import { SpriteEngine } from "./sprite-engine";

class Store {
    public edgeDetector: EdgeDetector;

    public animationEngine: AnimationEngine;

    public playerEngine: PlayerEngine;

    public spriteEngine: SpriteEngine;

};

export const store = new Store();