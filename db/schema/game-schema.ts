import { relations, sql } from 'drizzle-orm';
import {
	sqliteTable,
	text,
	integer,
	index,
	real
} from 'drizzle-orm/sqlite-core';

import { user } from './auth-schema';

// ---------- CASES ----------

export const detectiveCase = sqliteTable('detective_case', {
	id: text('id').primaryKey(),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),

	title: text('title').notNull(),
	theme: text('theme').notNull(),
	summary: text('summary').notNull(),

	// setting
	location: text('location').notNull(),
	dateTime: text('date_time').notNull(),
	incident: text('incident').notNull(),

	// solution
	culpritCharacterId: text('culprit_character_id').notNull(),
	motive: text('motive').notNull(),
	method: text('method').notNull(),

	notesForAI: text('notes_for_ai')
});

export const detectiveCaseRelations = relations(detectiveCase, ({ many }) => ({
	characters: many(caseCharacter),
	evidence: many(caseEvidence),
	sessions: many(gameSession)
}));

// ---------- CHARACTERS ----------

export const caseCharacter = sqliteTable('case_character', {
	id: text('id').primaryKey(), // can be your char-xxx ids
	caseId: text('case_id')
		.notNull()
		.references(() => detectiveCase.id, { onDelete: 'cascade' }),

	// 'player' | 'suspect' | 'victim'
	role: text('role').notNull(),
	name: text('name').notNull(),
	description: text('description').notNull()
});

export const caseCharacterRelations = relations(caseCharacter, ({ one }) => ({
	case: one(detectiveCase, {
		fields: [caseCharacter.caseId],
		references: [detectiveCase.id]
	})
}));

// ---------- EVIDENCE ----------

export const caseEvidence = sqliteTable('case_evidence', {
	id: text('id').primaryKey(), // ev-xxx
	caseId: text('case_id')
		.notNull()
		.references(() => detectiveCase.id, { onDelete: 'cascade' }),

	description: text('description').notNull(),
	location: text('location').notNull(),
	significance: text('significance').notNull()
});

export const caseEvidenceRelations = relations(caseEvidence, ({ one }) => ({
	case: one(detectiveCase, {
		fields: [caseEvidence.caseId],
		references: [detectiveCase.id]
	})
}));

// ---------- GAME SESSIONS ----------

export const gameSession = sqliteTable(
	'game_session',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		caseId: text('case_id')
			.notNull()
			.references(() => detectiveCase.id, { onDelete: 'cascade' }),

		// 'in-progress' | 'completed' | 'abandoned'
		status: text('status').notNull(),

		startedAt: integer('started_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	table => [index('game_session_user_case_idx').on(table.userId, table.caseId)]
);

export const gameSessionRelations = relations(gameSession, ({ one, many }) => ({
	user: one(user, {
		fields: [gameSession.userId],
		references: [user.id]
	}),
	case: one(detectiveCase, {
		fields: [gameSession.caseId],
		references: [detectiveCase.id]
	}),
	messages: many(chatMessage)
}));

// ---------- CHAT MESSAGES ----------

export const chatMessage = sqliteTable(
	'chat_message',
	{
		id: text('id').primaryKey(),
		gameSessionId: text('game_session_id')
			.notNull()
			.references(() => gameSession.id, { onDelete: 'cascade' }),

		// 'player' | 'gameMaster'
		role: text('role').notNull(),
		content: text('content').notNull(),

		relevance: real('relevance'),
		progress: real('progress'),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	table => [index('chat_message_session_idx').on(table.gameSessionId)]
);

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
	session: one(gameSession, {
		fields: [chatMessage.gameSessionId],
		references: [gameSession.id]
	})
}));
