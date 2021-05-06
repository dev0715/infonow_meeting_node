import { Socket } from "socket.io";
import { SocketData, SocketRoom } from "../models";
import { Redis } from "../../redis";

import { IOEvents, joinRoom, answerCall, startCall, createIceEventData, disconnect } from "./index";

export const createRoom = (socket: Socket, rooms: SocketRoom, res: SocketData) => {
	console.log(IOEvents.CREATE_ROOM, res.meetingId);

	// VERIFY AND VALIDATE USER BEFORE JOIN //

	socket.on(IOEvents.ROOM_JOIN, (res: SocketData) => {
		joinRoom(socket, rooms, res);
	});

	socket.on(IOEvents.ANSWER_CALL, (res: SocketData) => {
		answerCall(socket, res);
	});

	socket.on(IOEvents.START_CALL, (res: SocketData) => {
		startCall(socket, res);
	});

	socket.on(IOEvents.CREATE_ICE_EVENT_DATA, (res: SocketData) => {
		createIceEventData(socket, res);
	});

	socket.on(IOEvents.DISCONNECT, (res: SocketData) => {
		disconnect(socket, rooms, res);
	});

	// TO CHECK IF ROOM EXISTS OR NOT //

	if (rooms.hasOwnProperty(res.meetingId)) {
		socket.emit(IOEvents.ROOM_EXIST);
		return;
	}

	Redis.getInstance().set(res.meetingId, JSON.stringify(res.data));

	socket.join(res.meetingId);

	rooms[res.meetingId] = res.meetingId;

	socket.emit(IOEvents.CALL_ON_WAIT);
};
