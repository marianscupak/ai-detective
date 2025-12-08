'use client';

import { useState } from 'react';

import { Chat } from '@/components/chat/chat';
import { SideControls } from '@/components/chat/side-controls/side-controls';
import { type ChatMessage, type GameSession } from '@/types/game';
import { type DetectiveCase } from '@/types/case';

type Props = {
	initialGameSession: GameSession;
	initialMessages: ChatMessage[];
	initialCaseDetails: DetectiveCase;
};

export const GameClientShell = ({
	initialGameSession,
	initialMessages,
	initialCaseDetails
}: Props) => {
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

	return (
		<div className="container mx-auto flex h-full flex-col items-start gap-8 px-4 py-8 lg:flex-row">
			<Chat
				initialCaseDetails={initialCaseDetails}
				initialGameSession={initialGameSession}
				messages={messages}
				setMessages={setMessages}
			/>

			<div className="w-full lg:w-auto">
				<SideControls
					detectiveCase={initialCaseDetails}
					gameSessionId={initialGameSession.id}
					setMessages={setMessages}
				/>
			</div>
		</div>
	);
};
