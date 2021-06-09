import { Server, Socket } from "socket.io";
import { IOEvents } from ".";
import { t } from "../../sequelize/locales";
import { Logger } from "../../sequelize/utils/logger";
import { SocketData } from "../models";
import { OnAuthorization } from "./on-authorization";
import { OnDisconnect } from "./on-disconnect";

function OnLocaleSet(socket: Socket, data: SocketData = { locale: "en" }) {
	try {
		socket.locale = data.locale ?? "en";
		socket.t = (message: string, ...args: any) => {
			// t.setLocale(socket.locale);
			// return t.__(message, ...args);
			return message;
		};
	} catch (error) {
		Logger.error(error);
	}
}

export function OnConnect(io: Server, socket: Socket) {
	console.log("New User Connected");
	OnLocaleSet(socket);

	socket.on(IOEvents.AUTHORIZATION, (data) =>
		OnAuthorization(io, socket, data)
	);
	socket.on(IOEvents.SET_LANGUAGE, (data) => OnLocaleSet(socket, data));
	socket.on(IOEvents.DISCONNECT, () => OnDisconnect(socket));

	socket.emit(IOEvents.CONNECT);
}
