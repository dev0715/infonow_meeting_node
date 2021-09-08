"use strict";
import { NextFunction, Request, Response } from "express";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { AdminUtils, MeetingUtils, UserUtils } from "../../services";
import {
	NotFoundError,
	UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { Meeting } from "../../../sequelize/models/Meeting";
import { a } from "../../../sequelize/locales";
import { TokenCore } from "../../../sequelize/middlewares/auth/token";
import { SequelizeAttributes } from "../../../sequelize/types";
import { MeetingFeedbackUtils } from "../../services/meeting-feedback";

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

export async function getAdminMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const meeting = await MeetingUtils.getAdminMeeting(req.params.userId);
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

export async function newAdminMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let admin = await AdminUtils.getAdminForMeeting();
		let newMeeting = {
			...req.body,
			createdBy: req.CurrentUser?._userId,
			guest: admin._userId,
		};

		const meeting = await MeetingUtils.newAdminMeeting(newMeeting);
		if (meeting) return DataResponse(res, 200, meeting);

		throw new NotFoundError("Failed to add meeting, try again");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function acceptOrRejectOrRescheduleMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let meeting: any = {
			...req.body,
			meetingId: req.params.meetingId,
			status: req.params.type,
			userId: req.CurrentUser?.userId,
		};
		const updatedMeeting =
			await MeetingUtils.acceptOrRejectOrRescheduleMeeting(meeting);
		if (updatedMeeting) return DataResponse(res, 200, updatedMeeting);
		throw new NotFoundError("Failed to update meeting, try again");
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function cancelMeeting(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const updatedMeeting = await MeetingUtils.cancelMeetingByUuid(
			req.params.meetingId
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
			_userId: req.CurrentUser?._userId,
			userId: req.CurrentUser?.userId,
			roleId: req.CurrentUser?.roleId,
		};

		let token = await TokenCore.IssueJWT(meetingTokenData, 86400 * 2);
		return DataResponse(res, 200, token);
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function getUsersMeetingDates(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let user = await UserUtils.getUserByUuid(
			req.params.guest,
			SequelizeAttributes.WithIndexes
		);
		let dates = await MeetingUtils.getMeetingDatesOfUsers([
			req.CurrentUser?._userId!,
			user._userId!,
		]);
		return DataResponse(res, 200, dates);
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}

export async function newMeetingFeedback(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let feedback = req.body;
		feedback.userId = req.CurrentUser?._userId;
		let newFeedback = await MeetingFeedbackUtils.newFeedback(feedback);
		return DataResponse(res, 200, newFeedback);
	} catch (err) {
		// Handle Exception
		return next(err);
	}
}
