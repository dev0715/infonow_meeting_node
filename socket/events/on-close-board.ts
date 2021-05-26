import { Socket } from "socket.io";
import { Logger } from "../../sequelize/utils/logger";
import { IOEvents } from "./index";

export const OnCloseBoard = (socket: Socket) => {
	try {
		console.log(IOEvents.CLOSE_BOARD, socket.meetingId);
		if (socket.meetingId)
			socket
				.to(socket.meetingId)
				.emit(IOEvents.CLOSE_BOARD, { userId: socket.userId });
	} catch (error) {
		Logger.error(error);
	}
};
