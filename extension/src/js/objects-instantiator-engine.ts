import { RectType } from "./edge-detector";
import { ObjectAnimationEngine } from "./object-animation-engine";
import { Constants } from "./utils/constants";

export enum ObjectInstantiatorType {
	FOOD = 1,
}

type ObjectInstantiatorOptions = {
	type: ObjectInstantiatorType;
	imagePath: string;
	width: number;
	height: number;
	edgeTypes: [RectType, ...Array<RectType>];
};

export class ObjectInstantiatorEngine {
	public static initiateObject(opt: ObjectInstantiatorOptions) {
		// create a dom invisible element that covers the full screen
		const instantiationOverlay = document.createElement("div");
		instantiationOverlay.classList.add("vp-object-instantiator");
		instantiationOverlay.style.position = "absolute";
		instantiationOverlay.style.left = "0";
		instantiationOverlay.style.top = "0";
		instantiationOverlay.style.width = "100%";
		instantiationOverlay.style.height = "100%";
		instantiationOverlay.style.zIndex = Constants.maxZIndex.toString();
		document.body.classList.add("vp-disallow-scroll");
		// On click, create a new object, make it fall down to the closest edge of type/types
		instantiationOverlay.addEventListener("click", (event) => {
			event.preventDefault();
			instantiationOverlay.remove();

			const instantiatedObject = document.createElement("img");
			instantiatedObject.src = opt.imagePath;
			instantiatedObject.style.position = "absolute";
			instantiatedObject.style.width = opt.width + "px";
			instantiatedObject.style.height = opt.height + "px";
			instantiatedObject.style.left = window.scrollX + event.clientX + "px";
			instantiatedObject.style.top = window.scrollY + event.clientY + "px";
			instantiatedObject.style.zIndex = Constants.maxZIndex.toString();
			document.body.appendChild(instantiatedObject);
			const objectAnimation = new ObjectAnimationEngine({
				objectDom: instantiatedObject,
				edgeTypes: opt.edgeTypes,
			});
			objectAnimation.dropObject({
				x: event.clientX,
				y: event.clientY,
			});

			document.body.classList.remove("vp-disallow-scroll");
		});
		document.body.append(instantiationOverlay);

		// attach a drawing to the cursor, the drawing moves along with the cursor
		const instantiatedObject = document.createElement("img");
		instantiatedObject.src = opt.imagePath;
		instantiatedObject.style.width = opt.width + "px";
		instantiatedObject.style.height = opt.height + "px";
		instantiatedObject.style.position = "absolute";
		instantiationOverlay.appendChild(instantiatedObject);
		instantiationOverlay.addEventListener("mousemove", (event) => {
			instantiatedObject.style.left = event.clientX + "px";
			instantiatedObject.style.top = event.clientY + "px";
		});
	}
}
