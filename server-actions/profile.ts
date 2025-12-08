'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import {
	getCompletedUserInvestigations,
	getOngoingUserInvestigations
} from '@/lib/database/game';
import {
	updateProfileSchema,
	type UpdateProfileDto
} from '@/lib/schema/profile';
import {
	type CompletedUserInvestigation,
	type OngoingUserInvestigation
} from '@/types/game';

import requireAuth from './require-auth';

export const updateUserProfile = async (data: UpdateProfileDto) => {
	const validatedInput = await updateProfileSchema.safeParseAsync(data);

	if (!validatedInput.success) {
		throw new Error(validatedInput.error.message);
	}

	await auth.api.updateUser({
		headers: await headers(),
		body: {
			name: validatedInput.data.name
		}
	});
};

export const getOngoingInvestigations = async (): Promise<
	OngoingUserInvestigation[]
> => {
	const userId = await requireAuth();

	return await getOngoingUserInvestigations(userId);
};

export const getCompletedInvestigations = async (): Promise<
	CompletedUserInvestigation[]
> => {
	const userId = await requireAuth();

	return await getCompletedUserInvestigations(userId);
};
