'use server';

import {
	getCaseById,
	findOrCreateGameSession,
	getChatHistory,
	saveNewMessage,
	updateGameSessionStatus,
	updateGameSessionProgress,
	getGameSessionById
} from '@/lib/database/game';
import { type DetectiveCase } from '@/types/case';
import {
	aiResponseSchema,
	type ChatMessage,
	type HintFocus,
	type HintSubtlety
} from '@/types/game';
import { callGemini } from '@/lib/gemini';
import {
	handleAbandonGameAchievements,
	handleCompleteGameAchievements,
	handleSendMessageAchievements
} from '@/lib/achievements';

import requireAuth from './require-auth';

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

const buildGameContext = (caseData: DetectiveCase) => {
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

	return {
		publicInfo,
		secretInfo,
		extraNotesSection,
		culpritId,
		motive,
		method
	};
};

/* -------------------------------------------------------------------------- */
/* Normal chat prompt                                                         */
/* -------------------------------------------------------------------------- */

const buildPrompt = (
	caseData: DetectiveCase,
	history: ChatMessage[],
	previousProgress = 0
): string => {
	const { publicInfo, secretInfo, extraNotesSection, culpritId } =
		buildGameContext(caseData);

	const chatHistory = history
		.map(
			msg =>
				`${msg.role === 'player' ? 'Player' : 'Game Master'}: ${msg.content}`
		)
		.join('\n');

	const lastPlayerMessage =
		[...history].reverse().find(msg => msg.role === 'player')?.content ??
		'(No player message yet.)';

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
   - The progress score MUST NEVER be equal to 1.0 unless the player has solved the case and you set "isSolved": true in your response.
   - 0.0: The game has just started.
   - 0.25: Player has gathered some initial clues.
   - 0.50: Player has identified a key piece of evidence and is questioning the right people.
   - 0.75: Player has a strong theory and has likely identified the culprit but not the full motive/method.
   - 1.0: Player has solved the case by correctly identifying the culprit, motive, AND method.

3) "reasoning":
   - Briefly explain your scoring and how the latest player message affects relevance and progress.
   - Example: "Player correctly identified the significance of the ink stain, which is a major breakthrough. Progress increases significantly."

4) "isSolved":
   - Set this to true ONLY if the player's latest message is a DIRECT and CORRECT accusation.
	 - The accusation MUST correctly identify:
        1. The Culprit ("${culpritId}")
        2. The Motive
        3. The Method
   - If the accusation is correct, your "narrativeResponse" should be a confirmation, and you MUST set "progress": 1.0 and "isSolved": true.
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

/* -------------------------------------------------------------------------- */
/* Hint prompt                                                                */
/* -------------------------------------------------------------------------- */

const buildHintPrompt = (
	caseData: DetectiveCase,
	history: ChatMessage[],
	previousProgress = 0,
	options?: {
		message?: string;
		focus?: HintFocus;
		subtlety?: HintSubtlety;
	}
): string => {
	const { publicInfo, secretInfo, extraNotesSection } =
		buildGameContext(caseData);

	const chatHistory = history
		.map(
			msg =>
				`${msg.role === 'player' ? 'Player' : 'Game Master'}: ${msg.content}`
		)
		.join('\n');

	const lastPlayerMessage =
		[...history].reverse().find(msg => msg.role === 'player')?.content ??
		'(No player message yet.)';

	const focusDescription = (() => {
		switch (options?.focus) {
			case 'next-step':
				return 'Give guidance on what concrete action the player should take next (who to talk to, where to go, what to examine).';
			case 'evidence':
				return 'Give guidance about which piece of evidence to focus on, re-examine, or connect.';
			case 'suspect':
				return 'Give guidance about which suspect to question, reconsider, or compare against others.';
			case 'motive':
				return 'Give guidance related to motives and why the culprit would commit the crime.';
			case 'method':
				return 'Give guidance related to how the crime was committed (method, opportunity, logistics).';
			case 'general':
			default:
				return 'Give general guidance that nudges the player toward the right track without focusing on a single aspect.';
		}
	})();

	const subtletyDescription = (() => {
		switch (options?.subtlety) {
			case 'very-subtle':
				return 'The hint should be very indirect: light nudges and questions, no explicit statements.';
			case 'direct':
				return 'The hint may be fairly direct and explicit, but MUST still avoid outright revealing the culprit, exact method, or fully spoiling the solution.';
			case 'normal':
			default:
				return 'The hint should be moderately direct: clear enough to help, but still leave room for the player to think.';
		}
	})();

	return `
You are "The Game Master" in an interactive detective mystery game.

IMPORTANT: HINT MODE IS ACTIVE.

The player is explicitly requesting a hint.

PLAYER'S FREE-FORM HINT REQUEST (if any):
${options?.message ?? "The player didn't specify what kind of hint they wanted."}

HINT PARAMETERS (STRUCTURED):
- Focus: ${options?.focus ?? 'general'}
  ${focusDescription}
- Subtlety: ${options?.subtlety ?? 'normal'}
  ${subtletyDescription}

In this mode:
- DO NOT continue the narrative scene or advance time.
- DO NOT describe new actions or events; only suggest what the player could think about or do next.
- DO NOT reveal the culprit, motive, or method directly.
- Provide 1–3 hints that become progressively clearer.
- Start with a gentle nudge ("Maybe check X again..."), then, if you add more, make them slightly more explicit.
- Keep hints focused on what the player should *do next* or *re-examine*.
- The hints should relate to the player's CURRENT understanding and the conversation so far.

RESPONSE FORMAT (VERY IMPORTANT):
You MUST respond with a single, valid JSON object and NOTHING ELSE. No markdown, no backticks, no additional text.
The JSON must have ALL of these keys:
{
  "narrativeResponse": "Your hint message to the player.",
  "relevance": 0.0,
  "progress": 0.0,
  "reasoning": "Short out-of-character explanation for the system (1–3 sentences)."
}

- "narrativeResponse": your hint text (you may include multiple short hints in one message).
- "relevance": how close the PLAYER's CURRENT ideas/messages are to the truth (0.0–1.0).
- "progress": the PLAYER's OVERALL PROGRESS in solving the case (0.0–1.0).
  - It MUST be greater than or equal to ${previousProgress}.
  - In HINT MODE you should normally keep progress the same unless the hint reflects a significant understanding the player already demonstrated.
- DO NOT include "isSolved" in HINT MODE.

GAME DATA (PLAYER-FACING IF YOU CHOOSE TO REVEAL IT IN HINT FORM):
${publicInfo}

INTERNAL, SECRET INFORMATION (FOR AI ONLY – NEVER REVEAL DIRECTLY TO THE PLAYER):
${secretInfo}

${extraNotesSection}

CONVERSATION SO FAR:
${chatHistory || '(No prior messages. Start from the basic premise.)'}

PLAYER'S LATEST MESSAGE (primary basis for relevance/progress evaluation):
${lastPlayerMessage}

Analyze the player's situation and requested type of hint.
Then produce ONLY the JSON object described above, with no extra text before or after.
`.trim();
};

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

export const sendChatMessage = async (
	caseId: string,
	gameSessionId: string,
	message: string
) => {
	const userId = await requireAuth();

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

	const previousProgress = gameSession?.progress ?? 0;

	const prompt = buildPrompt(caseData, chatHistory, previousProgress);
	const result = await callGemini(prompt);

	try {
		const data = JSON.parse(result!);
		const parsedData = aiResponseSchema.parse(data);

		const rawProgress = parsedData.progress ?? previousProgress;
		const newProgress = Math.max(previousProgress, rawProgress);

		const savedMessage = await saveNewMessage({
			gameSessionId,
			role: 'gameMaster',
			content: parsedData.narrativeResponse,
			relevance: parsedData.relevance,
			reasoning: parsedData.reasoning
		});
		await handleSendMessageAchievements(userId, gameSessionId);

		await updateGameSessionProgress(gameSessionId, newProgress);

		if (parsedData.isSolved) {
			await updateGameSessionStatus(gameSessionId, 'completed');
			await handleCompleteGameAchievements(userId, gameSessionId);
		}

		return savedMessage;
	} catch (error) {
		console.error('Error in sendChatMessage action:', error);
		throw new Error('Failed to send message. Please try again.');
	}
};

export const loadGameSession = async (caseId: string) => {
	try {
		const userId = await requireAuth();
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
	const userId = await requireAuth();

	const gameSession = await getGameSessionById(gameSessionId);

	if (gameSession?.userId !== userId) {
		throw new Error(
			'Forbidden: Game session does not exist or belongs to another user.'
		);
	}

	try {
		await updateGameSessionStatus(gameSessionId, 'abandoned');
		await handleAbandonGameAchievements(userId, gameSession);

		return { success: true };
	} catch (error) {
		console.error('Failed to abandon game session:', error);
		throw new Error('Could not abandon the session. Please try again.');
	}
};

export const requestHint = async (
	gameSessionId: string,
	options?: {
		message?: string;
		focus?: HintFocus;
		subtlety?: HintSubtlety;
	}
) => {
	await requireAuth();

	try {
		const gameSession = await getGameSessionById(gameSessionId);
		if (!gameSession) {
			throw new Error('Game session not found.');
		}

		const caseDetails = await getCaseById(gameSession.caseId);
		if (!caseDetails) {
			throw new Error('Case not found.');
		}

		const chatHistory = await getChatHistory(gameSessionId);
		const previousProgress = gameSession.progress ?? 0;

		const prompt = buildHintPrompt(
			caseDetails,
			chatHistory,
			previousProgress,
			options
		);

		const result = await callGemini(prompt);
		const data = JSON.parse(result!);
		const parsedData = aiResponseSchema.parse(data);

		const rawProgress = parsedData.progress ?? previousProgress;
		const clampedProgress = Math.min(rawProgress, 0.99);
		const newProgress = Math.max(previousProgress, clampedProgress);

		const hintRequestMessage = await saveNewMessage({
			gameSessionId,
			role: 'player',
			content: options?.message ?? 'Hint requested.',
			type: 'hintRequest'
		});

		const hintResponseMessage = await saveNewMessage({
			gameSessionId,
			role: 'gameMaster',
			content: parsedData.narrativeResponse,
			relevance: parsedData.relevance,
			reasoning: parsedData.reasoning,
			type: 'hintResponse'
		});

		await updateGameSessionProgress(gameSessionId, newProgress);

		return { hintRequestMessage, hintResponseMessage };
	} catch (e) {
		console.error('Failed to request hint:', e);
		throw new Error('Could not request hint. Please try again.');
	}
};
