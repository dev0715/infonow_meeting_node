import { Server, Socket } from "socket.io";
import { SocketData, SocketOffer } from "../models";
import { Redis } from "../../redis";
import { IOEvents } from "./index";
import { getClientsInRoom } from "./utils";
import { Logger } from "../../sequelize/utils/logger";
import { BadRequestError } from "../../sequelize/utils/errors";

export function OnJoinRoom(io: Server, socket: Socket, res: SocketData) {
	try {
		let meetingId = res.meetingId!;
		console.log(IOEvents.ROOM_JOIN, meetingId);

		let clients = getClientsInRoom(io, meetingId);

		if (clients?.size === 0) {
			socket.leave(meetingId);
			return socket.emit(IOEvents.CREATE_ROOM);
		}

		console.log("clients found", clients?.size);

		Redis.getInstance().get(meetingId, (err: any, reply: any) => {
			// console.log("11111111111111111111111", err, reply);

			if (err) {
				socket.leave(meetingId);
				return socket.emit(IOEvents.CREATE_ROOM);
			}
			if (!reply) {
				socket.leave(meetingId);
				return socket.emit(IOEvents.ROOM_NOT_FOUND, {
					message: socket.t("No meeting found"),
				});
			}
			// console.log("22222222222222222222222", reply);
			let data: SocketOffer = JSON.parse(reply);
			if (!data.userId || !data.offer) {
				throw new BadRequestError("No meeting found");
			}
			let userAlreadyJoined = data.userId == socket.userId;

			if (userAlreadyJoined) {
				let message = socket.t("already joined on another client");
				socket.emit(IOEvents.ALREADY_JOINED, { message: message });
			} else {
				socket.meetingId = meetingId;
				socket.join(meetingId);

				socket.emit(IOEvents.ROOM_JOIN, { data: data.offer });

				socket.emit(IOEvents.JOINED_ROOM_AS_RECEIVER, {
					data: data.user,
				});
			}
		});
	} catch (error) {
		Logger.error(error);
		socket.leave(res.meetingId ?? "");
		socket.emit(IOEvents.ROOM_NOT_FOUND, {
			message: socket.t("No meeting found"),
			error: error,
		});
	}
}
