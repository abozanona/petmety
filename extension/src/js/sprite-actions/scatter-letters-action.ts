import { StorePublic } from "../../app/app-context/store-context";
import { RectType } from "../edge-detector";
import { store } from "../engines";
import { SpriteAnimationEngine } from "../sprite-animation-engine";
import { GSAPHelper } from "../utils/gsap-helper";
import { UtilsEngine } from "../utils/utils";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class ScatterLettersAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_SCATTER_LETTERS;
	public minExecutionTime: number = 30;
	public maxExecutionTime: number = 30;
	public async selectionPrecondition() {
		return !StorePublic.ctx.store.storage.sprite.isSleeping && store.edgeDetector.topVisibleEdges.filter((edge) => edge.rectType === RectType.TEXT).length != 0;
	}
	public async start() {
		const edges = store.edgeDetector.topVisibleEdges.filter((edge) => edge.rectType === RectType.TEXT);
		const edge = edges[Math.floor(Math.random() * edges.length)];
		// get random word in dom
		const textNodeMatches = edge.dom.innerText.match(/[^<>]*(?=(?:[^>]*<[^<]*>)*[^<>]*$)/g);
		if (!textNodeMatches) {
			await this.cancel();
			return;
		}
		const textNodeWords = textNodeMatches
			.join(" ")
			.split(" ")
			.filter((word) => word.length > 4);
		const randomWord = textNodeWords[Math.floor(Math.random() * textNodeWords.length)];
		// put `vp-scattered-span arount it
		let innerHtml = edge.dom.innerHTML;
		innerHtml = innerHtml.replace(
			randomWord,
			"<vp-scattered-span>" +
				randomWord.replace(/(.)/g, (matched, index, original) => {
					const uuid = crypto.randomUUID();
					return `<vp-scattered-letter data-vb-scattered-id="${uuid}">${matched}</vp-scattered-letter><vp-placeholder-letter data-vb-placeholder-id="${uuid}">${matched}</vp-placeholder-letter>`;
				}) +
				"</vp-scattered-span>"
		);
		edge.dom.innerHTML = innerHtml;
		const scatteredSpan = document.querySelector("vp-scattered-span");
		if (scatteredSpan === null) {
			await this.cancel();
			return;
		}
		// Move sprite to point
		// TODO: If rtl => cat should be facing right, else facing left
		// TODO: Also move cat a little bit to bottom
		store.animationEngine.singleJumpToPoint({
			x: scatteredSpan.getBoundingClientRect().x,
			y: scatteredSpan.getBoundingClientRect().y,
		});
		// scatter in the page with animation.
		const scatteredLetter = this.shuffleArray([...scatteredSpan.querySelectorAll("vp-scattered-letter")]);
		const rangeReposition = 100;
		for (const element of scatteredLetter) {
			const animationTime = Math.random() * 3;
			GSAPHelper.to(element, {
				x: Math.floor(Math.random() * rangeReposition) * (Math.random() < 0.5 ? 1 : -1),
				y: Math.floor(Math.random() * rangeReposition) * (Math.random() < 0.5 ? 1 : -1),
				scale: 1.3,
				duration: animationTime,
				onComplete: () => {
					StorePublic.ctx.store.currentEdge = edge;
					StorePublic.ctx.updateState(StorePublic.ctx);
				},
			});
			await UtilsEngine.wait(animationTime * 1000);
			element.addEventListener("click", (e) => {
				e.preventDefault();
				const uuid = element.getAttribute("data-vb-scattered-id");
				document.querySelector(`[data-vb-scattered-id='${uuid}']`)?.remove();
				(document.querySelector(`[data-vb-placeholder-id='${uuid}']`) as HTMLElement).style.visibility = "visible";
			});
		}
		// On click on scattered letter, if dom still exists, put it back; else, pop it somehow(or maybe always pop it)
	}

	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}

	private shuffleArray<T>(array: Array<T>) {
		const arrayClone = [...array];
		for (let i = arrayClone.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arrayClone[i], arrayClone[j]] = [arrayClone[j], arrayClone[i]];
		}
		return arrayClone;
	}
}
