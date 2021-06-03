import { Server, Socket } from "socket.io";
import {
	IOEvents,
	OnAnswerCall,
	OnCloseBoard,
	OnCreateIceEventData,
	OnEndCall,
	OnJoinRoom,
	OnMuteAudio,
	OnMuteVideo,
	OnOpenBoard,
	OnScreenSharingDisabled,
	OnScreenSharingEnabled,
	OnStartCall,
	OnUnmuteAudio,
	OnUnmuteVideo,
} from ".";
import { User } from "../../sequelize";
import { TokenCore } from "../../sequelize/middlewares/auth/token";
import { SocketData } from "../models";
import { OnCreateRoom } from "./on-create-room";
import _ from "lodash";
import { OnNewAnswer } from "./on-new-answer";
import { OnNewOffer } from "./on-new-offer";
import { OnReconnecting } from "./on-reconnecting";

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
				data: _.pick(user, [
					"userId",
					"name",
					"roleId",
					"profilePicture",
				]),
			});

			// Attach Socket Events
			attachEvents(io, socket);
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

function attachEvents(io: Server, socket: Socket) {
	socket.on(IOEvents.CREATE_ROOM, (res) => OnCreateRoom(io, socket, res));
	socket.on(IOEvents.ROOM_JOIN, (res) => OnJoinRoom(io, socket, res));
	socket.on(IOEvents.ANSWER_CALL, (res) => OnAnswerCall(socket, res));
	socket.on(IOEvents.NEW_OFFER, (res) => OnNewOffer(socket, res));
	socket.on(IOEvents.NEW_ANSWER, (res) => OnNewAnswer(socket, res));

	socket.on(IOEvents.START_CALL, () => OnStartCall(socket));
	socket.on(IOEvents.END_CALL, () => OnEndCall(socket));
	socket.on(IOEvents.CREATE_ICE_EVENT_DATA, (res) =>
		OnCreateIceEventData(socket, res)
	);
	socket.on(IOEvents.MUTE_AUDIO, () => OnMuteAudio(socket));
	socket.on(IOEvents.UNMUTE_AUDIO, () => OnUnmuteAudio(socket));
	socket.on(IOEvents.MUTE_VIDEO, () => OnMuteVideo(socket));
	socket.on(IOEvents.UNMUTE_VIDEO, () => OnUnmuteVideo(socket));
	socket.on(IOEvents.SCREEN_SHARING_DISABLED, () =>
		OnScreenSharingDisabled(socket)
	);
	socket.on(IOEvents.SCREEN_SHARING_ENABLED, () =>
		OnScreenSharingEnabled(socket)
	);
	socket.on(IOEvents.OPEN_BOARD, () => OnOpenBoard(socket));
	socket.on(IOEvents.CLOSE_BOARD, () => OnCloseBoard(socket));

	socket.on(IOEvents.RECONNECTING, (res) => OnReconnecting(socket, res));
}
