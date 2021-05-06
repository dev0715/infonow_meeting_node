import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const startCall = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.START_CALL, res.meetingId);

	socket.to(res.meetingId).emit(IOEvents.START_CALL);
	socket.emit(IOEvents.START_CALL);
};
