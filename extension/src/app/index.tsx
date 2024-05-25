import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { renderPet } from "./pet-renderer";
import { StoreContex, StoreContextProvider, StorePublic } from "./app-context/store-context";
import SpawnedSprites from "./components/spawned-sprites";
import "./style/index.scss";
import { UtilsEngine } from "../js/utils/utils";

function ObjectSpritesApp() {
	const ctx = useContext(StoreContex);
	StorePublic.ctx = ctx;

	useEffect(() => {
		renderPet();
	}, []);

	return (
		<React.Fragment>
			<SpawnedSprites />
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

var link = document.createElement("link");
link.id = "menu-style";
link.rel = "stylesheet";
link.type = "text/css";
link.href = UtilsEngine.browser.runtime.getURL("/style/index.css");
link.media = "all";
spawnedObjectsListContainerShadow.appendChild(link);

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
