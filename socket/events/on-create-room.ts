import { Server, Socket } from "socket.io";
import { SocketData, SocketOffer } from "../models";
import { Redis } from "../../redis";
import { MeetingUtils } from "../../app/services";

import { IOEvents } from "./index";

import _ from "lodash";
import { isRoomEmpty } from "./utils";

export async function OnCreateRoom(
	io: Server,
	socket: Socket,
	res: SocketData
) {
	let meetingId = res.meetingId!;

	console.log(IOEvents.CREATE_ROOM, meetingId);

	// VERIFY AND VALIDATE USER BEFORE JOIN //
	let isMeeting = await isValidMeeting(socket, meetingId);
	if (!isMeeting) {
		let message = socket.t("No meeting found");
		return socket.emit(IOEvents.ROOM_NOT_FOUND, { message: message });
	}

	// To Check If Room Exists Or Not //
	if (!isRoomEmpty(io, meetingId)) {
		let message = socket.t("meeting already exists");
		return socket.emit(IOEvents.ROOM_EXIST, { message: message });
	}

	let meetingOffer: SocketOffer = {
		userId: socket.userId!,
		user: _.pick(socket.user, [
			"userId",
			"name",
			"roleId",
			"profilePicture",
		]),
		offer: res.data!,
	};

	Redis.getInstance().set(
		meetingId,
		JSON.stringify(meetingOffer),
		(err, res) => {
			// console.log("CREATE_ROOM_REDIS_SET_KEY", err, res);
			if (err || !res) {
				socket.leave(meetingId);
				return socket.emit(IOEvents.CREATE_ROOM);
			}
			if (res == "OK") {
				//ATTACH MEETING ID WITH SOCKET
				socket.meetingId = meetingId;
				socket.join(meetingId);
				return socket.emit(IOEvents.CALL_ON_WAIT);
			}
		}
	);
}

async function isValidMeeting(
	socket: Socket,
	meetingId: string
): Promise<Boolean> {
	let meeting = await MeetingUtils.getMeeting(meetingId);

	let validUser = meeting?.participants.find(
		(x) => x.user.userId === socket.userId!
	);

	if (meeting == null) {
		let message = socket.t("No meeting found");
		socket.emit(IOEvents.MEETING_NOT_FOUND, { message: message });
		return false;
	} else if (
		["pending", "rejected", "cancelled"].indexOf(meeting.status!) > -1
	) {
		let message = socket.t("meeting is %s", meeting.status);
		socket.emit(IOEvents.MEETING_NOT_ACTIVE, { message: message });
		return false;
	} else if (!validUser) {
		let message = socket.t("invalid participant");
		socket.emit(IOEvents.INVALID_PARTICIPANT, { message: message });
		return false;
	}

	return true;
}
