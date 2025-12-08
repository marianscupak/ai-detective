'use client';

import { type Dispatch, type SetStateAction } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { type ChatMessage } from '@/types/game';
import { AbandonCaseDialog } from '@/components/chat/side-controls/abandon-case-dialog';
import { RequestHintDialog } from '@/components/chat/side-controls/request-hint-dialog';
import { CaseDetailsModal } from '@/components/chat/side-controls/case-details-modal';
import { type DetectiveCase } from '@/types/case';

type SideControlsProps = {
	gameSessionId: string;
	setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
	detectiveCase: DetectiveCase;
	isGameFinished: boolean;
};

export const SideControls = ({
	gameSessionId,
	setMessages,
	detectiveCase,
	isGameFinished
}: SideControlsProps) => {
	return (
		<Card className="w-full lg:w-48">
			<CardContent className="flex flex-col space-y-2 p-4">
				<h3 className="text-muted-foreground mb-2 text-sm font-semibold">
					Case Actions
				</h3>

				<CaseDetailsModal detectiveCase={detectiveCase} />
				<RequestHintDialog
					gameSessionId={gameSessionId}
					setMessages={setMessages}
					disabled={isGameFinished}
				/>
				<AbandonCaseDialog gameSessionId={gameSessionId} />
			</CardContent>
		</Card>
	);
};
