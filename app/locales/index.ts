import path from "path";
import i18n from "i18n";

export const t: i18nAPI = {} as any;

export type TranslationMessage = [string, ...any];

export function a(message: string, ...args: any): TranslationMessage {
	return [message, args];
}

export function initLocalization() {
	i18n.configure({
		locales: ["en", "ro"],
		register: t,
		directory: path.join(__dirname, "lang"),
		updateFiles: true,
	});
}
