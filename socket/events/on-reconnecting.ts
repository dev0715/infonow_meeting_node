import { Socket } from "socket.io";
import { Logger } from "../../sequelize/utils/logger";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnReconnecting = (socket: Socket, data: SocketData) => {
	try {
		console.log(IOEvents.RECONNECTING);
		if (data.meetingId) {
			socket.meetingId = data.meetingId;
			socket.join(data.meetingId);
			socket.emit(IOEvents.RECONNECTING, { success: true });
		}
		throw "meetingId not found";
	} catch (error) {
		Logger.error(error);
		socket.emit(IOEvents.RECONNECTING, { success: false });
	}
};
