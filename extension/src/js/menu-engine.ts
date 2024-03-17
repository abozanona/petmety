import { RectType } from "./edge-detector";
import { CharacterAnimation } from "./player-engine";
import { store } from "./store";

export class MenuEngine {

    constructor() {
        // Toggle menu button
        document.querySelector("#vp-sprite-menu-toggle").addEventListener('click', () => {
            document.querySelector('.vp-sprite-menu-list').classList.remove('vp-hidden');
            document.querySelector('#vp-sprite-menu-toggle').classList.add('vp-hidden');
        });

        document.querySelector("#vp-btn-jump-to-another-place").addEventListener('click', () => {
            const edges = store.edgeDetector.topVisibleEdges.filter(edge => edge.rectType !== RectType.WINDOW);
            const edge = edges[Math.floor(Math.random() * edges.length)];
            store.animationEngine.singleJumpToPoint(Math.random() < 0.5 ? edge.start : edge.end);
        });

        document.querySelector("#vp-btn-anim-idle").addEventListener('click', () => {
            store.playerEngine.playAnimation(CharacterAnimation.Idle, { loop: true });
        });

        document.querySelector("#vp-btn-anim-eating").addEventListener('click', () => {
            store.playerEngine.playAnimation(CharacterAnimation.Eating, { loop: true });
        });

        document.querySelector("#vp-btn-anim-jump").addEventListener('click', () => {
            store.playerEngine.playAnimation(CharacterAnimation.Jump, { loop: false });
        });

        document.querySelector("#vp-btn-anim-sleeping").addEventListener('click', () => {
            store.playerEngine.playAnimation(CharacterAnimation.Sleeping, { loop: true });
        });
    }
}