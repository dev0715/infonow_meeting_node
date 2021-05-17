import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const unmuteAudio = (socket: Socket) => {
	console.log(IOEvents.UNMUTE_AUDIO, socket.meetingId);

	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.UNMUTE_AUDIO);
	}
};
