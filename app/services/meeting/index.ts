import {
	NewMeetingSchema,
	NewMeetingSchemaType,
	RescheduleMeetingSchema,
} from "../../../sequelize/validation-schema";
import { Participant } from "../../../sequelize/models/Participant";
import { SequelizeAttributes } from "../../../sequelize/types";
import { User } from "../../../sequelize/models/User";
import { Meeting } from "../../../sequelize/models/Meeting";
import {
	BadRequestError,
	NotFoundError,
} from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";

import { Op } from "sequelize";

export class MeetingUtils {
	static async getAllUserMeetings(
		userId: string,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting[]> {
		let meetingIds = await Participant.findAll({
			include: [
				{
					model: User,
					where: {
						userId,
					},
				},
			],
			attributes: ["meetingId"],
		});

		let options: any = {
			include: [
				{
					model: Participant,
					include: [User],
				},
				User,
			],
			where: {
				_meetingId: { [Op.in]: meetingIds.map((m) => m.meetingId) },
			},
		};

		let meetings = await Meeting.findAllSafe<Meeting[]>(returns, options);

		return meetings;
	}

	static async getMeeting(
		meetingId: string | number,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | null> {
		let meetingIdType =
			typeof meetingId === "number" ? "_meetingId" : "meetingId";

		let options = {
			include: [
				{
					model: Participant,
					include: [User],
				},
				User,
			],
			where: {
				[meetingIdType]: meetingId,
			},
		};

		let meeting = await Meeting.findOneSafe<Meeting>(returns, options);
		return meeting;
	}

	static async newMeeting(
		meeting: NewMeetingSchemaType,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | null> {
		try {
			await NewMeetingSchema.validateAsync(meeting);

			let users = await User.findAll({
				where: {
					userId: { [Op.in]: [meeting.createdBy, meeting.guest] },
				},
				attributes: ["_userId", "userId"],
			});

			let meetingUser = users.find(
				(x: User) => x.userId === meeting.createdBy
			);
			let guestUser = users.find((x: User) => x.userId === meeting.guest);

			if (!meetingUser) throw new NotFoundError("User not found");
			if (!guestUser) throw new NotFoundError("Guest not found");

			let participantsData: any = [
				{
					participantId: meetingUser!._userId,
				},
				{
					participantId: guestUser?._userId,
				},
			];

			let newMeeting = await Meeting.create(
				{
					...meeting,
					createdBy: meetingUser!._userId,
					participants: participantsData,
				} as any,
				{
					include: [Participant],
				}
			);

			return this.getMeeting(newMeeting._meetingId, returns);
		} catch (error) {
			throw error;
		}
	}

	private static async updateMeetingCore(meeting: Meeting): Promise<any> {
		return await Meeting.update(meeting, {
			where: {
				meetingId: meeting.meetingId,
			},
		});
	}

	static async acceptOrRejectOrRescheduleMeeting(
		meeting: any,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | null> {
		let tempMeeting = await this.getMeeting(meeting.meetingId);
		if (!tempMeeting) {
			throw new BadRequestError(...a("No meeting found", ""));
		}

		if (
			(tempMeeting.user.userId == meeting.userId &&
				(tempMeeting.status == "pending" ||
					meeting.status == "rescheduled")) ||
			(tempMeeting.status == "rescheduled" &&
				meeting.status == "rejected")
		) {
			throw new BadRequestError(
				...a(
					"You are not authorized to %s this meeting",
					meeting.status
				)
			);
		}

		if (
			tempMeeting.user.userId != meeting.userId &&
			tempMeeting.status == "rescheduled"
		) {
			throw new BadRequestError(
				...a(
					"You are not authorized to %s this meeting",
					meeting.status
				)
			);
		}

		if (
			tempMeeting?.status == "pending" &&
			meeting.status == "rescheduled"
		) {
			delete meeting.userId;
			await RescheduleMeetingSchema.validateAsync(meeting);
			await this.updateMeetingCore(meeting as any);
		} else if (
			tempMeeting?.status == "pending" ||
			tempMeeting.status == "rescheduled"
		) {
			await this.updateMeetingCore(meeting as any);
		} else {
			throw new BadRequestError(
				...a("This meeting cannot be %s", meeting.status)
			);
		}

		return await this.getMeeting(meeting.meetingId, returns);
	}

	static async cancelMeetingByUuid(
		meetingId: string,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | any> {
		let tempMeeting = await this.getMeeting(meetingId);
		if (!tempMeeting) {
			throw new BadRequestError(...a("No meeting found", ""));
		}
		let checkStatus = ["accepted", "rejected", "cancelled"];
		if (checkStatus.find((s) => s == tempMeeting?.status)) {
			throw new BadRequestError(
				...a("This meeting cannot be %s", "cancelled")
			);
		}

		await this.updateMeetingCore({
			meetingId: meetingId,
			status: "cancelled",
		} as any);
		return await this.getMeeting(meetingId, returns);
	}

	static async getMeetingDatesOfUsers(
		userIds: number[],
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting[] | null> {
		console.log("USER_IDS", userIds);
		let meetingIds = await Participant.findAll({
			where: {
				participantId: { [Op.in]: userIds },
			},
			attributes: ["meetingId"],
		});
		console.log("Meetings_IDS", userIds);

		let meetings = await Meeting.findAll({
			where: {
				_meetingId: { [Op.in]: meetingIds.map((m) => m.meetingId) },
				status: "accepted",
			},
			attributes: ["scheduledAt"],
		});
		return meetings;
	}
}
