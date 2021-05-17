import { Socket } from "socket.io";
import { SocketRoom } from "../models";
import { Redis } from "../../redis";
import { IOEvents } from "./index";

export const endCall = (socket: Socket, rooms: SocketRoom) => {
	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.END_CALL, socket.meetingId);
		delete rooms[socket.meetingId];
		Redis.getInstance().del(socket.meetingId);
		socket.leave(socket.meetingId);
	}
};
