import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { StoreContex } from "../../app-context/store-context";
import { store } from "../../../js/engines";
import { CharacterAnimation } from "../../../js/player-engine";
import { CatFood } from "../../../js/spawnable-objects";
import { UtilsEngine } from "../../../js/utils/utils";
import { ObjectInstantiatorEngine } from "../../../js/objects-instantiator-engine";

function SpriteMenu() {
	const ctx = useContext(StoreContex);

	useEffect(() => {
		setInterval(() => {
			const menuContainerElement: HTMLElement | null = document.getElementById("vp-sprite-menu-container");
			const menuElement: HTMLElement | null | undefined = document.getElementById("vp-app-react-container")?.shadowRoot?.querySelector("#vp-app-react-target #vp-sprite-menu");
			if (menuContainerElement && menuElement) {
				const reactAppOffset = document.getElementById("vp-app-react-container")!.getBoundingClientRect();
				const menuContainerOffset = menuContainerElement.getBoundingClientRect();

				menuElement.style.position = "fixed";
				menuElement.style.left = Math.abs(menuContainerOffset.left - reactAppOffset.left) + menuContainerOffset.width / 2 + "px";
				menuElement.style.top = menuContainerOffset.top + "px";
			}
		}, 50);
	}, []);

	const [state, setState] = useState({
		isMenuVisible: false,
	});

	function toggleMenu(): void {
		setState({ ...state, isMenuVisible: true });
	}

	function startEating(): void {
		store.playerEngine.playAnimation(CharacterAnimation.Eating, {
			loop: true,
		});
	}

	function startSleeping(): void {
		ctx.store.storage.sprite.isSleeping = !ctx.store.storage.sprite.isSleeping;
		ctx.updateState(ctx);
	}

	async function createFood(event: MouseEvent): Promise<void> {
		const catFood = new CatFood();
		const tabId = await UtilsEngine.getTabId();
		catFood.spawnedOnTabId = tabId;
		await ObjectInstantiatorEngine.initiateObject(catFood, { left: event.clientX, top: event.clientY });
	}

	function showSpawnedObjects(): void {
		ctx.store.isSpawnedSpritesMenuVisible = !ctx.store.isSpawnedSpritesMenuVisible;
		ctx.updateState(ctx);
	}

	return (
		<div id="vp-sprite-menu" className="vp-sprite-menu">
			{!state.isMenuVisible && (
				<button id="vp-sprite-menu-toggle" onClick={() => toggleMenu()}>
					Toggle menu
				</button>
			)}
			{state.isMenuVisible && (
				<div className="vp-sprite-menu-list">
					<div className="vp-sprite-menu-list-item" onClick={() => startEating()}>
						Eating
					</div>
					<div className="vp-sprite-menu-list-item" onClick={() => startSleeping()}>
						Toggle sleep
					</div>
					<div className="vp-sprite-menu-list-item" onClick={(event) => createFood(event)}>
						Create food
					</div>
					<div className="vp-sprite-menu-list-item" onClick={() => showSpawnedObjects()}>
						Spawned Objects
					</div>
				</div>
			)}
		</div>
	);
}

export default SpriteMenu;
