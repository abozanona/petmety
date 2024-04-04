import { ObjectAnimationEngine } from "./object-animation-engine";
import { SpawnableObject } from "./spawnable-objects/spawnable-object";
import { GameStatus, SpriteEngine, defaultGameStatus } from "./sprite-engine";
import { Constants } from "./utils/constants";
import { SettingName, UtilsEngine } from "./utils/utils";

export class ObjectInstantiatorEngine {
	public static async initiateObject(spawnableObject: SpawnableObject, position: { left: number; top: number }) {
		// check if object was already instantiated
		const gameStatus: GameStatus = await UtilsEngine.getSettings(SettingName.GAME_STATUS, defaultGameStatus);

		if (!gameStatus.spawnedObjects.find((el) => el.id == spawnableObject.id)) {
			gameStatus.spawnedObjects.push(spawnableObject);
			SpriteEngine.gameStatus = gameStatus;
			await UtilsEngine.setSettings(SettingName.GAME_STATUS, gameStatus);
		}

		// create a dom invisible element that covers the full screen
		const instantiationOverlay = document.createElement("div");
		instantiationOverlay.classList.add("vp-object-instantiator");
		document.body.classList.add("vp-disallow-scroll");
		// On click, create a new object, make it fall down to the closest edge of type/types
		instantiationOverlay.addEventListener("click", (event) => {
			event.preventDefault();
			instantiationOverlay.remove();

			const instantiatedObject = document.createElement("img");
			instantiatedObject.src = spawnableObject.imagePath;
			instantiatedObject.style.position = "absolute";
			instantiatedObject.style.width = spawnableObject.width + "px";
			instantiatedObject.style.height = spawnableObject.height + "px";
			instantiatedObject.style.left = window.scrollX + event.clientX + "px";
			instantiatedObject.style.top = window.scrollY + event.clientY + "px";
			instantiatedObject.style.zIndex = Constants.maxZIndex.toString();
			document.body.appendChild(instantiatedObject);
			const objectAnimation = new ObjectAnimationEngine({
				objectDom: instantiatedObject,
				edgeTypes: spawnableObject.edgeTypes,
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
		instantiatedObject.src = spawnableObject.imagePath;
		instantiatedObject.style.width = spawnableObject.width + "px";
		instantiatedObject.style.height = spawnableObject.height + "px";
		instantiatedObject.style.left = position.left + "px";
		instantiatedObject.style.top = position.top + "px";
		instantiatedObject.style.position = "absolute";
		instantiationOverlay.appendChild(instantiatedObject);
		instantiationOverlay.addEventListener("mousemove", (event) => {
			instantiatedObject.style.left = event.clientX + "px";
			instantiatedObject.style.top = event.clientY + "px";
		});
	}
}
