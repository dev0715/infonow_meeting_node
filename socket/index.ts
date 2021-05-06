import express from "express"; // using express
import http from "http";
import { Socket } from "socket.io";
const socketIO = require("socket.io");
import Configs from "../configs";
import { IOEvents, createRoom, joinRoom, answerCall, startCall, createIceEventData, disconnect } from "./events";
import { SocketData, SocketRoom } from "./models";

const socketConfig = Configs!.WSServerConfigurations;

export const StartSocketServer = () => {
	let app = express();
	let server = http.createServer(app);
	let io = socketIO(server);

	var rooms: SocketRoom = {};

	// make connection with user from server side
	io.on("connection", (socket: Socket) => {
		console.log("New user connected");

		socket.emit(IOEvents.CONNECT);
		// socket.id

		socket.on(IOEvents.CREATE_ROOM, (res: SocketData) => {
			createRoom(socket, rooms, res);
		});
	});

	const port = socketConfig.port; // setting the port

	server.listen(port);
};
