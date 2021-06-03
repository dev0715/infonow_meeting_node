import { Socket } from "socket.io";
import { Logger } from "../../sequelize/utils/logger";
import { IOEvents } from "./index";

export const OnScreenSharingDisabled = (socket: Socket) => {
	try {
		console.log(IOEvents.SCREEN_SHARING_DISABLED, socket.meetingId);
		if (socket.meetingId)
			socket.to(socket.meetingId).emit(IOEvents.SCREEN_SHARING_DISABLED);
	} catch (error) {
		Logger.error(error);
	}
};
