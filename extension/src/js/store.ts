import { AnimationHelper } from "./animation-helper";
import { EdgeDetector } from "./edge-detector";

class Store {
    public edgeDetector: EdgeDetector;

public animationHelper: AnimationHelper;

};

export const store = new Store();