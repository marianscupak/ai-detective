import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { user as userTable } from '@/db/schema/auth-schema';

import { SEED_AUTHOR_ID } from './constants';

export const ensureSeedAuthorExists = async () => {
	const [existing] = await db
		.select({ id: userTable.id })
		.from(userTable)
		.where(eq(userTable.id, SEED_AUTHOR_ID))
		.limit(1);

	if (existing) {
		console.log(`[seed] Seed author "${SEED_AUTHOR_ID}" already exists.`);
		return existing.id;
	}

	console.log(`[seed] Creating seed author "${SEED_AUTHOR_ID}"...`);

	await db.insert(userTable).values({
		id: SEED_AUTHOR_ID,
		name: 'Seed Author',
		email: 'seed.author@example.com',
		emailVerified: true,
		createdAt: new Date(),
		updatedAt: new Date()
	});

	console.log(`[seed] Seed author created.`);

	return SEED_AUTHOR_ID;
};
