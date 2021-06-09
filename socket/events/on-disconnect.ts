import { Socket } from "socket.io";
import { IOEvents } from "./index";

export const OnDisconnect = (socket: Socket) => {
	console.log(IOEvents.DISCONNECT);
};
