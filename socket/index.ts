import express from "express"; // using express
import http from "http";
import redis from "socket.io-redis";
import { Socket } from "socket.io";
import { t } from "../sequelize/locales";
const socketIO = require("socket.io");
import Configs from "../configs";
import { IOEvents, createRoom, endCall } from "./events";
import { SocketData, SocketRoom } from "./models";

const socketConfig = Configs!.WSServerConfigurations;

declare module "socket.io" {
	interface Socket {
		t(message: string, ...args: any): string;
		locale: string;
		userId?: string;
		meetingId?: string;
	}
}

export const StartSocketServer = () => {
	let app = express();
	let server = http.createServer(app);

	// TODO: Setup Redis Adapter by downgrading Redis Client to 5.0 instead of 6.0
	// const adapter = redis({ host: "127.0.0.1", port: 6379 });

	let io = socketIO(server);
	// io.adapter(adapter);

	var rooms: SocketRoom = {};

	// make connection with user from server side
	io.on("connection", (socket: Socket) => {
		console.log("New user connected");

		socket.locale = "en";
		socket.t = (message: string, ...args: any) => {
			t.setLocale(socket.locale);
			return t.__(message, ...args);
		};

		socket.emit(IOEvents.CONNECT);
		socket.emit(IOEvents.SET_LANGUAGE);
		// socket.id

		socket.on(IOEvents.SET_LANGUAGE, (res: SocketData) => {
			console.log(IOEvents.SET_LANGUAGE, res);
			if (res.locale) {
				socket.locale = res.locale;
			} else {
				socket.locale = "en";
			}
		});

		socket.on(IOEvents.CREATE_ROOM, (res: SocketData) => {
			createRoom(socket, rooms, res);
		});
		socket.on(IOEvents.DISCONNECT, () => {
			console.log(IOEvents.DISCONNECT);
			endCall(socket, rooms);
		});
	});

	const port = socketConfig.port; // setting the port

	server.listen(port);
};
