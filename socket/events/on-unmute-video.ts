import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const unmuteVideo = (socket: Socket) => {
	console.log(IOEvents.UNMUTE_VIDEO, socket.meetingId);

	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.UNMUTE_VIDEO);
	}
};
