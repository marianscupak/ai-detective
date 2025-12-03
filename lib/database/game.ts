import { and, asc, desc, eq, sql } from 'drizzle-orm';

import { type DetectiveCase } from '@/types/case';
import { type ChatMessage, type GameSession } from '@/types/game';
import { db } from '@/db';
import {
	detectiveCase,
	caseCharacter,
	caseEvidence,
	gameSession,
	chatMessage
} from '@/db/schema/game-schema';

// ---------- CASES ----------

export const getOngoingUserInvestigations = async (userId: string) => {
	return await db
		.select({
			caseId: detectiveCase.id,
			caseTitle: detectiveCase.title,
			caseTheme: detectiveCase.theme,
			sessionId: gameSession.id,
			startedAt: gameSession.startedAt,
			progress: chatMessage.progress
		})
		.from(detectiveCase)
		.innerJoin(gameSession, eq(detectiveCase.id, gameSession.caseId))
		.leftJoin(
			chatMessage,
			eq(
				chatMessage.id,
				sql`(
        			SELECT id
        			FROM "chat_message"
        			WHERE "chat_message".game_session_id = "game_session".id
        			ORDER BY created_at DESC
        			LIMIT 1
      			)`
			)
		)
		.where(
			and(eq(gameSession.userId, userId), eq(gameSession.status, 'in-progress'))
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
				eq(gameSession.status, 'in-progress')
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
			updatedAt: new Date(existing.updatedAt)
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
		updatedAt: now
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
		progress: row.progress,
		relevance: row.relevance
	}));
};

export const saveNewMessage = async (
	message: Omit<ChatMessage, 'id' | 'createdAt'>
): Promise<ChatMessage> => {
	const id = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
	const now = new Date();

	await db.insert(chatMessage).values({
		id,
		gameSessionId: message.gameSessionId,
		role: message.role,
		content: message.content,
		progress: message.progress,
		relevance: message.relevance,
		createdAt: now
	});

	return {
		id,
		gameSessionId: message.gameSessionId,
		role: message.role,
		content: message.content,
		progress: message.progress,
		relevance: message.relevance,
		createdAt: now
	};
};
