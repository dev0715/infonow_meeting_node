import { Socket } from "socket.io";
import { Logger } from "../../sequelize/utils/logger";
import { IOEvents } from "./index";

export const OnScreenSharingEnabled = (socket: Socket) => {
	try {
		console.log(IOEvents.SCREEN_SHARING_ENABLED, socket.meetingId);
		if (socket.meetingId)
			socket
				.to(socket.meetingId)
				.emit(IOEvents.SCREEN_SHARING_ENABLED, {
					userId: socket.userId,
				});
	} catch (error) {
		Logger.error(error);
	}
};
