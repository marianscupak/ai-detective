'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

export const SignOutButton = () => {
	const router = useRouter();

	return (
		<button
			className="rounded-xl bg-gray-300 p-2 text-black"
			type="button"
			onClick={async () =>
				await authClient.signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push('/login');
							router.refresh();
						}
					}
				})
			}
		>
			Sign out
		</button>
	);
};
