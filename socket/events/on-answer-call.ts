import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const answerCall = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.ANSWER_CALL, res.meetingId);

	socket.to(res.meetingId).emit(IOEvents.RECEIVE_ANSWER, res.data);
};
