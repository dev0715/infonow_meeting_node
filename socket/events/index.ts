export * from "./on-create-room";
export * from "./on-join-room";
export * from "./on-answer-call";
export * from "./on-start-call";
export * from "./on-create-ice-event-data";
export * from "./on-disconnect";

export const IOEvents = {
	AUTHORIZATION: "AUTHORIZATION",
	CONNECT: "CONNECT",
	DISCONNECT: "DISCONNECT",
	CREATE_ROOM: "CREATE_ROOM",
	ROOM_JOIN: "ROOM_JOIN",
	ROOM_EXIST: "ROOM_EXIST",
	ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
	CALL_ON_WAIT: "CALL_ON_WAIT",
	START_CALL: "START_CALL",
	ANSWER_CALL: "ANSWER_CALL",
	RECEIVE_ANSWER: "RECEIVE_ANSWER",
	CREATE_ICE_EVENT_DATA: "CREATE_ICE_EVENT_DATA",
};
