import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

import { user } from './auth-schema';

export const achievement = sqliteTable('achievement', {
	id: text('id').primaryKey(),

	title: text('title').notNull(),
	description: text('description').notNull()
});

export const userAchievements = sqliteTable('user_achievement', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	achievementId: text('achievement_id')
		.notNull()
		.references(() => achievement.id, { onDelete: 'cascade' }),
	earnedAt: integer('earned_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull()
});
