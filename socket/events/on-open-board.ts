import { Socket } from "socket.io";
import { Logger } from "../../sequelize/utils/logger";
import { IOEvents } from "./index";

export const OnOpenBoard = (socket: Socket) => {
	try {
		console.log(IOEvents.OPEN_BOARD, socket.meetingId);
		if (socket.meetingId)
			socket
				.to(socket.meetingId)
				.emit(IOEvents.OPEN_BOARD, { userId: socket.userId });
	} catch (error) {
		Logger.error(error);
	}
};
