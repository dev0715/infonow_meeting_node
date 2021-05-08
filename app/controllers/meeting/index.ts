"use strict";
import { NextFunction, Request, Response } from "express";
import { DataResponse } from "../../utils/http-response";
import { MeetingUtils } from "../../services";
import { NotFoundError } from "../../utils/errors";

export async function getAllMeetings(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const meetings = await MeetingUtils.getAllMeetings();
		if (meetings.length > 0) return DataResponse(res, 200, meetings);
		throw new NotFoundError("No meeting found");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

/**@urlParams  /:userId */
export async function getAllUserMeetings(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		console.log("userId", req.params.userId);
		const meetings = await MeetingUtils.getAllMeetings(req.params.userId);
		if (meetings.length > 0) return DataResponse(res, 200, meetings);
		throw new NotFoundError("No meeting found");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

/**@urlParams  /:meetingId */
export async function getMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const meeting = await MeetingUtils.getMeeting(req.params.meetingId);
		if (meeting) return DataResponse(res, 200, meeting);
		throw new NotFoundError("No meeting found");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function newMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const meeting = await MeetingUtils.newMeeting(req.body);
		if (meeting) return DataResponse(res, 200, meeting);

		throw new NotFoundError("No meeting found");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function updateMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// try {
	// 	const countries = await countryService.getAllCountries();
	// 	if (countries.length > 0) return DataResponse(res, 200, countries);
	// 	throw new NotFoundError("No countries found!");
	// } catch (err) {
	// 	// Handle Exception
	// 	return next(err);
	// }
}
