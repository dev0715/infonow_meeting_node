import { Request, Response, NextFunction } from 'express'
import { ApplicationError, BadRequestError, DatabaseError, MissingParamError, UserFacingError } from '../utils/errors'
import { DataResponse } from '../utils/http-response'
import { Logger } from '../utils/logger'
import _ from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'

interface FataError {
	identifier: string
	error: ApplicationError | DatabaseError | Error | any
}

export class MissingParam {
	constructor(public name: string, public friendlyName: string) {}
}

export class MissingParams {
	public params: MissingParam[]

	constructor() {
		this.params = []
	}

	public containsErrors() {
		return this.params.length > 0
	}

	public push(missingParam: MissingParam) {
		this.params.push(missingParam)
	}

	public getReadableString(): string {
		return this.params.map(e => e.friendlyName).join(', ')
	}

	public getMissingParams(): string[] {
		return this.params.map(e => e.name)
	}

	public getMissingParamsFriendly(): string[] {
		return this.params.map(e => e.friendlyName)
	}
}

export function RequestParameters(req: Request): any {
	let reqObject = {}
	if (!_.isEmpty(req.params)) reqObject = { ...reqObject, ...req.params }
	if (!_.isEmpty(req.query)) reqObject = { ...reqObject, ...req.query }
	if (!_.isEmpty(req.body)) reqObject = { ...reqObject, ...req.body }

	return reqObject
}

function ErrorTag(identifier: string) {
	return `${'>'.repeat(60)}\n>>>>>>>>>>>>>>>>>> ${identifier} <<<<<<<<<<<<<<<<<<\n${'>'.repeat(60)}`
}

function HandleUserFacingError(err: UserFacingError, req: Request, res: Response) {
	const statusCode = err.statusCode ?? 400
	let message = err.message || 'Unknown Error Occurred, Try again in a while'
	if (err instanceof MissingParamError) message = `Missing Parameter: ${message}`

	Logger.debug(ErrorTag('DEBUG'), err)
	Logger.debug(
		ErrorTag('REQUEST'),
		'Request Parameters: ',
		JSON.stringify(RequestParameters(req)),
		'Requested URL: ',
		req.method + ': ' + req.originalUrl
	)
	return DataResponse(res, statusCode, undefined, message, err.additionalData)
}

function CanHandleKnownFatalErrors(err: FataError, res: Response): false | Object {
	const message = err.error.message ?? 'UNKNOWN_ERROR'

	if (err.error instanceof JsonWebTokenError) {
		const message = `Malformed/Missing Authorization Token. ER_${401} (INCORRECT_JWT)`
		const statusCode = 401
		Logger.debug(ErrorTag('DEBUG'), err.error)
		return DataResponse(res, statusCode, undefined, message)
	}

	if (message.includes('in JSON at position')) {
		const message = `Bad Request, please check the request format and try again. ER_${400} (INCORRECT_JSON)`
		const statusCode = 400
		Logger.debug(ErrorTag('DEBUG'), err.error)
		return DataResponse(res, statusCode, undefined, message)
	}

	return false
}

function HandleFatalErrors(err: FataError, res: Response) {
	const statusCode = err.error.statusCode ?? 500

	const canHandlKnownFatalErrors = CanHandleKnownFatalErrors(err, res)

	if (canHandlKnownFatalErrors) return true

	const errIdentifier = err.identifier ?? 'UNKNOWN_ERROR'
	const message = `Something is not right, please try again later. ER_${statusCode}`

	if (err.error instanceof Error) {
		Logger.error(ErrorTag(errIdentifier), err.error)
	} else if (_.isObject(err.error)) {
		Logger.error(ErrorTag(errIdentifier), JSON.stringify(err.error))
	} else {
		Logger.error(ErrorTag(errIdentifier), err.error)
	}
	return DataResponse(res, statusCode, undefined, message)
}

export function MissingParamsErrorHandler(missingParams: string[] | MissingParams, entity = '') {
	let errorMsg = `The following are missing/invalid${entity == '' ? ': ' : ` from ${entity}`}: `

	if (missingParams instanceof MissingParams) {
		errorMsg += missingParams.getReadableString()
		const errorList = missingParams.getMissingParams()
		throw new BadRequestError(errorMsg, errorList)
	} else {
		errorMsg += missingParams.join(', ')
	}

	throw new BadRequestError(errorMsg, missingParams)
}

export function CoreHttpErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	try {
		// *** Handle all User facing Errors *** //

		if (err instanceof UserFacingError) {
			HandleUserFacingError(err, req, res)
		}

		// *** Handle all Database Errors *** //
		else if (err instanceof DatabaseError) {
			HandleFatalErrors(
				{
					identifier: 'DATABASE_ERROR',
					error: err
				},
				res
			)
		}

		// *** Handle all Application Errors *** //
		else if (err instanceof ApplicationError) {
			HandleFatalErrors(
				{
					identifier: 'APPLICATION_ERROR',
					error: err
				},
				res
			)
		}

		// *** Handle all Javascript Errors *** //
		else if (err instanceof JsonWebTokenError) {
			HandleFatalErrors(
				{
					identifier: 'JWT_ERROR',
					error: err
				},
				res
			)
		}

		// *** Handle all Javascript Errors *** //
		else if (err instanceof Error) {
			HandleFatalErrors(
				{
					identifier: 'SYSTEM_ERROR',
					error: err
				},
				res
			)
		}

		// *** Handle all Unknown Errors *** //
		else {
			HandleFatalErrors(
				{
					identifier: 'UNKNOWN_ERROR',
					error: err
				},
				res
			)
		}
	} catch (exception) {
		const statusCode = exception.statusCode ?? 500
		const message = `Something went wrong. ER_${statusCode}_0`
		Logger.error(ErrorTag('UNKNOWN_ERROR'), exception)
		return DataResponse(res, statusCode, undefined, message)
	}
}
