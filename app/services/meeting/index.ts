import { NewMeetingSchema } from "../../../sequelize/validation-schema";
import { Participant } from "../../../sequelize/models/Participant";
import { SequelizeAttributes } from "../../../sequelize/types";
import { User } from "../../../sequelize/models/User";
import { Meeting } from "../../../sequelize/models/Meeting";

export class MeetingUtils {
	static async getAllMeetings(
		userId?: string,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting[]> {
		let whereObj = {};
		if (userId) {
			whereObj = {
				participantId: userId,
			};
		}
		let options = {
			include: [
				{
					model: Participant,
					include: [User],
					where: whereObj,
				},
			],
		};
		let meetings = await Meeting.findAllSafe<Meeting[]>(returns, options);
		return meetings;
	}

	static async getMeeting(
		meetingId: string,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | null> {
		let options = {
			include: [
				{
					model: Participant,
					include: [User],
				},
			],
			where: {
				meetingId: meetingId,
			},
		};
		let meeting = await Meeting.findAllSafe<Meeting>(returns, options);
		return meeting;
	}

	static async newMeeting(
		meetingData: any,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | any | boolean> {
		await NewMeetingSchema.validateAsync(meetingData);

		let newMeeting = await Meeting.create(meetingData);

		return newMeeting;
	}
}
