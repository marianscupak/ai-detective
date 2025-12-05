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
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: You must be logged in to send a message.');
	}

	return await getOngoingUserInvestigations(session.user.id);
};

export const getCompletedInvestigations = async (): Promise<
	CompletedUserInvestigation[]
> => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: You must be logged in to send a message.');
	}

	return await getCompletedUserInvestigations(session.user.id);
};
