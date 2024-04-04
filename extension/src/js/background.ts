import { SpriteEngine } from "./sprite-engine";
import { store } from "./store";
import { UtilsEngine } from "./utils/utils";

store.spriteEngine = new SpriteEngine({});

UtilsEngine.browser.runtime.onInstalled.addListener(async () => {
	store.spriteEngine.updateSpriteStatus();
	await UtilsEngine.browser.alarms.create("sprite-status-sync", {
		// TODO: set to 30 later
		// periodInMinutes: 30,
		periodInMinutes: 1,
	});
});

UtilsEngine.browser.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "sprite-status-sync") {
		store.spriteEngine.updateSpriteStatus();
	}
});

const manifest = UtilsEngine.browser.runtime.getManifest();
let user = {
	version: manifest.version,
};
UtilsEngine.browser.runtime.setUninstallURL(`https://docs.google.com/forms/d/e/1FAIpQLSchwIEPLVcl54IOHZOrQ8s_2jyWE_ea2Njk8kajZtUwPmNFcQ/viewform?entry.280944084=${user.version}`);
