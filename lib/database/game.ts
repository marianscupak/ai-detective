import { and, asc, count, eq, or, sql } from 'drizzle-orm';

import {
	type DetectiveCaseBaseView,
	type DetectiveCase,
	type DetectiveCaseListItem
} from '@/types/case';
import {
	type ChatMessage,
	type GameSession,
	type GameStatus
} from '@/types/game';
import { db } from '@/db';
import {
	detectiveCase,
	caseCharacter,
	caseEvidence,
	gameSession,
	chatMessage
} from '@/db/schema/game-schema';
import { user } from '@/db/schema/auth-schema';

// ---------- CASES ----------

export const dbGetLeaderboardForCase = async (caseId: string) => {
	const sessions = await db
		.select({
			sessionId: gameSession.id,
			userId: gameSession.userId,
			userName: user.name,
			startedAt: gameSession.startedAt
		})
		.from(gameSession)
		.innerJoin(user, eq(user.id, gameSession.userId))
		.where(
			and(eq(gameSession.caseId, caseId), eq(gameSession.status, 'completed'))
		);

	const firstSessions = Object.values(
		sessions.reduce(
			(acc, s) => {
				if (!acc[s.userId] || s.startedAt < acc[s.userId].startedAt) {
					acc[s.userId] = s;
				}
				return acc;
			},
			{} as Record<string, (typeof sessions)[number]>
		)
	);

	const results = await Promise.all(
		firstSessions.map(async session => {
			const [{ count }] = await db
				.select({
					count: sql<number>`COUNT(${chatMessage.id})`
				})
				.from(chatMessage)
				.where(
					and(
						eq(chatMessage.gameSessionId, session.sessionId),
						eq(chatMessage.role, 'player')
					)
				);

			return {
				userId: session.userId,
				userName: session.userName,
				caseId,
				messageCount: count
			};
		})
	);

	results.sort((a, b) => a.messageCount - b.messageCount);
	return results;
};

export const dbGetAllDetectiveCases = async (): Promise<
	DetectiveCaseBaseView[]
> => {
	return await db.select().from(detectiveCase);
};

export const dbGetAllDetectiveCasesWithStatus = async (
	userId: string
): Promise<DetectiveCaseListItem[]> => {
	const cases = await dbGetAllDetectiveCases();

	const solvedSessions = await db
		.select({ caseId: gameSession.caseId })
		.from(gameSession)
		.where(
			and(eq(gameSession.userId, userId), eq(gameSession.status, 'completed'))
		);

	const solvedCaseIds = new Set(solvedSessions.map(s => s.caseId));

	return cases.map(c => ({
		...c,
		isSolvedForUser: solvedCaseIds.has(c.id)
	}));
};

export const dbGetAllCaseThemes = async (): Promise<string[]> => {
	const rows = await db
		.select({ theme: detectiveCase.theme })
		.from(detectiveCase);

	return Array.from(new Set(rows.map(r => r.theme)));
};

export const getOngoingUserInvestigations = async (userId: string) => {
	return await db
		.select({
			caseId: detectiveCase.id,
			caseTitle: detectiveCase.title,
			sessionId: gameSession.id,
			startedAt: gameSession.startedAt,
			progress: gameSession.progress
		})
		.from(detectiveCase)
		.innerJoin(gameSession, eq(detectiveCase.id, gameSession.caseId))
		.where(
			and(eq(gameSession.userId, userId), eq(gameSession.status, 'in-progress'))
		);
};

export const getCompletedUserInvestigations = async (userId: string) => {
	return await db
		.select({
			caseId: detectiveCase.id,
			caseTitle: detectiveCase.title,
			sessionId: gameSession.id,
			startedAt: gameSession.updatedAt,
			messages: count(chatMessage.id)
		})
		.from(detectiveCase)
		.innerJoin(gameSession, eq(detectiveCase.id, gameSession.caseId))
		.leftJoin(
			chatMessage,
			and(
				eq(gameSession.id, chatMessage.gameSessionId),
				eq(chatMessage.role, 'player')
			)
		)
		.where(
			and(eq(gameSession.userId, userId), eq(gameSession.status, 'completed'))
		);
};

export const getCaseById = async (
	caseId: string
): Promise<DetectiveCase | null> => {
	const [caseRow] = await db
		.select()
		.from(detectiveCase)
		.where(eq(detectiveCase.id, caseId));

	if (!caseRow) return null;

	const [characters, evidenceRows] = await Promise.all([
		db.select().from(caseCharacter).where(eq(caseCharacter.caseId, caseId)),
		db.select().from(caseEvidence).where(eq(caseEvidence.caseId, caseId))
	]);

	const player = characters.find(c => c.role === 'player');
	const victim = characters.find(c => c.role === 'victim');
	const suspects = characters.filter(c => c.role === 'suspect');

	if (!player || !victim) {
		console.warn('[DB] Case is missing player or victim character', { caseId });
	}

	const result: DetectiveCase = {
		id: caseRow.id,
		authorId: caseRow.authorId,
		createdAt: new Date(caseRow.createdAt).toISOString(),

		title: caseRow.title,
		theme: caseRow.theme,
		summary: caseRow.summary,

		setting: {
			location: caseRow.location,
			dateTime: caseRow.dateTime,
			incident: caseRow.incident
		},

		characters: {
			player: player
				? {
						id: player.id,
						name: player.name,
						description: player.description
					}
				: {
						id: 'player-missing',
						name: 'Unknown Detective',
						description: 'Player character not defined in DB.'
					},
			victimOrTarget: {
				name: victim?.name ?? 'Unknown Victim or Target',
				description: victim?.description ?? 'Victim / target not defined in DB.'
			},
			suspects: suspects.map(s => ({
				id: s.id,
				name: s.name,
				description: s.description
			}))
		},

		evidence: evidenceRows.map(e => ({
			id: e.id,
			description: e.description,
			location: e.location,
			significance: e.significance
		})),

		solution: {
			culpritCharacterId: caseRow.culpritCharacterId,
			motive: caseRow.motive,
			method: caseRow.method
		},

		notesForAI: caseRow.notesForAI ?? undefined
	};

	return result;
};

// ---------- GAME SESSIONS ----------

export const dbUserHasCompletedCase = async (
	userId: string,
	caseId: string
): Promise<boolean> => {
	const result = await db
		.select({ id: gameSession.id })
		.from(gameSession)
		.where(
			and(
				eq(gameSession.userId, userId),
				eq(gameSession.caseId, caseId),
				eq(gameSession.status, 'completed')
			)
		)
		.limit(1);

	return result.length > 0;
};

export const findOrCreateGameSession = async (
	userId: string,
	caseId: string
): Promise<GameSession> => {
	const [existing] = await db
		.select()
		.from(gameSession)
		.where(
			and(
				eq(gameSession.userId, userId),
				eq(gameSession.caseId, caseId),
				or(
					eq(gameSession.status, 'completed'),
					eq(gameSession.status, 'in-progress')
				)
			)
		)
		.limit(1);

	if (existing) {
		return {
			id: existing.id,
			userId: existing.userId,
			caseId: existing.caseId,
			status: existing.status as GameSession['status'],
			startedAt: new Date(existing.startedAt),
			updatedAt: new Date(existing.updatedAt),
			progress: existing.progress ?? 0
		};
	}

	const id = crypto.randomUUID();
	const now = new Date();

	await db.insert(gameSession).values({
		id,
		userId,
		caseId,
		status: 'in-progress',
		startedAt: now,
		updatedAt: now
	});

	return {
		id,
		userId,
		caseId,
		status: 'in-progress',
		startedAt: now,
		updatedAt: now,
		progress: 0
	};
};

export const updateGameSessionStatus = async (
	gameSessionId: string,
	status: GameStatus
): Promise<void> => {
	await db
		.update(gameSession)
		.set({ status })
		.where(eq(gameSession.id, gameSessionId));
};

export const updateGameSessionProgress = async (
	gameSessionId: string,
	progress: number
): Promise<void> => {
	await db
		.update(gameSession)
		.set({ progress })
		.where(eq(gameSession.id, gameSessionId));
};

export const getGameSessionById = async (
	gameSessionId: string
): Promise<GameSession | null> => {
	const [row] = await db
		.select()
		.from(gameSession)
		.where(eq(gameSession.id, gameSessionId));
	if (!row) return null;

	return {
		id: row.id,
		userId: row.userId,
		caseId: row.caseId,
		status: row.status as GameSession['status'],
		startedAt: new Date(row.startedAt),
		updatedAt: new Date(row.updatedAt),
		progress: row.progress ?? 0
	};
};

// ---------- CHAT HISTORY ----------

export const getChatHistory = async (
	gameSessionId: string
): Promise<ChatMessage[]> => {
	const rows = await db
		.select()
		.from(chatMessage)
		.where(eq(chatMessage.gameSessionId, gameSessionId))
		.orderBy(asc(chatMessage.createdAt));

	return rows.map(row => ({
		id: row.id,
		gameSessionId: row.gameSessionId,
		role: row.role as ChatMessage['role'],
		content: row.content,
		createdAt: new Date(row.createdAt),
		relevance: row.relevance,
		reasoning: row.reasoning,
		type: row.type as ChatMessage['type']
	}));
};

export const getChatHistoryCount = async (gameSessionId: string) => {
	const [messages] = await db
		.select({ count: count(chatMessage.id) })
		.from(chatMessage)
		.where(
			and(
				eq(chatMessage.gameSessionId, gameSessionId),
				eq(chatMessage.role, 'player')
			)
		);

	return messages.count;
};

export const saveNewMessage = async (
	message: Omit<ChatMessage, 'id' | 'createdAt' | 'type'> & {
		type?: ChatMessage['type'];
	}
): Promise<ChatMessage> => {
	const id = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
	const now = new Date();

	await db.insert(chatMessage).values({
		id,
		gameSessionId: message.gameSessionId,
		role: message.role,
		content: message.content,
		relevance: message.relevance,
		reasoning: message.reasoning,
		type: message.type ?? 'normal',
		createdAt: now
	});

	return {
		id,
		gameSessionId: message.gameSessionId,
		role: message.role,
		content: message.content,
		reasoning: message.reasoning,
		relevance: message.relevance,
		type: message.type ?? 'normal',
		createdAt: now
	};
};
