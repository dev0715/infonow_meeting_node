import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const muteAudio = (socket: Socket) => {
	console.log(IOEvents.MUTE_AUDIO, socket.meetingId);

	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.MUTE_AUDIO);
	}
};
