import {
	NewMeetingFeedbackSchema,
	NewMeetingFeedbackSchemaType,
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
import moment from "moment";
import { MeetingUtils } from "..";
import { MeetingFeedback } from "../../../sequelize/models/MeetingFeedback";

export class MeetingFeedbackUtils {
	static async newFeedback(
		feedback: NewMeetingFeedbackSchemaType,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<Boolean | any> {
		await NewMeetingFeedbackSchema.validateAsync(feedback);

		let meeting = await MeetingUtils.getMeeting(
			feedback.meetingId,
			SequelizeAttributes.WithIndexes
		);
		if (!meeting) throw new BadRequestError(...a("No meeting found", ""));
		let user = meeting.participants.find(
			(p: Participant) => p.user._userId == feedback.userId
		);
		if (!user)
			throw new BadRequestError(
				...a(
					"You are not authorized to %s this meeting",
					meeting.status
				)
			);

		let newFeedback = await MeetingFeedback.create({
			...feedback,
			meetingId: meeting._meetingId,
		} as any);
		return true;
	}
}
