import { CharacterAnimation } from "../player-engine";
import { ObjectInstantiatorCategory } from "../spawnable-objects/spawnable-object";
import { SpriteEngine } from "../sprite-engine";
import { store } from "../store";
import { UtilsEngine } from "../utils/utils";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class EatFoodAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_EAT_FOOD;
	public minExecutionTime: number = 60 * 60;
	public maxExecutionTime: number = 60 * 60;

	public async selectionPrecondition() {
		const tabId = await UtilsEngine.getTabId();
		// TODO: Need to load it async in the future
		await SpriteEngine.getGameStatus();
		return (
			!SpriteEngine.gameStatus.sprite.isSleeping && // Not sleepint
			SpriteEngine.gameStatus.sprite.satedLevel.value < 60 && // Hungry
			SpriteEngine.gameStatus.spawnedObjects.some(
				(el) =>
					el.category === ObjectInstantiatorCategory.CAT_FOOD && // It's a food
					el.remainingValue > 0 &&
					el.spawnedOnTabId == tabId && // It's on this tab
					document.querySelector(`[data-vp_object_id="${el.id}"]`) // It's not removed
			)
		);
	}
	public async start() {
		const objectToEat = SpriteEngine.gameStatus.spawnedObjects
			.filter((el) => el.category === ObjectInstantiatorCategory.CAT_FOOD && el.remainingValue > 0)
			.sort((_, __) => Math.random() - Math.random())[0];
		const objectDomRect = document.querySelector(`[data-vp_object_id="${objectToEat.id}"]`)!.getBoundingClientRect();
		await store.animationEngine.singleJumpToPoint({
			x: objectDomRect.left,
			y: objectDomRect.top + objectDomRect.height,
		});
		store.playerEngine.playAnimation(CharacterAnimation.Eating, { loop: true });
		while (!this.isCanceled && SpriteEngine.gameStatus.sprite.satedLevel.value != 100 && objectToEat.remainingValue !== 0) {
			const amountToEat = Math.min(10, objectToEat.remainingValue, 100 - SpriteEngine.gameStatus.sprite.satedLevel.value);

			const originalObjectToEat = SpriteEngine.gameStatus.spawnedObjects.find((el) => el.id === objectToEat.id);
			if (originalObjectToEat === undefined) {
				break;
			}
			originalObjectToEat.remainingValue -= 10;
			originalObjectToEat.updatedAt = +new Date();
			SpriteEngine.gameStatus.sprite.satedLevel.value += amountToEat;
			await SpriteEngine.updateGameStatus(SpriteEngine.gameStatus);
			UtilsEngine.wait(3 * 1000);
		}
		store.playerEngine.playAnimation(CharacterAnimation.Idle, { loop: true });
		this.cancel();
	}
	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}
}
