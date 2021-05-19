import { Server, Socket } from "socket.io";
import { IOEvents } from ".";
import { SocketData } from "../models";
import { OnCreateRoom } from "./on-create-room";

export function OnAuthorization(io: Server, socket: Socket, data: SocketData) {
    // TODO: Authorize User and Join Room if user is valid
    try {
        if (data.authorization) {
            console.log("USER AUTHORIZED")
            //TODO: getUserId from authorization token
            socket.userId = data.authorization
            console.log(`USER ${socket.userId} AUTHORIZED`)
            socket.emit(IOEvents.AUTHORIZATION, { success: false })
            socket.on(IOEvents.CREATE_ROOM, res=>OnCreateRoom(io, socket, res))
        }
        else {
            socket.emit(IOEvents.AUTHORIZATION, { success: false })
            socket.disconnect()
        }
    }
    catch (err) {
        socket.emit(IOEvents.AUTHORIZATION, { success: false })
        socket.disconnect()
    }
    
}