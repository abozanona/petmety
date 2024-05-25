import React, { useContext } from "react";
import { StoreContex } from "../app-context/store-context";

function SpawnedSprites() {
	const ctx = useContext(StoreContex);

	return (
		<div className="vp-spawned-sprites-container">
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
	);
}

export default SpawnedSprites;
