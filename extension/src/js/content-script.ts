import { EdgeDetector } from './edge-detector'
import { AnimationEngine } from './animation-engine'
import { store } from './store'
import { UtilsEngine } from './utils';
declare const spine: any

(async () => {
    const elementId = "vp-player-container";
    const elementSelector = `#${elementId}`;

    const spriteTemplateHTML = await UtilsEngine.loadTemplate("/templates/sprite.template.html");
    const elem = document.createElement('div');
    elem.innerHTML = spriteTemplateHTML;
    document.body.appendChild(elem.childNodes[0])
    document.querySelector("#vp-sprite-menu-toggle").addEventListener('click', () => {
        document.querySelector('.vp-sprite-menu-list').classList.remove('vp-hidden');
        document.querySelector('#vp-sprite-menu-toggle').classList.add('vp-hidden');
    })


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

    const animationHelper = new AnimationEngine(elementSelector)
    animationHelper.init();

    store.edgeDetector = edgeDetector;
    store.animationHelper = animationHelper;
})()