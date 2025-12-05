'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getUserAchievements } from '@/lib/database/achievement';

export const getUserAchievementsAction = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: You must be logged in to send a message.');
	}

	return await getUserAchievements(session.user.id);
};
