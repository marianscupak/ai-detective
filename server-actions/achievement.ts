'use server';

import { getUserAchievements } from '@/lib/database/achievement';

import requireAuth from './require-auth';

export const getUserAchievementsAction = async () => {
	const userId = await requireAuth();

	return await getUserAchievements(userId);
};
