import {
	NewMeetingSchema,
	NewMeetingSchemaType,
} from '../../../sequelize/validation-schema';
import { Participant } from '../../../sequelize/models/Participant';
import { SequelizeAttributes } from '../../../sequelize/types';
import { User } from '../../../sequelize/models/User';
import { Meeting } from '../../../sequelize/models/Meeting';

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
		meetingId: string | number,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | null> {

		let meetingIdType = typeof meetingId === 'number' ? '_meetingId' : 'meetingId';

		let options = {
			include: [
				{
					model: Participant,
					include: [User],
				},
			],
			where: {
				[meetingIdType]: meetingId,
			},
		};
		let meeting = await Meeting.findAllSafe<Meeting>(returns, options);
		return meeting;
	}

	static async newMeeting(
		meetingData: NewMeetingSchemaType,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | any | boolean> {
		await NewMeetingSchema.validateAsync(meetingData);

		let meetingUser = await User.findOne({
			where: {
				userId: meetingData.createdBy,
			},
		});

		let guestUser = await User.findOne({
			where: {
				userId: meetingData.guest,
			},
		});

		let newMeeting = await Meeting.create({
			...meetingData,
			createdBy: meetingUser!._userId,
		} as any);

		let participantsData: any = [
			{
				meetingId: newMeeting._meetingId,
				participantId: meetingUser!._userId
			},
			{
				meetingId: newMeeting._meetingId,
				participantId: guestUser?._userId
			},
		];

		let participants = await Participant.bulkCreate(participantsData);

		return this.getMeeting(newMeeting._meetingId);
	}
}
