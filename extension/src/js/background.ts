import { SpriteEngine } from "./sprite-engine";
import { store } from "./store";
import { UtilsEngine } from "./utils/utils";

store.spriteEngine = new SpriteEngine({});

UtilsEngine.browser.runtime.onInstalled.addListener(async () => {
	store.spriteEngine.updateSpriteStatus();
	await UtilsEngine.browser.alarms.create("sprite-status-sync", {
		// TODO: set to 20 later
		// periodInMinutes: 20,
		periodInMinutes: 1,
	});
});

UtilsEngine.browser.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name === "sprite-status-sync") {
		const gameStatus = await SpriteEngine.getGameStatus();

		// Update happinessLevel
		const happinessLevel = gameStatus.sprite.happinessLevel;
		const happinessLevelDiff = happinessLevel.decrementValue * Math.floor(Math.abs(+new Date() - +happinessLevel.updatedAt) / 1000 / 60);
		if (happinessLevelDiff) {
			happinessLevel.value = happinessLevel.value - happinessLevelDiff;
			if (happinessLevel.value < 0) {
				happinessLevel.value = 0;
			}
			happinessLevel.updatedAt = new Date();
		}

		// Update satedLevel
		const satedLevel = gameStatus.sprite.satedLevel;
		const satedLevelDiff = satedLevel.decrementValue * Math.floor(Math.abs(+new Date() - +satedLevel.updatedAt) / 1000 / 60);
		if (satedLevelDiff) {
			satedLevel.value = satedLevel.value - satedLevelDiff;
			if (satedLevel.value < 0) {
				satedLevel.value = 0;
			}
			satedLevel.updatedAt = new Date();
		}

		// Update energyLevel
		const energyLevel = gameStatus.sprite.energyLevel;
		const energyLevelDiff = energyLevel.decrementValue * Math.floor(Math.abs(+new Date() - +energyLevel.updatedAt) / 1000 / 60);
		if (energyLevelDiff) {
			energyLevel.value = energyLevel.value - energyLevelDiff;
			if (energyLevel.value < 0) {
				energyLevel.value = 0;
			}
			energyLevel.updatedAt = new Date();
		}

		await SpriteEngine.updateGameStatus(gameStatus);
	}
});

const manifest = UtilsEngine.browser.runtime.getManifest();
let user = {
	version: manifest.version,
};
UtilsEngine.browser.runtime.setUninstallURL(`https://docs.google.com/forms/d/e/1FAIpQLSchwIEPLVcl54IOHZOrQ8s_2jyWE_ea2Njk8kajZtUwPmNFcQ/viewform?entry.280944084=${user.version}`);
