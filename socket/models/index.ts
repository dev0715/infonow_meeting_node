export interface SocketData {
	token: string | null;
	userId: string | null;
	locale: string | null;
	type: string | null;
	meetingId: string;
	data: {} | null;
}

export interface SocketRoom {
	[key: string]: string;
}

export interface SocketOffer {
	userId: string | null;
	offer: {} | null;
}
