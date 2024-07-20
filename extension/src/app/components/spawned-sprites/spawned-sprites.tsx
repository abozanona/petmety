import React, { useContext } from "react";
import { StoreContex } from "../../app-context/store-context";

function SpawnedSprites() {
	const ctx = useContext(StoreContex);

	return (
		ctx.store.isSpawnedSpritesMenuVisible && (
			<div className="vp-spawned-sprites-container">
				<div className="vp-spawned-sprites-container-inner">
					{ctx.store.storage.spawnedObjects.map((spawnedObject, index) => {
						return (
							<div className="spawned-block" key={spawnedObject.id}>
								<img width="50" height="50" src={spawnedObject.imagePath} title={spawnedObject.title} />
								<span className="spawned-label">{spawnedObject.title}</span>
							</div>
						);
					})}
					<div>Sated: {ctx.store.storage.sprite.satedLevel.value}</div>
					<div>Happiness: {ctx.store.storage.sprite.happinessLevel.value}</div>
					<div>Energy: {ctx.store.storage.sprite.energyLevel.value}</div>
				</div>
			</div>
		)
	);
}

export default SpawnedSprites;
