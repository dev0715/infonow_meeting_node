import { Socket } from "socket.io";
import { SocketData, SocketRoom } from "../models";
import { Redis } from "../../redis";
import { IOEvents } from "./index";

export const disconnect = (socket: Socket, rooms: SocketRoom, res: SocketData) => {
	console.log(IOEvents.DISCONNECT);
	socket.to(res.meetingId).emit(IOEvents.DISCONNECT, res.meetingId);
	delete rooms[res.meetingId];
	Redis.getInstance().del(res.meetingId);
};
