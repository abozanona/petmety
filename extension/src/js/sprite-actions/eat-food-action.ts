import { CharacterAnimation } from "../player-engine";
import { ObjectInstantiatorCategory } from "../spawnable-objects/spawnable-object";
import { store } from "../engines";
import { UtilsEngine } from "../utils/utils";
import { ActionPriority, SpriteAction } from "./sprite-action";
import { StorePublic } from "../../app/app-context/store-context";

export class EatFoodAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_EAT_FOOD;
	public minExecutionTime: number = 60 * 60;
	public maxExecutionTime: number = 60 * 60;

	public async selectionPrecondition() {
		const tabId = await UtilsEngine.getTabId();
		// TODO: Need to load it async in the future
		return (
			!StorePublic.ctx.store.storage.sprite.isSleeping && // Not sleepint
			StorePublic.ctx.store.storage.sprite.satedLevel.value < 60 && // Hungry
			StorePublic.ctx.store.storage.spawnedObjects.some(
				(el) =>
					el.category === ObjectInstantiatorCategory.CAT_FOOD && // It's a food
					el.remainingValue > 0 &&
					el.spawnedOnTabId == tabId && // It's on this tab
					document.querySelector(`[data-vp_object_id="${el.id}"]`) // It's not removed
			)
		);
	}
	public async start() {
		const objectToEat = StorePublic.ctx.store.storage.spawnedObjects
			.filter((el) => el.category === ObjectInstantiatorCategory.CAT_FOOD && el.remainingValue > 0)
			.sort((_, __) => Math.random() - Math.random())[0];
		const objectDomRect = document.querySelector(`[data-vp_object_id="${objectToEat.id}"]`)!.getBoundingClientRect();
		await store.animationEngine.singleJumpToPoint({
			x: objectDomRect.left,
			y: objectDomRect.top + objectDomRect.height,
		});
		store.playerEngine.playAnimation(CharacterAnimation.Eating, { loop: true });
		while (!this.isCanceled && StorePublic.ctx.store.storage.sprite.satedLevel.value != 100 && objectToEat.remainingValue !== 0) {
			const amountToEat = Math.min(10, objectToEat.remainingValue, 100 - StorePublic.ctx.store.storage.sprite.satedLevel.value);

			const originalObjectToEat = StorePublic.ctx.store.storage.spawnedObjects.find((el) => el.id === objectToEat.id);
			if (originalObjectToEat === undefined) {
				break;
			}
			originalObjectToEat.remainingValue -= 10;
			originalObjectToEat.updatedAt = +new Date();
			StorePublic.ctx.store.storage.sprite.satedLevel.value += amountToEat;
			StorePublic.ctx.updateState(StorePublic.ctx);
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
