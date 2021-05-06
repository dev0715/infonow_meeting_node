import { Response } from 'express'

export function DataResponse(res: Response, statusCode: number, data?: any, message?: string, errors?: any) {
	const responseJson = {
		status: statusCode,
		message,
		data,
		errors
	}

	res.status(200).json(responseJson)
	return responseJson
}
