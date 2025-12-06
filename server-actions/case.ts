'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { type DetectiveCaseBaseView } from '@/types/case';
import {
	dbGetAllCaseThemes,
	dbGetAllDetectiveCases,
	getCaseById
} from '@/lib/database/game';

const requireAuth = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) throw new Error('Unauthorized');
	return session.user.id;
};

export const getAllDetectiveCases = async (): Promise<
	DetectiveCaseBaseView[]
> => {
	await requireAuth();
	return await dbGetAllDetectiveCases();
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
