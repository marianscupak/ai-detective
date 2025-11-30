import { headers } from 'next/headers';
import Link from 'next/link';

import { auth } from '@/lib/auth';

import { SignOutButton } from './sign-out-button';

const ProfileLink = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) {
		return (
			<Link href="/sign-in" className="text-xl font-medium text-black">
				Sign in
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<Link href="/profile" className="text-xl font-medium text-black">
				{session.user.name}
			</Link>
			<SignOutButton />
		</div>
	);
};

export default ProfileLink;
