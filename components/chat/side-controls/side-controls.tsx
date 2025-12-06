'use client';

import { type Dispatch, type SetStateAction } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { type ChatMessage } from '@/types/game';
import { AbandonCaseDialog } from '@/components/chat/side-controls/abandon-case-dialog';
import { RequestHintDialog } from '@/components/chat/side-controls/request-hint-dialog';

type SideControlsProps = {
	gameSessionId: string;
	setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
};

export const SideControls = ({
	gameSessionId,
	setMessages
}: SideControlsProps) => {
	return (
		<Card className="w-full lg:w-48">
			<CardContent className="flex flex-col space-y-2 p-4">
				<h3 className="text-muted-foreground mb-2 text-sm font-semibold">
					Case Actions
				</h3>

				<RequestHintDialog
					gameSessionId={gameSessionId}
					setMessages={setMessages}
				/>
				<AbandonCaseDialog gameSessionId={gameSessionId} />
			</CardContent>
		</Card>
	);
};
