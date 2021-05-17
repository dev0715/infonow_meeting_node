import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const answerCall = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.ANSWER_CALL, socket.meetingId);

	socket.to(socket.meetingId!).emit(IOEvents.RECEIVE_ANSWER, res.data);
};
