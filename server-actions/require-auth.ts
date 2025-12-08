'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

const requireAuth = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized: You must be logged in.');
	}

	return session.user.id;
};

export default requireAuth;
