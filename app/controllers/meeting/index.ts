"use strict";
import { NextFunction, Request, Response } from "express";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { MeetingUtils } from "../../services";
import {
	NotFoundError,
	UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { Meeting } from "../../../sequelize/models/Meeting";
import { a } from "../../../sequelize/locales";
import { TokenCore } from "../../../sequelize/middlewares/auth/token";

/**@urlParams  /:userId */
export async function getAllUserMeetings(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const meetings = await MeetingUtils.getAllUserMeetings(
			req.params.userId
		);
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
		let newMeeting = req.body;
		newMeeting.createdBy = req.CurrentUser?.userId;

		const meeting = await MeetingUtils.newMeeting(newMeeting);
		if (meeting) return DataResponse(res, 200, meeting);

		throw new NotFoundError("Failed to add meeting, try again");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function acceptOrRejectMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let meeting: any = {
			meetingId: req.params.meetingId,
			status: req.params.type,
			userId: req.CurrentUser?.userId,
		};
		const updatedMeeting = await MeetingUtils.acceptOrRejectMeeting(
			meeting
		);
		if (updatedMeeting) return DataResponse(res, 200, updatedMeeting);
		throw new NotFoundError("Failed to update meeting, try again");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function cancelOrRescheduleMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let meeting: any = {
			...req.body,
			meetingId: req.params.meetingId,
			status: req.params.type,
		};
		const updatedMeeting = await MeetingUtils.cancelOrRescheduleMeeting(
			meeting
		);
		if (updatedMeeting) return DataResponse(res, 200, updatedMeeting);
		throw new NotFoundError("Failed to update meeting, try again");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function getMeetingToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let meetingTokenData = {
			userId: req.CurrentUser?.userId,
		};

		let token = await TokenCore.IssueJWT(meetingTokenData, 86400 * 2);
		return DataResponse(res, 200, token);
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}
