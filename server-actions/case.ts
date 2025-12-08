'use server';

import { notFound } from 'next/navigation';

import {
	type CaseLeaderboardEntry,
	type DetectiveCaseListItem
} from '@/types/case';
import {
	dbGetAllCaseThemes,
	dbGetAllDetectiveCasesWithStatus,
	dbGetLeaderboardForCase,
	dbUserHasCompletedCase,
	getCaseById
} from '@/lib/database/game';

import requireAuth from './require-auth';

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

	const result = await dbGetLeaderboardForCase(caseId);
	return result;
};
