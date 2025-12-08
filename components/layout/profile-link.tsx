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
				className="flex items-center gap-2 text-foreground hover:text-primary dark:text-foreground"
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
				className="hidden items-center gap-2 text-foreground hover:text-primary md:flex dark:text-foreground"
			>
				<UserCircle className="h-7 w-7" />
				<span className="text-lg font-medium">{data.user.name}</span>
			</Link>

			<Link
				href="/profile"
				className="p-2 text-foreground hover:text-primary md:hidden dark:text-foreground"
			>
				<UserCircle className="h-6 w-6" />
			</Link>

			<SignOutButton
				iconOnly
				className="p-2 text-foreground hover:text-primary md:hidden dark:text-foreground"
			/>

			<SignOutButton className="hidden text-lg font-medium text-foreground hover:text-primary md:flex dark:text-foreground" />
		</div>
	);
};

export default ProfileLink;
