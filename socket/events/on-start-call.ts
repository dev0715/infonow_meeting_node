import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const startCall = (socket: Socket) => {
	console.log(IOEvents.START_CALL, socket.meetingId);

	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.START_CALL);
		socket.emit(IOEvents.START_CALL);
	}
};
