import { Socket } from "socket.io";
import { Redis } from "../../redis";
import { IOEvents } from "./index";

export const OnEndCall = (socket: Socket) => {
	console.log(IOEvents.END_CALL);
	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.END_CALL, socket.meetingId);
		socket.leave(socket.meetingId);
		console.log("ROOM_LEFT");
		Redis.getInstance().del(socket.meetingId);
	}
};
