'use client';

import Link from 'next/link';
import { UserCircle } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { SignOutButton } from './sign-out-button';

const ProfileLink = () => {
	const { data } = authClient.useSession();

	if (!data?.session) {
		return (
			<Link
				href="/sign-in"
				className="flex items-center gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200"
			>
				<UserCircle className="h-6 w-6" />
				<span className="text-lg font-medium">Sign in</span>
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<Link
				href="/profile"
				className="flex items-center gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200"
			>
				<UserCircle className="h-7 w-7" />
				<span className="text-lg font-medium">{data?.user.name}</span>
			</Link>

			<SignOutButton className="text-lg font-medium text-gray-700 hover:text-blue-700 dark:text-gray-200" />
		</div>
	);
};

export default ProfileLink;
