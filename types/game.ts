import { z } from 'zod';

/**
 * Represents the status of a user's playthrough of a single case.
 */
export type GameStatus = 'in-progress' | 'solved' | 'abandoned';

/**
 * Represents a single user's attempt at solving a case. This object tracks the
 * overall state of a game, linking a user to a case.
 */
export type GameSession = {
	/** A unique identifier for this specific game session (e.g., a UUID or database ID). */
	id: string;

	/** The ID of the user who is playing this session. */
	userId: string;

	/** The ID of the DetectiveCase being played. */
	caseId: string;

	/** The current status of the game session. */
	status: GameStatus;

	/** The date and time when the session was first started. */
	startedAt: Date;

	/** The date and time of the last interaction in this session. */
	updatedAt: Date;
};

/**
 * Represents the speaker of a message in the chat.
 */
export type ChatMessageRole = 'player' | 'gameMaster';

/**
 * Represents a single message within a GameSession's chat history.
 */
export type ChatMessage = {
	/** A unique identifier for the message itself. */
	id: string;

	/** The ID of the GameSession this message belongs to. */
	gameSessionId: string;

	/** Who sent the message (the player or the AI). */
	role: ChatMessageRole;

	/** The text content of the message. */
	content: string;

	/** The date and time when the message was created. */
	createdAt: Date;

	relevance?: number | null;

	progress?: number | null;
};

export const aiResponseSchema = z.object({
	narrativeResponse: z.string(),
	relevance: z.number(),
	progress: z.number(),
	reasoning: z.string()
});

export type AiResponse = z.infer<typeof aiResponseSchema>;
