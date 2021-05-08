import { Response } from "express";
import { TranslationMessage } from "../locales";

export function DataResponse(
	res: Response,
	statusCode: number,
	data?: any,
	message?: string,
	errors?: any
) {
	const responseJson = {
		status: statusCode,
		message,
		data,
		errors,
	};

	res.status(200).json(responseJson);
	return responseJson;
}

export function LocaleDataResponse(
	res: Response,
	statusCode: number,
	data?: any,
	message?: TranslationMessage,
	errors?: any
) {
	let msg = message ? res.__(...message) : undefined;

	const responseJson = {
		status: statusCode,
		message: msg,
		data,
		errors,
	};

	res.status(200).json(responseJson);
	return responseJson;
}
