'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

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
import { Button } from '@/components/ui/button';
import { abandonGameSession } from '@/server-actions/game';

type Props = {
	gameSessionId: string;
};

export const AbandonCaseDialog = ({ gameSessionId }: Props) => {
	const [isAbandonPending, startAbandonTransition] = useTransition();

	const router = useRouter();

	const handleAbandonCase = () => {
		startAbandonTransition(async () => {
			try {
				await abandonGameSession(gameSessionId);
				router.push('/');
			} catch (error) {
				console.error(error);
			}
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					disabled={isAbandonPending}
					className="w-full justify-start bg-blue-700 text-white hover:bg-blue-900"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Abandon Case
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action will discard your current progress in this case. You can
						always start over from the beginning.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleAbandonCase}
						className="bg-blue-700 text-white hover:bg-blue-900"
					>
						Abandon Case
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
