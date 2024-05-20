import { Edge } from "../../js/edge-detector";
import { SpawnableObject } from "../../js/spawnable-objects/spawnable-object";
import React, { useState } from "react";
import { SettingName, UtilsEngine } from "../../js/utils/utils";

interface Props {
	children: React.ReactNode;
}

export interface StoreGameStatus {
	sprite: {
		isSleeping: boolean;
		happinessLevel: {
			value: number;
			updatedAt: number;
			decrementEachMinutes: number;
			decrementValue: number;
		};
		satedLevel: {
			value: number;
			updatedAt: number;
			decrementEachMinutes: number;
			decrementValue: number;
		};
		energyLevel: {
			value: number;
			updatedAt: number;
			decrementEachMinutes: number;
			decrementValue: number;
		};
		currentEdge: Edge | undefined;
	};
	player: {
		level: number;
		levelProgress: number;
	};
	spawnedObjects: SpawnableObject[];
}

/**
 * Application state interface
 */
export interface AppState {
	store: StoreGameStatus;
	updateState: (newState: Partial<AppState>) => void;
}

/**
 * Default application state
 */
const defaultGameState: AppState = {
	store: {
		sprite: {
			isSleeping: false,
			happinessLevel: {
				value: 100,
				updatedAt: +new Date(),
				decrementEachMinutes: 10,
				decrementValue: 5,
			},
			satedLevel: {
				value: 100,
				updatedAt: +new Date(),
				decrementEachMinutes: 10,
				decrementValue: 5,
			},
			energyLevel: {
				value: 100,
				updatedAt: +new Date(),
				decrementEachMinutes: 10,
				decrementValue: 5,
			},
			currentEdge: undefined,
		},
		player: {
			level: 5,
			levelProgress: 13,
		},
		spawnedObjects: [],
	},
	updateState: (newState?: Partial<AppState>) => {},
};

/**
 * Creating the Application state context for the provider
 */
export const StoreContex = React.createContext<AppState>(defaultGameState);

/**
 * The main context provider
 */
export const StoreContextProvider: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
	/**
	 * Using react hooks, set the default state
	 */
	const [state, setState] = useState({
		store: defaultGameState.store,
	});

	UtilsEngine.getSettings(SettingName.GAME_STATUS, defaultGameState.store).then((gameStatus) => {
		setState({ store: gameStatus });
	});

	/**
	 * Declare the update state method that will handle the state values
	 */
	const updateState = (newState: Partial<AppState>) => {
		const updatedState = { ...state, ...newState };
		setState(updatedState);
		return UtilsEngine.setSettings(SettingName.GAME_STATUS, updatedState.store);
	};

	/**
	 * Context wrapper that will provider the state values to all its children nodes
	 */
	return <StoreContex.Provider value={{ ...state, updateState }}>{props.children}</StoreContex.Provider>;
};

export class StorePublic {
	public static ctx: AppState;
}
