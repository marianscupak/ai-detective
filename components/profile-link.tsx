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
		<div className="flex items-center gap-4 md:gap-4">
			<Link
				href="/profile"
				className="hidden items-center gap-2 text-gray-700 hover:text-blue-700 md:flex dark:text-gray-200"
			>
				<UserCircle className="h-7 w-7" />
				<span className="text-lg font-medium">{data.user.name}</span>
			</Link>

			<Link
				href="/profile"
				className="p-2 text-gray-700 hover:text-blue-700 md:hidden dark:text-gray-200"
			>
				<UserCircle className="h-6 w-6" />
			</Link>

			<SignOutButton
				iconOnly
				className="p-2 text-gray-700 hover:text-blue-700 md:hidden dark:text-gray-200"
			/>

			<SignOutButton className="hidden text-lg font-medium text-gray-700 hover:text-blue-700 md:flex dark:text-gray-200" />
		</div>
	);
};

export default ProfileLink;
