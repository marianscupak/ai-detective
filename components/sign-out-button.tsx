'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/cn';

type SignOutButtonProps = {
	className?: string;
};

export const SignOutButton = ({ className }: SignOutButtonProps) => {
	const router = useRouter();

	return (
		<button
			type="button"
			onClick={async () => {
				await authClient.signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push('/login');
							router.refresh();
						}
					}
				});
			}}
			className={cn(
				'flex items-center gap-2 font-medium text-gray-700 transition hover:text-blue-700 dark:text-gray-200',
				className
			)}
		>
			<LogOut className="h-5 w-5" />
			<span>Sign out</span>
		</button>
	);
};

export default SignOutButton;
