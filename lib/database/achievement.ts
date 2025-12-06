import { eq, and, desc } from 'drizzle-orm';

import { db } from '@/db';
import { achievement, userAchievements } from '@/db/schema/achievement-schema';

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

export const getUserAchievements = async (userId: string) => {
	const achievements = await db
		.select({
			achievementId: achievement.id,
			title: achievement.title,
			description: achievement.description,
			earnedAt: userAchievements.earnedAt
		})
		.from(achievement)
		.leftJoin(
			userAchievements,
			and(
				eq(achievement.id, userAchievements.achievementId),
				eq(userAchievements.userId, userId)
			)
		)
		.orderBy(desc(userAchievements.earnedAt));

	return achievements.map(ach => ({ ...ach, isUnlocked: !!ach.earnedAt }));
};
