import { SequelizeAttributes } from "../../../sequelize/types";
import { User } from "../../../sequelize/models/User";
import { a } from "../../../sequelize/locales";
import { BadRequestError } from "../../../sequelize/utils/errors";
import { MeetingUtils } from "../meeting";

export class AdminUtils {
	private static async getAdmins(
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<User[]> {
		let admins = await User.findAllSafe<User[]>(returns, {
			where: {
				roleId: "admin",
			},
		});
		return admins;
	}

	static async getAdminForMeeting(): Promise<User> {
		let admins = await this.getAdmins(SequelizeAttributes.WithIndexes);
		if (admins.length == 0)
			throw new BadRequestError(
				...a("No admin available for meeting", "")
			);

		let meetings = await MeetingUtils.getAllMeetingsOfUsers(
			admins.map((a) => a._userId!)
		);
		let selectedAdmin = admins[0];
		let minMeetings = meetings.filter((m) =>
			m.participants.find((p) => p.user.userId == admins[0].userId)
		).length;

		admins.forEach((a) => {
			let totalMeetings = meetings.filter((m) =>
				m.participants.find((p) => p.user.userId == a.userId)
			).length;

			if (totalMeetings < minMeetings) {
				selectedAdmin = a;
				minMeetings = totalMeetings;
			}
		});
		return selectedAdmin;
	}
}
