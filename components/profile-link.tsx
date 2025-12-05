'use client';

import Link from 'next/link';

import { authClient } from '@/lib/auth-client';

import { SignOutButton } from './sign-out-button';

const ProfileLink = () => {
	const { data } = authClient.useSession();

	if (!data?.session) {
		return (
			<Link href="/sign-in" className="text-xl font-medium text-black">
				Sign in
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<Link href="/profile" className="text-xl font-medium text-black">
				{data?.user.name}
			</Link>
			<SignOutButton />
		</div>
	);
};

export default ProfileLink;
