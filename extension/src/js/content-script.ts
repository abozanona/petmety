import { EdgeDetector } from './edge-detector'
import { AnimationHelper } from './animation-helper'
import { store } from './store'
declare const spine: any
const elementId = "vp-player-container";
const elementSelector = `#${elementId}`;

const elem = document.createElement('div');
elem.innerHTML = `<div id="${elementId}"></div>`;
document.body.appendChild(elem.childNodes[0])


new spine.SpinePlayer(elementId, {
    jsonUrl: chrome.runtime.getURL("/assets/cat.json"),
    atlasUrl: chrome.runtime.getURL("/assets/cat.atlas"),
    animation: "Idle",
    showControls: false,
    alpha: true,
});


const edgeDetector = new EdgeDetector({
    // debugMode: true,
    ignoreSelector: elementSelector,
});
edgeDetector.injectCalculator();

const animationHelper = new AnimationHelper(elementSelector)
animationHelper.init();

store.edgeDetector = edgeDetector;
store.animationHelper = animationHelper;