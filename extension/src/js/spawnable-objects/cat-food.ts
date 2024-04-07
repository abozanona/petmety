import { RectType } from "../edge-detector";
import { UtilsEngine } from "../utils/utils";
import { ObjectInstantiatorCategory, ObjectInstantiatorType, SpawnableObject } from "./spawnable-object";

export class CatFood extends SpawnableObject {
	public title: string;
	public type: ObjectInstantiatorType;
	public category: ObjectInstantiatorCategory;
	public maxValue: number;
	public remainingValue: number;
	public updatedAt: Number;
	public imagePath: string;
	public width: number;
	public height: number;
	public edgeTypes: [RectType, ...RectType[]];
	public spawnedOnTabId?: number;

	public constructor() {
		super();
		this.title = "Cat Food";
		this.category = ObjectInstantiatorCategory.CAT_FOOD;
		this.type = ObjectInstantiatorType.FOOD_PLATE;
		this.maxValue = 20;
		this.remainingValue = 20;
		this.updatedAt = +new Date();
		this.imagePath = UtilsEngine.browser.runtime.getURL("/images/objects/food.png");
		this.width = 50;
		this.height = 50;
		this.edgeTypes = [RectType.DISTINGUISHABLE, RectType.WINDOW];
		this.spawnedOnTabId = undefined;
	}
}
