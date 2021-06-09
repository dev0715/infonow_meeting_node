import { Socket } from "socket.io";
import { MeetingUtils } from "../../app/services";
import { Logger } from "../../sequelize/utils/logger";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnReconnecting = async (socket: Socket, data: SocketData) => {
	try {
		console.log(IOEvents.RECONNECTING, data);
		if (data.meetingId) {
			let meeting = await MeetingUtils.getMeeting(data.meetingId);
			let validUser = meeting?.participants.find(
				(x) => x.user.userId === socket.userId!
			);
			if (validUser) {
				socket.meetingId = data.meetingId;
				socket.join(data.meetingId);
				socket.emit(IOEvents.RECONNECTING, { success: true });
				return;
			}
		}
		throw "meetingId not found";
	} catch (error) {
		Logger.error(error);
		socket.emit(IOEvents.RECONNECTING, { success: false });
	}
};
