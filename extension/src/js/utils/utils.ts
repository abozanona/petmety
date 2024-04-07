declare const msBrowser: any;
declare const browser: any;

export class UtilsEngine {
	public static async loadTemplate(templatePath: string) {
		const templateRes = await fetch(UtilsEngine.browser.runtime.getURL(templatePath));
		let templateHTML = await templateRes.text();
		return templateHTML;
	}

	public static browser: typeof chrome = (function () {
		if (typeof msBrowser !== "undefined") {
			return msBrowser;
		}
		if (typeof browser !== "undefined") {
			return browser;
		}
		if (typeof chrome !== "undefined") {
			return chrome;
		}
		return null;
	})();

	public static wait = (millis: number) => new Promise((resolve) => setTimeout(resolve, millis));

	public static numberBetweenTwoNumbers(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public static getTabId(): Promise<number> {
		return new Promise(function (resolve, reject) {
			UtilsEngine.browser.runtime
				.sendMessage({ code: "Q_TAB_ID" })
				.then((res) => {
					resolve(res.body.tabId);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	public static uuid = () => {
		return ("" + 1e8).replace(/[018]/g, (c) => (parseInt(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c) / 4)))).toString(16));
	};

	public static async setSettings<T>(key: SettingName, settings: T): Promise<void> {
		await UtilsEngine.browser.storage.sync.set({ [key]: settings });
	}

	public static async getSettings<T>(key: SettingName, defaultValue: T): Promise<T> {
		let settings = await UtilsEngine.browser.storage.sync.get(key);
		if (!settings[key]) {
			await this.setSettings(key, defaultValue);
			return defaultValue;
		}
		return <T>settings[key];
	}
}

export enum SettingName {
	GAME_STATUS = "game-status",
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
