import {
	NewMeetingSchema,
	NewMeetingSchemaType,
} from '../../../sequelize/validation-schema';
import { Participant } from '../../../sequelize/models/Participant';
import { SequelizeAttributes } from '../../../sequelize/types';
import { User } from '../../../sequelize/models/User';
import { Meeting } from '../../../sequelize/models/Meeting';
import { NotFoundError } from '../../utils/errors';

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
		meeting: NewMeetingSchemaType,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Meeting | any | boolean> {
		await NewMeetingSchema.validateAsync(meeting);

		let users = await User.findAll({
			where: {
				userId: [meeting.createdBy, meeting.guest]
			}
		})
		
		let meetingUser = users.find(x => x.userId === meeting.createdBy)
		let guestUser = users.find(x => x.userId === meeting.guest)

		if (!meetingUser) throw new NotFoundError("User not found")
		if(!guestUser) throw new NotFoundError("User not found")
		
		let newMeeting = await Meeting.create({
			...meeting,
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

		return this.getMeeting(newMeeting._meetingId, returns);
	}
}
