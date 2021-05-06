import { Socket } from "socket.io";
import { SocketData, SocketRoom } from "../models";
import { Redis } from "../../redis";
import { IOEvents } from "./index";

export const createRoom = (socket: Socket, rooms: SocketRoom, res: SocketData) => {
	console.log(IOEvents.CREATE_ROOM, res.meetingId);

	if (rooms.hasOwnProperty(res.meetingId)) {
		socket.emit(IOEvents.ROOM_EXIST);
		return;
	}
	Redis.getInstance().set(res.meetingId, JSON.stringify(res.data));
	socket.join(res.meetingId);
	rooms[res.meetingId] = res.meetingId;
	socket.emit(IOEvents.ROOM_JOIN);
};
