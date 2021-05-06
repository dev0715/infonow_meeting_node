'use strict'

import chalk from 'chalk'

const themeError = chalk.red
const themeFatalError = chalk.bold.red
const themeSuccess = chalk.green
const themeSuccessBold = chalk.bold.green
const themeDebug = chalk.cyan
const themeInfo = chalk.white
const themInfoBold = chalk.whiteBright.bold

export enum LogType {
	Error,
	Debug,
	Info,
	Success
}

export type LogConfig = LogType[]

export class Logger {
	public static logConfig: LogConfig = [LogType.Error, LogType.Debug, LogType.Info, LogType.Success]

	private static coreLogger(chalker: any, args: any[], logType: LogType) {
		if (!(this.logConfig.indexOf(logType) > -1)) return
		for (let i = 0; i < args.length; ++i) {
			if (args[i] instanceof Error) {
				console.log(chalker(args[i].message))
				console.log(chalker(args[i].stack))
			} else {
				console.log(chalker(args[i]))
			}
		}
	}

	public static error(...args: any[]) {
		this.coreLogger(themeError, args, LogType.Error)
	}

	public static fatalError(...args: any[]) {
		this.coreLogger(themeFatalError, args, LogType.Error)
	}

	public static debug(...args: any[]) {
		this.coreLogger(themeDebug, args, LogType.Debug)
	}

	public static info(...args: any[]) {
		this.coreLogger(themeInfo, args, LogType.Info)
	}

	public static infoBright(...args: any[]) {
		this.coreLogger(themInfoBold, args, LogType.Info)
	}

	public static success(...args: any[]) {
		this.coreLogger(themeSuccess, args, LogType.Success)
	}

	public static successBold(...args: any[]) {
		this.coreLogger(themeSuccessBold, args, LogType.Success)
	}
}
