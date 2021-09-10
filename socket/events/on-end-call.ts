import { Server, Socket } from "socket.io";
import { Redis } from "../../redis";
import { IOEvents } from "./index";
import { getClientsInRoom } from "./utils";

export const OnEndCall = (io: Server, socket: Socket) => {
	console.log(IOEvents.END_CALL);
	if (socket.meetingId) {
		// socket.to(socket.meetingId).emit(IOEvents.END_CALL, socket.meetingId);
		let clients = getClientsInRoom(io, socket.meetingId);
		for (let client of clients ?? []) {
			let userSocket = io.sockets.sockets.get(client);
			if (userSocket) {
				console.log("SOCKET_CONNECTED_USER", userSocket!.user);
				userSocket.leave(socket.meetingId);
				userSocket.meetingId = "";
				userSocket.emit(IOEvents.CALL_ENDED, {
					name: userSocket.user?.name,
				});
			}
		}

		Redis.getInstance().del(socket.meetingId);
		console.log("MEETING_DELETED");
	}
};
