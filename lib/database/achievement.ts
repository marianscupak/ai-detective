import { eq, and } from 'drizzle-orm';

import { db } from '@/db';
import { userAchievements } from '@/db/schema/achievement-schema';

export const unlockAchievement = async (
	achievementId: string,
	userId: string
) => {
	const [achievement] = await db
		.select()
		.from(userAchievements)
		.where(
			and(
				eq(userAchievements.achievementId, achievementId),
				eq(userAchievements.userId, userId)
			)
		)
		.limit(1);

	if (!!achievement) {
		return;
	}

	const id = crypto.randomUUID();

	db.insert(userAchievements).values([
		{
			id,
			achievementId,
			userId
		}
	]);
};
