import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnNewAnswer = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.NEW_ANSWER);
	if (socket.meetingId && res.data) {
		socket.to(socket.meetingId).emit(IOEvents.NEW_ANSWER, {
			newConnection: res.newConnection ?? false,
			data: res.data,
		});
	}
};
