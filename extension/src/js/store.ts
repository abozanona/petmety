import { AnimationEngine } from "./animation-engine";
import { EdgeDetector } from "./edge-detector";

class Store {
    public edgeDetector: EdgeDetector;

    public animationHelper: AnimationEngine;

};

export const store = new Store();