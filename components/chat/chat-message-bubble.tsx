import { type PropsWithChildren } from 'react';

import type { ChatMessage } from '@/types/game';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageLoading } from '@/components/chat/message-loading';

const MessageContentWrapper = ({
	children,
	isPlayer
}: PropsWithChildren<{ isPlayer: boolean }>) => (
	<div
		className={cn(
			'max-w-sm rounded-lg px-4 py-2 text-sm',
			isPlayer ? 'bg-primary text-primary-foreground' : 'bg-muted'
		)}
	>
		{children}
	</div>
);

export const ChatMessageBubble = ({
	message,
	relevanceForPlayer
}: {
	message: ChatMessage | (Pick<ChatMessage, 'role'> & { loading: true });
	relevanceForPlayer?: number;
}) => {
	const isPlayer = message.role === 'player';

	const relevanceLabel = (r: number) => {
		if (r >= 0.9) return 'Bullseye';
		if (r >= 0.7) return 'Very close';
		if (r >= 0.4) return 'On the trail';
		if (r >= 0.1) return 'Off track';
		return 'Way off';
	};

	return (
		<div
			className={cn(
				'flex flex-col gap-1',
				isPlayer ? 'items-end' : 'items-start'
			)}
		>
			<div
				className={cn(
					'flex w-full items-start gap-3',
					isPlayer ? 'justify-end' : 'justify-start'
				)}
			>
				{!isPlayer && (
					<Avatar className="h-8 w-8">
						<AvatarFallback>GM</AvatarFallback>
					</Avatar>
				)}

				{'loading' in message ? (
					<MessageContentWrapper isPlayer={isPlayer}>
						<MessageLoading />
					</MessageContentWrapper>
				) : (
					<MessageContentWrapper isPlayer={isPlayer}>
						<p className="whitespace-pre-wrap">{message.content}</p>
					</MessageContentWrapper>
				)}

				{isPlayer && (
					<Avatar className="h-8 w-8">
						<AvatarFallback>YOU</AvatarFallback>
					</Avatar>
				)}
			</div>

			{isPlayer && relevanceForPlayer && (
				<span className="text-muted-foreground text-[10px]">
					{relevanceLabel(relevanceForPlayer)} (
					{Math.round(relevanceForPlayer * 100)}%)
				</span>
			)}
		</div>
	);
};
