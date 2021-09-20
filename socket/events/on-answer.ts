import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnAnswer = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.ANSWER);
	if (socket.meetingId && res.data) {
		socket.to(socket.meetingId).emit(IOEvents.ANSWER, {
			data: res.data,
		});
	}
};

