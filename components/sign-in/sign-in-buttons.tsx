'use client';

import { Github, Mail } from 'lucide-react';
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@radix-ui/react-select';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export const SignInButtons = () => {
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();

	const callbackURL = searchParams.get('redirect') ?? '/';

	const handleGoogleLogin = () => {
		startTransition(async () => {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL
			});
		});
	};

	const handleGithubLogin = () => {
		startTransition(async () => {
			await authClient.signIn.social({
				provider: 'github',
				callbackURL
			});
		});
	};

	return (
		<div className="flex h-full items-center justify-center px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-2xl font-bold">
						Sign in to AI Detective
					</CardTitle>
					<p className="text-muted-foreground text-sm">
						Choose how you want to identify yourself before taking on a case.
					</p>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="space-y-3">
						<Button
							type="button"
							variant="outline"
							className="flex w-full items-center justify-center gap-2"
							onClick={handleGithubLogin}
							disabled={isPending}
						>
							<Github className="h-4 w-4" />
							<span>Continue with GitHub</span>
						</Button>
						<Button
							type="button"
							variant="outline"
							className="flex w-full items-center justify-center gap-2"
							onClick={handleGoogleLogin}
							disabled={isPending}
						>
							<Mail className="h-4 w-4" />
							<span>Continue with Google</span>
						</Button>
					</div>

					<div className="space-y-2 pt-2">
						<Separator />
						<p className="text-muted-foreground text-center text-xs">
							We only use your account to save your detective progress and
							cases.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
