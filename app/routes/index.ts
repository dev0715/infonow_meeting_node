'use strict'
import  PublicRouter  from './public'
import { CoreHttpErrorHandler, RequestParameters } from '../controllers/errors'
import { DataResponse } from '../utils/http-response'
import express, { Request, Response, NextFunction, Router } from 'express'
import cors from 'cors'
import chalk from 'chalk'
const PRINT_REQUESTED_URL = true

declare module 'express' {
	interface Request {
	}
}

export default ((): Router => {
	const server = express.Router()

	server.use('*', (req: Request, res: Response, next: NextFunction) => {
		if (PRINT_REQUESTED_URL) console.log(`${req.method}: ${chalk.greenBright(chalk.bold(req.originalUrl))}`)
		return next()
	})

	server.use(cors())


	// Public Routes
	server.use(PublicRouter)

	// Global Http Error Handler
	server.use(CoreHttpErrorHandler)

	// Un-recognized Urls
	server.use((req: Request, res: Response) => {
		const params = RequestParameters(req)
		DataResponse(res, 404, { url: req.originalUrl, params }, 'The resource you are looking for is not found!')
	})

	return server
})()
