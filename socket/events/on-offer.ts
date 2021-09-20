import { Socket } from "socket.io";
import { SocketData } from "../models";
import { IOEvents } from "./index";

export const OnOffer = (socket: Socket, res: SocketData) => {
	console.log(IOEvents.OFFER);
	if (socket.meetingId && res.data) {
		socket.to(socket.meetingId).emit(IOEvents.OFFER, {
			data: res.data,
		});
	}
};
