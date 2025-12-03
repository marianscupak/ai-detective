'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getOngoingUserInvestigations } from '@/lib/database/game';

export const getOngoingInvestigations = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: You must be logged in to send a message.');
	}

	await new Promise(resolve => {
		setTimeout(resolve, 2000);
	});

	return await getOngoingUserInvestigations(session.user.id);
};

export const getCompletedInvestigations = async () => {
	const data = [
		{
			id: 'abc',
			authorId: '',
			createdAt: '',
			title: 'Some title',
			theme: 'theme',
			summary: ''
		},
		{
			id: 'abcd',
			authorId: '',
			createdAt: '',
			title: 'Some title 2',
			theme: 'theme',
			summary: ''
		},
		{
			id: 'abcf',
			authorId: '',
			createdAt: '',
			title: 'Some title 3',
			theme: 'theme',
			summary: ''
		}
	];

	await new Promise(resolve => {
		setTimeout(resolve, 2000);
	});

	return data;
};
