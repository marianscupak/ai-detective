'use client';

import { authClient } from '@/lib/auth-client';

export const SigninButton = () => {
	return (
		<button
			className="rounded-xl bg-blue-700 p-2 hover:bg-blue-900"
			type="button"
			onClick={async () =>
				await authClient.signIn.social({
					provider: 'github'
				})
			}
		>
			Sign in with Github
		</button>
	);
};
