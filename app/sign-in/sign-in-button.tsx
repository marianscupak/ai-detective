'use client';

import { authClient } from '@/lib/auth-client';

export const SigninButton = () => {
	return (
		<button
			className="rounded-xl bg-blue-300 p-2"
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
