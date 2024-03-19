declare const msBrowser: any;
declare const browser: any;

export class UtilsEngine {
	public static async loadTemplate(templatePath: string) {
		const templateRes = await fetch(
			UtilsEngine.browser.runtime.getURL(templatePath)
		);
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
}
