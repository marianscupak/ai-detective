'use server';

import { headers } from 'next/headers';

import {
	getCaseById,
	findOrCreateGameSession,
	getChatHistory,
	saveNewMessage
} from '@/lib/database/game';
import { auth } from '@/lib/auth';
import { type DetectiveCase } from '@/types/case';
import { type ChatMessage } from '@/types/game';
import { callGemini } from '@/lib/gemini';

const MAX_HISTORY_MESSAGES = 40;

const buildPrompt = (
	caseData: DetectiveCase,
	history: ChatMessage[]
): string => {
	const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);

	const chatHistory = trimmedHistory
		.map(
			msg =>
				`${msg.role === 'player' ? 'Player' : 'Game Master'}: ${msg.content}`
		)
		.join('\n');

	const suspectsText = caseData.characters.suspects
		.map(s => `- [${s.id}] ${s.name}: ${s.description}`)
		.join('\n');

	const evidencePublic = caseData.evidence
		.map(
			e =>
				`- [${e.id}] ${e.description} (can be found at/through: ${e.location})`
		)
		.join('\n');

	const evidenceSecret = caseData.evidence
		.map(
			e =>
				`- [${e.id}] ${e.description}
  Found at/through: ${e.location}
  True significance (AI-only): ${e.significance}`
		)
		.join('\n\n');

	const culpritId = caseData.solution.culpritCharacterId;
	const motive = caseData.solution.motive;
	const method = caseData.solution.method;

	const player = caseData.characters.player;
	const victim = caseData.characters.victimOrTarget;

	const authorNotes = caseData.notesForAI?.trim();

	const publicInfo = `
TITLE: ${caseData.title}
THEME: ${caseData.theme}
SUMMARY (player-facing): ${caseData.summary}

SETTING:
- Location: ${caseData.setting.location}
- Date/Time: ${caseData.setting.dateTime}
- Incident: ${caseData.setting.incident}

PLAYER CHARACTER:
- Name: ${player.name}
- Description: ${player.description}

VICTIM OR TARGET:
- Name: ${victim.name}
- Description: ${victim.description}

SUSPECTS (names and public descriptions):
${suspectsText || '- None defined'}

POTENTIAL EVIDENCE (player-facing descriptions; reveal gradually and in context):
${evidencePublic || '- None defined'}
`.trim();

	const secretInfo = `
SECRET SOLUTION (FOR AI ONLY – NEVER REVEAL DIRECTLY):
- Culprit character ID: ${culpritId}
- Motive: ${motive}
- Method: ${method}

EVIDENCE INTERPRETATION (FOR AI ONLY – USE TO JUDGE PLAYER PROGRESS, NOT TO REVEAL OUTRIGHT):
${evidenceSecret || '- No evidence defined'}
`.trim();

	const extraNotesSection = authorNotes
		? `
AUTHOR NOTES FOR AI (DO NOT REPEAT VERBATIM TO PLAYER):
${authorNotes}
`.trim()
		: '';

	return `
You are "The Game Master" in an interactive detective mystery game played in a chat.

GAME RULES:
- Stay strictly in character as the Game Master.
- Never reveal the secret solution, culprit, motives, methods, evidence significance, or your internal reasoning directly.
- You may hint, foreshadow, and guide, but never state the culprit or method outright unless the game explicitly reaches a final reveal phase (which is not the case unless the player directly accuses with strong evidence and you decide it's time).
- Respond with hints, questions, atmosphere, and narrative descriptions.
- Keep responses concise but flavorful (about 3–8 sentences).
- Encourage the player to:
  - Form theories,
  - Interrogate suspects,
  - Inspect or revisit locations,
  - Examine or re-examine evidence,
  - Connect motives, methods, and opportunities.
- If the player is stuck or going in circles, offer subtle guidance or a gentle nudge rather than explicit answers.
- Use second person ("you") when addressing the player.
- Do not mention that you are an AI or that you have access to "secret info", IDs, or internal data structures.
- Never mention internal IDs like [${culpritId}] explicitly to the player.

GAME DATA (PLAYER-FACING IF YOU CHOOSE TO REVEAL IT IN NARRATIVE FORM):
${publicInfo}

INTERNAL, SECRET INFORMATION (NEVER REVEAL DIRECTLY TO PLAYER):
${secretInfo}

${extraNotesSection}

CONVERSATION SO FAR:
${chatHistory || '(No prior messages. Start the investigation.)'}

Continue the conversation as the Game Master. Answer only with what the Game Master would say next in this scene, in a single message.

Game Master:
`.trim();
};

export const sendChatMessage = async (
	caseId: string,
	gameSessionId: string,
	message: string
) => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: You must be logged in to send a message.');
	}

	await saveNewMessage({
		gameSessionId,
		role: 'player',
		content: message
	});

	const caseData = await getCaseById(caseId);

	if (!caseData) {
		throw new Error('Case data not found for this session.');
	}

	const chatHistory = await getChatHistory(gameSessionId);
	const prompt = buildPrompt(caseData, chatHistory);
	const result = await callGemini(prompt);

	return await saveNewMessage({
		gameSessionId,
		role: 'gameMaster',
		content: result ?? ''
	});
};

export const loadGameSession = async (caseId: string) => {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user?.id) {
			throw new Error('Unauthorized: You must be logged in to play.');
		}

		const userId = session.user.id;
		const caseDetails = await getCaseById(caseId);

		if (!caseDetails) {
			throw new Error('Case not found.');
		}

		const gameSession = await findOrCreateGameSession(userId, caseId);
		const chatHistory = await getChatHistory(gameSession.id);

		if (chatHistory.length === 0) {
			const initialMessage = await saveNewMessage({
				gameSessionId: gameSession.id,
				role: 'gameMaster',
				content: caseDetails.summary
			});

			chatHistory.push(initialMessage);
		}

		return {
			caseDetails,
			gameSession,
			chatHistory
		};
	} catch (error) {
		console.error('Error in loadGameSession action:', error);
		throw new Error('Failed to load game session. Please try again.');
	}
};
