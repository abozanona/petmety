import React, { Component, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { SpriteEngine } from "../js/sprite-engine";
import { SpawnableObject } from "../js/spawnable-objects/spawnable-object";

class ObjectSpritesApp extends Component<{}, { spawnedObjects: SpawnableObject[] }> {
	constructor(props: any) {
		super(props);
		this.state = {
			spawnedObjects: [],
		};

		const tick = async () => {
			await SpriteEngine.getGameStatus();
			this.setState({ spawnedObjects: SpriteEngine.gameStatus.spawnedObjects });
		};

		const intervalId = setInterval(tick.bind(this), 3000);
	}

	render() {
		return (
			<React.Fragment>
				<div className="container">
					<div>
						{this.state.spawnedObjects.map((spawnedObject, index) => {
							return (
								<div key="{spawnedObject.id}">
									<img width="50" height="50" src={spawnedObject.imagePath} title={spawnedObject.title} /> {spawnedObject.title}
								</div>
							);
						})}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const container = document.getElementById("vp-spawned-objects-container")?.shadowRoot?.getElementById("vp-spawned-objects-target");
if (container) {
	const root = createRoot(container);
	root.render(<ObjectSpritesApp />);
}
