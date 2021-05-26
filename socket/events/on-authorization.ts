import { Server, Socket } from "socket.io";
import { IOEvents } from ".";
import { User } from "../../sequelize";
import { TokenCore } from "../../sequelize/middlewares/auth/token";
import { SocketData } from "../models";
import { OnCreateRoom } from "./on-create-room";
import _ from "lodash";

async function authorizeUser(token: string) {
	let user = await TokenCore.Verify(token);
	return user as User;
}

export async function OnAuthorization(
	io: Server,
	socket: Socket,
	data: SocketData
) {
	try {
		if (data.authorization) {
			let user = await authorizeUser(data.authorization);
			socket.userId = user.userId;
			socket.user = user;

			console.log(`USER ${socket.userId} AUTHORIZED`);
			socket.emit(IOEvents.AUTHORIZATION, {
				success: true,
				data: _.pick(user, ["userId", "name", "roleId"]),
			});
			socket.on(IOEvents.CREATE_ROOM, (res) =>
				OnCreateRoom(io, socket, res)
			);
		} else {
			socket.emit(IOEvents.AUTHORIZATION, { success: false });
			socket.disconnect();
		}
	} catch (err) {
		console.log(err);
		socket.emit(IOEvents.AUTHORIZATION, { success: false });
		socket.disconnect();
	}
}
