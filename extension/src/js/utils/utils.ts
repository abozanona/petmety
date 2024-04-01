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
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
