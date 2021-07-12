import { SequelizeAttributes } from "../../../sequelize/types";
import { User } from "../../../sequelize/models/User";

export class UserUtils {
	static async getUserByUuid(
		userId: string,
		returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
	): Promise<User> {
		let user = await User.findOneSafe<User>(returns, {
			where: {
				userId: userId,
			},
		});
		return user;
	}
}
