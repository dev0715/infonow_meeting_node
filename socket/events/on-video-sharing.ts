import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const onVideoSharing = (socket: Socket) => {
	console.log(IOEvents.VIDEO_SHARING, socket.meetingId);

	if (socket.meetingId) {
		socket.to(socket.meetingId).emit(IOEvents.VIDEO_SHARING);
	}
};
