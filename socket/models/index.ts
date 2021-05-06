export interface SocketData {
	type: string | null;
	meetingId: string;
	data: {} | null;
}

export interface SocketRoom {
	[key: string]: string;
}
