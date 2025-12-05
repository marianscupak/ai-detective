import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const Home = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) {
		redirect('/sign-in');
	}

	redirect('/stories');
};
export default Home;
