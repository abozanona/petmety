import { RectType } from "../edge-detector";
import { UtilsEngine } from "../utils/utils";

export enum ObjectInstantiatorCategory {
	CAT_FOOD = 1,
}

export enum ObjectInstantiatorType {
	FOOD_PLATE = 1,
}

export abstract class SpawnableObject {
	public id: string | undefined;
	public abstract title: string;
	public abstract category: ObjectInstantiatorCategory;
	public abstract type: ObjectInstantiatorType;
	public abstract maxValue: number;
	public abstract remainingValue: number;
	public abstract updatedAt: Number;
	public abstract imagePath: string;
	public abstract width: number;
	public abstract height: number;
	public abstract edgeTypes: [RectType, ...Array<RectType>];
	public abstract spawnedOnTabId?: number;
	public constructor() {
		this.id = UtilsEngine.uuid();
	}
}
