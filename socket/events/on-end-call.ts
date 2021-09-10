import { Server, Socket } from "socket.io";
import { Redis } from "../../redis";
import { IOEvents } from "./index";
import { getClientsInRoom } from "./utils";

export const OnEndCall = (io: Server, socket: Socket) => {
	console.log(IOEvents.END_CALL);
	if (socket.meetingId) {
		// socket.to(socket.meetingId).emit(IOEvents.END_CALL, socket.meetingId);
		Redis.getInstance().set(socket.meetingId, "", (err, res) => {
			// console.log("CREATE_ROOM_REDIS_SET_KEY", err, res);
			if (err || !res) {
				console.log("Meeting Delete Error");
				socket.emit(IOEvents.CALL_ENDED, {
					name: socket.user?.name,
					error: err,
				});
			}
			if (res == "OK") {
				console.log("MEETING_DELETED");
				let clients = getClientsInRoom(io, socket.meetingId!);
				for (let client of clients ?? []) {
					let userSocket = io.sockets.sockets.get(client);
					if (userSocket) {
						console.log("SOCKET_CONNECTED_USER", userSocket!.user);
						userSocket.leave(userSocket.meetingId!);
						userSocket.meetingId = "";
						userSocket.emit(IOEvents.CALL_ENDED, {
							name: userSocket.user?.name,
						});
					}
				}
			}
		});

		// Redis.getInstance().del(socket.meetingId);
		// console.log("MEETING_DELETED");
	}
};
