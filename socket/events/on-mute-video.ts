import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const muteVideo = (socket: Socket) => {
	console.log(IOEvents.MUTE_VIDEO, socket.meetingId);

	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.MUTE_VIDEO);
	}
};
