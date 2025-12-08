'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { db } from '@/db';
import {
	detectiveCase,
	caseCharacter,
	caseEvidence
} from '@/db/schema/game-schema';
import {
	type DetectiveCase,
	type CaseLeaderboardEntry,
	type DetectiveCaseListItem
} from '@/types/case';
import { auth } from '@/lib/auth';
import {
	dbGetAllCaseThemes,
	dbGetAllDetectiveCasesWithStatus,
	dbGetLeaderboardForCase,
	dbUserHasCompletedCase,
	getCaseById
} from '@/lib/database/game';
import { handleCreateStoryAchiements } from '@/lib/achievements';

export type CreateCaseResult =
	| { success: true; caseId: string }
	| { success: false; error: string };

export const createCaseAction = async (
	data: DetectiveCase
): Promise<CreateCaseResult> => {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user?.id) {
			return { success: false, error: 'Unauthorized: User not logged in' };
		}

		const authorId = session.user.id;

		const sanitizedTitle = data.title.replace(/[^a-zA-Z0-9]/g, '-');
		const caseId = `${sanitizedTitle}-${Date.now()}`;

		const playerDbId = `${caseId}-player`;
		const victimDbId = `${caseId}-victim`;

		const suspectRows = data.characters.suspects.map((s, index) => {
			const dbId = `${caseId}-suspect-${index + 1}`;
			return {
				originalId: s.id,
				dbId,
				name: s.name,
				description: s.description
			};
		});

		const culpritOriginalId = data.solution.culpritCharacterId;
		const culpritRow = suspectRows.find(
			row => row.originalId === culpritOriginalId
		);

		const culpritDbId = culpritRow?.dbId ?? culpritOriginalId;

		await db.transaction(async tx => {
			await tx.insert(detectiveCase).values({
				id: caseId,
				authorId,
				title: data.title,
				theme: data.theme,
				summary: data.summary,
				location: data.setting.location,
				dateTime: data.setting.dateTime,
				incident: data.setting.incident,
				culpritCharacterId: culpritDbId,
				motive: data.solution.motive,
				method: data.solution.method,
				notesForAI: data.notesForAI ?? null
			});

			await tx.insert(caseCharacter).values([
				{
					id: playerDbId,
					caseId,
					role: 'player',
					name: data.characters.player.name,
					description: data.characters.player.description
				},
				{
					id: victimDbId,
					caseId,
					role: 'victim',
					name: data.characters.victimOrTarget.name,
					description: data.characters.victimOrTarget.description
				},
				...suspectRows.map(row => ({
					id: row.dbId,
					caseId,
					role: 'suspect',
					name: row.name,
					description: row.description
				}))
			]);

			if (data.evidence.length > 0) {
				await tx.insert(caseEvidence).values(
					data.evidence.map((e, index) => ({
						id: `${caseId}-evidence-${index + 1}`,
						caseId,
						description: e.description,
						location: e.location,
						significance: e.significance
					}))
				);
			}
		});
		await handleCreateStoryAchiements(authorId);

		revalidatePath('/');

		return { success: true, caseId };
	} catch (error) {
		console.error('Create case action error:', error);
		return {
			success: false,
			error: 'Failed to create case due to server error.'
		};
	}
};

const requireAuth = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) throw new Error('Unauthorized');
	return session.user.id;
};

export const getDetectiveCaseById = async (caseId: string) => {
	await requireAuth();

	const result = await getCaseById(caseId);
	if (!result) throw new Error('Case not found');

	return result;
};

export const getAllCaseThemes = async (): Promise<string[]> => {
	await requireAuth();
	return await dbGetAllCaseThemes();
};

export const userHasCompletedCase = async (caseId: string) => {
	const userId = await requireAuth();
	return await dbUserHasCompletedCase(userId, caseId);
};

export const getAllDetectiveCasesWithStatus = async (): Promise<
	DetectiveCaseListItem[]
> => {
	const userId = await requireAuth();
	return await dbGetAllDetectiveCasesWithStatus(userId);
};

export const getLeaderboardForCase = async (
	caseId: string
): Promise<CaseLeaderboardEntry[]> => {
	await requireAuth();

	return await dbGetLeaderboardForCase(caseId);
};
