import { type GameSession } from '@/types/game';

import { unlockAchievement } from './database/achievement';
import { getChatHistory, getChatHistoryCount } from './database/game';

export const handleAbandonGameAchievements = async (
	userId: string,
	game: GameSession
) => {
	if (game.progress >= 0.9 && game.status !== 'completed') {
		await unlockAchievement('so-close-yet-so-far', userId);
	}
};

export const handleCompleteGameAchievements = async (
	userId: string,
	gameSessionId: string
) => {
	await unlockAchievement('first-case-closed', userId);

	const messages = await getChatHistory(gameSessionId);
	const playerMessages = messages.filter(message => message.role === 'player');

	if (playerMessages.length < 25) {
		await unlockAchievement('quick-wit', userId);
	}

	const usedHints = playerMessages.some(
		message => message.type === 'hintRequest'
	);

	if (!usedHints) {
		await unlockAchievement('master-sleuth', userId);
	}
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

export const handleCreateStoryAchiements = async (userId: string) => {
	await unlockAchievement('storyteller', userId);
};
