'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { type DetectiveCaseListItem } from '@/types/case';
import {
	dbGetAllCaseThemes,
	dbGetAllDetectiveCasesWithStatus,
	dbUserHasCompletedCase,
	getCaseById
} from '@/lib/database/game';

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
