export type ChatMessageRole = 'player' | 'gameMaster';

export type ChatMessage = {
	id: string;
	role: ChatMessageRole;
	content: string;
};
