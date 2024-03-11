import { AnimationEngine } from "./animation-engine";
import { EdgeDetector } from "./edge-detector";
import { PlayerEngine } from "./player-engine";

class Store {
    public edgeDetector: EdgeDetector;

    public animationEngine: AnimationEngine;

    public playerEngine: PlayerEngine;

};

export const store = new Store();