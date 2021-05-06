import { Socket } from "socket.io";
import { SocketData, SocketRoom } from "../models";
import { Redis } from "../../redis";
import { IOEvents } from "./index";

export const joinRoom = (socket: Socket, rooms: SocketRoom, res: SocketData) => {
	console.log(IOEvents.ROOM_JOIN, res.meetingId);

	if (!rooms.hasOwnProperty(res.meetingId)) {
		socket.emit(IOEvents.ROOM_NOT_FOUND);
		return;
	}
	console.log("Room found");
	Redis.getInstance().get(res.meetingId, (err: any, reply: any) => {
		if (err) {
			socket.emit(IOEvents.ROOM_NOT_FOUND);
			return;
		}
		let data = JSON.parse(reply);
		socket.join(res.meetingId);
		socket.emit(IOEvents.ROOM_JOIN, data);
	});
};
