import { Socket } from "socket.io";
import { SocketData, SocketOffer, SocketRoom } from "../models";
import { Redis } from "../../redis";
import { MeetingUtils } from "../../app/services";

import {
	IOEvents,
	joinRoom,
	answerCall,
	startCall,
	createIceEventData,
	disconnect,
} from "./index";

export const createRoom = async (
	socket: Socket,
	rooms: SocketRoom,
	res: SocketData
) => {
	console.log(IOEvents.CREATE_ROOM, res.meetingId);

	// VERIFY AND VALIDATE USER BEFORE JOIN //
	let isMeeting = await checkMeeting(socket, res);
	if (!isMeeting) {
		return;
	}

	// ATTACH SOCKET EVENTS
	attachEvents(socket, rooms);

	// TO CHECK IF ROOM EXISTS OR NOT //

	if (rooms.hasOwnProperty(res.meetingId)) {
		let message = socket.t("meeting already exists");
		socket.emit(IOEvents.ROOM_EXIST, { message: message });
		return;
	}

	let meetingOffer: SocketOffer = {
		userId: res.userId,
		offer: res.data,
	};
	Redis.getInstance().set(res.meetingId, JSON.stringify(meetingOffer));

	socket.join(res.meetingId);

	rooms[res.meetingId] = res.meetingId;

	socket.emit(IOEvents.CALL_ON_WAIT);
};

async function checkMeeting(socket: Socket, res: SocketData): Promise<Boolean> {
	let meeting = await MeetingUtils.getMeeting(res.meetingId);

	let validUser = meeting?.participants.find(
		(x) => x.user.userId === res.userId
	);

	console.log("Valid_User", validUser);

	if (meeting == null) {
		let message = socket.t("No meeting found");
		socket.emit(IOEvents.MEETING_NOT_FOUND, { message: message });
		return false;
	} else if (
		meeting.status == "pending" ||
		meeting.status == "rejected" ||
		meeting.status == "cancelled"
	) {
		let message = socket.t("meeting is %s", meeting.status);
		socket.emit(IOEvents.MEETING_NOT_ACTIVE, { message: message });
		return false;
	} else if (!validUser) {
		let message = socket.t("invalid participant");
		socket.emit(IOEvents.INVALID_PARTICIPANT, { message: message });
		return false;
	}
	if (res.userId) {
		socket.userId = res.userId;
	}

	return true;
}

function attachEvents(socket: Socket, rooms: SocketRoom) {
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
}
