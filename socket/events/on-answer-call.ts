import _ from "lodash";
import { Socket } from "socket.io";
import { Logger } from "../../sequelize/utils/logger";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnAnswerCall = (socket: Socket, res: SocketData) => {
	try {
		console.log(IOEvents.ANSWER_CALL, socket.meetingId);
		if (socket.meetingId && res.data) {
			socket.to(socket.meetingId).emit(IOEvents.RECEIVE_ANSWER, {
				answer: res.data,
				user: _.pick(socket.user, [
					"userId",
					"name",
					"roleId",
					"profilePicture",
				]),
			});
		} else {
			socket.disconnect();
		}
	} catch (error) {
		Logger.error(error);
	}
};
