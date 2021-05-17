import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const onScreenSharing = (socket: Socket) => {
	console.log(IOEvents.SCREEN_SHARING, socket.meetingId);

	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.SCREEN_SHARING);
	}
};
