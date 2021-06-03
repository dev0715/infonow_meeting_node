import { Socket } from "socket.io";
import { Logger } from "../../sequelize/utils/logger";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnCreateIceEventData = (socket: Socket, res: SocketData) => {
	try {
		console.log(IOEvents.CREATE_ICE_EVENT_DATA, socket.meetingId);
		if (socket.meetingId && res.data) {
			socket
				.to(socket.meetingId)
				.emit(IOEvents.CREATE_ICE_EVENT_DATA, { data: res.data });
		} else {
			socket.disconnect();
		}
	} catch (error) {
		Logger.error(error);
	}
};
