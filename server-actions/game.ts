'use server';

import { headers } from 'next/headers';

import {
	getCaseById,
	findOrCreateGameSession,
	getChatHistory,
	saveNewMessage,
	updateGameSessionStatus,
	updateGameSessionProgress,
	getGameSessionById
} from '@/lib/database/game';
import { auth } from '@/lib/auth';
import { type DetectiveCase } from '@/types/case';
import { aiResponseSchema, type ChatMessage } from '@/types/game';
import { callGemini } from '@/lib/gemini';
import {
	handleAbandonGameAchievements,
	handleCompleteGameAchievements,
	handleSendMessageAchievements
} from '@/lib/achievements';

const buildPrompt = (
	caseData: DetectiveCase,
	history: ChatMessage[],
	previousProgress = 0
): string => {
	const chatHistory = history
		.map(
			msg =>
				`${msg.role === 'player' ? 'Player' : 'Game Master'}: ${msg.content}`
		)
		.join('\n');

	const lastPlayerMessage =
		[...history].reverse().find(msg => msg.role === 'player')?.content ??
		'(No player message yet.)';

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

Your job has TWO parts:
1) Continue the story and respond to the player in character as the Game Master.
2) Evaluate the player's latest message for relevance and overall progress in solving the case.

GAME RULES FOR THE NARRATIVE:
- Stay strictly in character in the "narrativeResponse" part of your answer.
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

RESPONSE FORMAT (VERY IMPORTANT):
You MUST respond with a single, valid JSON object and NOTHING ELSE. No markdown, no backticks, no additional text.
The JSON must have ALL of these keys:

{
  "narrativeResponse": "Your in-character, narrative message to the player.",
  "relevance": 0.0,
  "progress": 0.0,
  "reasoning": "Your brief, out-of-character reasoning for the scores.",
  "isSolved": true // OPTIONAL, set to true ONLY if the player's latest message is a DIRECT and CORRECT accusation.
}

- "narrativeResponse" must follow all GAME RULES above.
- "relevance" and "progress" must be numbers between 0.0 and 1.0 (floats).
- "reasoning" is out-of-character and visible only to the system; keep it short (1–3 sentences).

HOW TO CALCULATE SCORES:

1) "relevance" (0.0 to 1.0):
   - This score reflects how close the PLAYER'S LATEST MESSAGE is to the truth of the mystery.
   - 1.0: Player correctly identifies the culprit, motive, or a crucial piece of evidence's true significance.
   - 0.7–0.9: Player is on the right track, asking sharp questions about the real culprit or key evidence.
   - 0.4–0.6: Player is exploring a valid but secondary lead or a plausible red herring.
   - 0.1–0.3: Player is focused on mostly irrelevant details or a dead end.
   - 0.0: Player's message is completely off-topic or nonsensical.

2) "progress" (0.0 to 1.0):
   - This score reflects the PLAYER'S OVERALL PROGRESS in solving the entire mystery.
   - It should only ever increase or stay the same across the whole game.
   - The previous progress value up to this point is: ${previousProgress}.
   - Your new "progress" MUST be greater than or equal to ${previousProgress}.
   - The progress score MUST NEVER be equal to 1.0 unless the player has solved the case and you set \`isSolved: true\` in your response.
   - 0.0: The game has just started.
   - 0.25: Player has gathered some initial clues.
   - 0.50: Player has identified a key piece of evidence and is questioning the right people.
   - 0.75: Player has a strong theory and has likely identified the culprit but not the full motive/method.
   - 1.0: Player has solved the case by correctly identifying the culprit, motive, AND method.

3) "reasoning":
   - Briefly explain your scoring and how the latest player message affects relevance and progress.
   - Example: "Player correctly identified the significance of the ink stain, which is a major breakthrough. Progress increases significantly."

4) "isSolved":
   - Set this to \`true\` ONLY if the player's latest message is a DIRECT and CORRECT accusation.
	 - The accusation MUST correctly identify:
        1. The Culprit (\`${culpritId}\`)
        2. The Motive
        3. The Method
   - If the accusation is correct, your 'narrativeResponse' should be a confirmation, and you MUST set \`progress: 1.0\` and \`isSolved: true\`.
   - If the accusation is incorrect or incomplete, DO NOT include this flag. But try to guide the player in the right direction.

GAME DATA (PLAYER-FACING IF YOU CHOOSE TO REVEAL IT IN NARRATIVE FORM):
${publicInfo}

INTERNAL, SECRET INFORMATION (FOR AI ONLY – NEVER REVEAL DIRECTLY TO THE PLAYER):
${secretInfo}

${extraNotesSection}

CONVERSATION SO FAR:
${chatHistory || '(No prior messages. Start the investigation.)'}

PLAYER'S LATEST MESSAGE (the main basis for relevance and progress this turn):
${lastPlayerMessage}

Analyze the player's latest message in the context of the whole conversation and the secret information.
Then produce ONLY the JSON object described above, with no extra text before or after.
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
	const gameSession = await getGameSessionById(gameSessionId);

	const prompt = buildPrompt(caseData, chatHistory, gameSession?.progress ?? 0);
	const result = await callGemini(prompt);

	try {
		const data = JSON.parse(result!);

		const parsedData = aiResponseSchema.parse(data);

		const savedMessage = await saveNewMessage({
			gameSessionId,
			role: 'gameMaster',
			content: parsedData.narrativeResponse,
			relevance: parsedData.relevance,
			reasoning: parsedData.reasoning
		});
		await handleSendMessageAchievements(session.user.id, gameSessionId);

		await updateGameSessionProgress(gameSessionId, parsedData.progress);

		if (parsedData.isSolved) {
			await updateGameSessionStatus(gameSessionId, 'completed');
			await handleCompleteGameAchievements(session.user.id, gameSessionId);
		}

		return savedMessage;
	} catch (error) {
		console.error('Error in sendChatMessage action:', error);
		throw new Error('Failed to send message. Please try again.');
	}
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

export const getGameSessionStatus = async (gameSessionId: string) => {
	const gameSession = await getGameSessionById(gameSessionId);

	if (!gameSession) {
		throw new Error('Game session not found.');
	}

	return {
		status: gameSession.status,
		progress: gameSession.progress ?? 0
	};
};

export const abandonGameSession = async (gameSessionId: string) => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error(
			'Unauthorized: You must be logged in to perform this action.'
		);
	}

	const gameSession = await getGameSessionById(gameSessionId);

	if (gameSession?.userId !== session.user.id) {
		throw new Error(
			'Forbidden: Game session does not exist or belongs to another user.'
		);
	}

	try {
		await updateGameSessionStatus(gameSessionId, 'abandoned');
		await handleAbandonGameAchievements(session.user.id, gameSession);

		return { success: true };
	} catch (error) {
		console.error('Failed to abandon game session:', error);
		throw new Error('Could not abandon the session. Please try again.');
	}
};
