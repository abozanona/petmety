import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { renderPet } from "./pet-renderer";
import { StoreContex, StoreContextProvider, StorePublic } from "./app-context/store-context";

function ObjectSpritesApp() {
	const ctx = useContext(StoreContex);
	StorePublic.ctx = ctx;

	useEffect(() => {
		renderPet();
	}, []);

	return (
		<React.Fragment>
			<div className="container">
				<div>
					{ctx.store.spawnedObjects.map((spawnedObject, index) => {
						return (
							<div key={spawnedObject.id}>
								<img width="50" height="50" src={spawnedObject.imagePath} title={spawnedObject.title} /> {spawnedObject.title}
							</div>
						);
					})}
					<div>Sated: {ctx.store.sprite.satedLevel.value}</div>
					<div>Happiness: {ctx.store.sprite.happinessLevel.value}</div>
					<div>Energy: {ctx.store.sprite.energyLevel.value}</div>
				</div>
			</div>
		</React.Fragment>
	);
}

// Create container div
const spawnedObjectsListContainer = document.createElement("div");
spawnedObjectsListContainer.id = "vp-spawned-objects-container";
spawnedObjectsListContainer.classList.add("vp-spawned-objects-target");
const spawnedObjectsListContainerShadow = spawnedObjectsListContainer.attachShadow({ mode: "open" });
document.body.appendChild(spawnedObjectsListContainer);

const spawnedObjectsListTarget = document.createElement("div");
spawnedObjectsListTarget.id = "vp-spawned-objects-target";
spawnedObjectsListContainerShadow.appendChild(spawnedObjectsListTarget);

// create app
const container = document.getElementById("vp-spawned-objects-container")?.shadowRoot?.getElementById("vp-spawned-objects-target");
if (container) {
	const root = createRoot(container);
	root.render(
		<StoreContextProvider>
			<ObjectSpritesApp />
		</StoreContextProvider>
	);
}
