'use server';

import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
	type DetectiveCase,
	type CaseLeaderboardEntry,
	type DetectiveCaseListItem
} from '@/types/case';
import {
	dbCreateCase,
	dbGetAllCaseThemes,
	dbGetAllDetectiveCasesWithStatus,
	dbGetLeaderboardForCase,
	dbUserHasCompletedCase,
	getCaseById
} from '@/lib/database/game';

import requireAuth from './require-auth';

export type CreateCaseResult =
	| { success: true; caseId: string }
	| { success: false; error: string };

export const createCaseAction = async (
	data: DetectiveCase
): Promise<CreateCaseResult> => {
	try {
		const userId = await requireAuth();

		const caseId = await dbCreateCase(data, userId);

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

export const getDetectiveCaseById = async (caseId: string) => {
	await requireAuth();

	const result = await getCaseById(caseId);
	if (!result) notFound();

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
