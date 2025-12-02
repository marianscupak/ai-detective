import { type PropsWithChildren } from 'react';
import { Tooltip } from '@radix-ui/react-tooltip';

import type { ChatMessage } from '@/types/game';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageLoading } from '@/components/chat/message-loading';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

type Props = {
	message: ChatMessage | (Pick<ChatMessage, 'role'> & { loading: true });
	relevanceForPlayer?: number;
	isGameFinished?: boolean;
	reasoningForPlayer?: string;
};

export const ChatMessageBubble = ({
	message,
	relevanceForPlayer,
	isGameFinished,
	reasoningForPlayer
}: Props) => {
	const isPlayer = message.role === 'player';

	const relevanceLabel = (r: number) => {
		if (r >= 0.9) return 'Bullseye';
		if (r >= 0.7) return 'Very close';
		if (r >= 0.4) return 'On the trail';
		if (r >= 0.1) return 'Off track';
		return 'Way off';
	};

	const canShowTooltip = isGameFinished && !!reasoningForPlayer;

	console.log({ isGameFinished, reasoningForPlayer, message });

	const PlayerMessageContent = () => (
		<div className="flex flex-col items-end gap-1">
			{'loading' in message ? (
				<MessageContentWrapper isPlayer={isPlayer}>
					<MessageLoading />
				</MessageContentWrapper>
			) : (
				<MessageContentWrapper isPlayer={isPlayer}>
					<p className="whitespace-pre-wrap">{message.content}</p>
				</MessageContentWrapper>
			)}

			{relevanceForPlayer !== undefined && (
				<span className="text-muted-foreground text-[10px]">
					{relevanceLabel(relevanceForPlayer)} (
					{Math.round(relevanceForPlayer * 100)}%)
				</span>
			)}
		</div>
	);

	return (
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

			{isPlayer ? (
				canShowTooltip ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="cursor-help">
								<PlayerMessageContent />
							</div>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs" side="top">
							<p className="font-bold">AI Reasoning:</p>
							<p>{reasoningForPlayer}</p>
						</TooltipContent>
					</Tooltip>
				) : (
					<PlayerMessageContent />
				)
			) : 'loading' in message ? (
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
	);
};
