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
		// io.clients
		//emit message from server to user
		socket.emit(IOEvents.CONNECT);
		// socket.id

		// listen for message from user
		socket.on(IOEvents.CREATE_ROOM, (res: SocketData) => {
			createRoom(socket, rooms, res);
		});

		// listen for message from user
		socket.on(IOEvents.ROOM_JOIN, (res: SocketData) => {
			joinRoom(socket, rooms, res);
		});

		socket.on(IOEvents.ANSWER_CALL, (res: SocketData) => {
			answerCall(socket, res);
		});

		socket.on(IOEvents.START_CALL, (res: SocketData) => {
			startCall(socket, res);
		});

		socket.on(IOEvents.CREATE_ICE_EVENT_DATA, (res: SocketData) => {
			createIceEventData(socket, res);
		});

		// when server disconnects from user
		socket.on(IOEvents.DISCONNECT, (res: SocketData) => {
			disconnect(socket, rooms, res);
		});
	});

	const port = socketConfig.port; // setting the port

	server.listen(port);
};
