import {
	NewMeetingSchema,
	NewMeetingSchemaType,
	updateMeetingSchemaType,
	CancelMeetingSchema,
	RescheduleMeetingSchema,
} from "../../../sequelize/validation-schema";
import { Participant } from "../../../sequelize/models/Participant";
import { SequelizeAttributes } from "../../../sequelize/types";
import { User } from "../../../sequelize/models/User";
import { Meeting } from "../../../sequelize/models/Meeting";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { a } from "../../locales";

export class MeetingUtils {
	static async getAllUserMeetings(
		userId: string,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting[]> {
		let user = await User.findOne({
			where: {
				userId: userId,
			},
		});
		let options = {
			include: [
				{
					model: Participant,
					include: [User],
					where: {
						participantId: user?._userId,
					},
				},
				User,
			],
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
		await NewMeetingSchema.validateAsync(meeting);

		let users = await User.findAll({
			where: {
				userId: [meeting.createdBy, meeting.guest],
			},
		});

		let meetingUser = users.find(
			(x: User) => x.userId === meeting.createdBy
		);
		let guestUser = users.find((x: User) => x.userId === meeting.guest);

		if (!meetingUser) throw new NotFoundError("User not found");
		if (!guestUser) throw new NotFoundError("Guest not found");

		let newMeeting = await Meeting.create({
			...meeting,
			createdBy: meetingUser!._userId,
		} as any);

		let participantsData: any = [
			{
				meetingId: newMeeting._meetingId,
				participantId: meetingUser!._userId,
			},
			{
				meetingId: newMeeting._meetingId,
				participantId: guestUser?._userId,
			},
		];

		let participants = await Participant.bulkCreate(participantsData);

		return this.getMeeting(newMeeting._meetingId, returns);
	}

	private static async updateMeetingCore(meeting: Meeting): Promise<any> {
		return await Meeting.update(meeting, {
			where: {
				meetingId: meeting.meetingId,
			},
		});
	}

	static async acceptOrRejectMeeting(
		meeting: Meeting,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | null> {
		let tempMeeting = await this.getMeeting(meeting.meetingId);
		if (!tempMeeting) {
			throw new BadRequestError(a("No meeting found", ""));
		}
		console.log("temp meet", tempMeeting);
		if (tempMeeting?.status == "pending") {
			await this.updateMeetingCore(meeting);
		} else {
			throw new BadRequestError(
				a("This meeting cannot be %s", meeting.status)
			);
		}

		return this.getMeeting(meeting.meetingId, returns);
	}

	static async cancelOrRescheduleMeeting(
		meeting: Meeting,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | any | boolean> {
		let tempMeeting = await this.getMeeting(meeting.meetingId);
		if (!tempMeeting) {
			throw new BadRequestError(a("No meeting found", ""));
		}

		if (tempMeeting?.status != "accepted") {
			throw new BadRequestError(
				a("This meeting cannot be %s", meeting.status)
			);
		}

		if (meeting.status == "rescheduled") {
			await RescheduleMeetingSchema.validateAsync(meeting);
		} else if (meeting.status == "cancelled") {
			await CancelMeetingSchema.validateAsync(meeting);
		}

		await this.updateMeetingCore(meeting);
		return this.getMeeting(meeting.meetingId, returns);
	}
}
