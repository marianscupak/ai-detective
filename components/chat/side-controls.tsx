'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { abandonGameSession } from '@/server-actions/game';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';

type SideControlsProps = {
	gameSessionId: string;
};

export const SideControls = ({ gameSessionId }: SideControlsProps) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleAbandonCase = () => {
		startTransition(async () => {
			try {
				await abandonGameSession(gameSessionId);
				router.push('/');
			} catch (error) {
				console.error(error);
			}
		});
	};

	return (
		<Card className="w-full lg:w-48">
			<CardContent className="flex flex-col space-y-2 p-4">
				<h3 className="text-muted-foreground mb-2 text-sm font-semibold">
					Case Actions
				</h3>

				{/*TODO: Implement hint button*/}
				<Button variant="outline" disabled className="w-full justify-start">
					<HelpCircle className="mr-2 h-4 w-4" />
					Get a Hint
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="destructive"
							disabled={isPending}
							className="w-full justify-start"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Abandon Case
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action will discard your current progress in this case. You
								can always start over from the beginning.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleAbandonCase}>
								Abandon Case
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
};
