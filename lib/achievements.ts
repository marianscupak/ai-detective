import { type GameSession } from '@/types/game';

import { unlockAchievement } from './database/achievement';
import { getChatHistoryCount } from './database/game';

export const handleAbandonGameAchievements = async (
	userId: string,
	game: GameSession
) => {
	if (game.progress >= 0.9) {
		await unlockAchievement('so-close-yet-so-far', userId);
	}
};

export const handleCompleteGameAchievements = async (
	userId: string,
	gameSessionId: string
) => {
	await unlockAchievement('first-case-closed', userId);

	const messageCount = await getChatHistoryCount(gameSessionId);

	if (messageCount < 25) {
		await unlockAchievement('quick-wit', userId);
	}

	// TODO: Solve a case without hints
};

export const handleSendMessageAchievements = async (
	userId: string,
	gameSessionId: string
) => {
	const messageCount = await getChatHistoryCount(gameSessionId);

	if (messageCount >= 100) {
		await unlockAchievement('long-winded-detective', userId);
	}
};

// TODO: Use
export const handleCreateStoryAchiements = async (userId: string) => {
	await unlockAchievement('storyteller', userId);
};
