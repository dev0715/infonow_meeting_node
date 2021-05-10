import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const createIceEventData = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.CREATE_ICE_EVENT_DATA, res.meetingId);

	socket.to(res.meetingId).emit(IOEvents.CREATE_ICE_EVENT_DATA, res.data);
};
