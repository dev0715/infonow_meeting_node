import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnNewOffer = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.NEW_OFFER);
	if (socket.meetingId && res.data) {
		socket.to(socket.meetingId).emit(IOEvents.NEW_OFFER, {
			newConnection: res.newConnection ?? false,
			data: res.data,
		});
	}
};
