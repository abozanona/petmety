import { RectType } from "../edge-detector";
import { UtilsEngine } from "../utils/utils";

export enum ObjectInstantiatorCategory {
	CAT_FOOD = 1,
}

export enum ObjectInstantiatorType {
	FOOD_PLATE = 1,
}

export abstract class SpawnableObject {
	private _id: string | undefined;
	public get id(): string {
		if (!this._id) {
			this._id = UtilsEngine.uuid();
		}
		return this._id;
	}
	public set id(value: string) {
		this._id = value;
	}

	public abstract title: string;
	public abstract category: ObjectInstantiatorCategory;
	public abstract type: ObjectInstantiatorType;
	public abstract maxValue: number;
	public abstract remainingValue: number;
	public abstract lastUpdated: Date;
	public abstract imagePath: string;
	public abstract width: number;
	public abstract height: number;
	public abstract edgeTypes: [RectType, ...Array<RectType>];
	public constructor() {
		this._id = UtilsEngine.uuid();
	}
}
