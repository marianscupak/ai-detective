import { type PropsWithChildren } from 'react';

import type { ChatMessage } from '@/types/game';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageLoading } from '@/components/chat/message-loading';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip';

type BubbleVariant = 'player' | 'gm' | 'hintRequest' | 'hintResponse';

const MessageContentWrapper = ({
	children,
	variant
}: PropsWithChildren<{ variant: BubbleVariant }>) => (
	<div
		className={cn(
			'max-w-sm rounded-lg px-4 py-2 text-sm',
			variant === 'player' && 'bg-primary text-primary-foreground',
			variant === 'gm' && 'bg-muted',
			variant === 'hintRequest' &&
				'bg-amber-100 text-amber-950 dark:bg-amber-900 dark:text-amber-50',
			variant === 'hintResponse' &&
				'bg-sky-100 text-sky-950 dark:bg-sky-900 dark:text-sky-50'
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
	const isLoading = 'loading' in message;

	let bubbleVariant: BubbleVariant;

	if (!isLoading) {
		if (message.type === 'hintRequest') {
			bubbleVariant = 'hintRequest';
		} else if (message.type === 'hintResponse') {
			bubbleVariant = 'hintResponse';
		} else {
			bubbleVariant = isPlayer ? 'player' : 'gm';
		}
	} else {
		bubbleVariant = isPlayer ? 'player' : 'gm';
	}

	const relevanceLabel = (r: number) => {
		if (r >= 0.9) return 'Bullseye';
		if (r >= 0.7) return 'Very close';
		if (r >= 0.4) return 'On the trail';
		if (r >= 0.1) return 'Off track';
		return 'Way off';
	};

	const canShowTooltip = isGameFinished && !!reasoningForPlayer;

	const PlayerMessageContent = ({ variant }: { variant: BubbleVariant }) => (
		<div className="flex flex-col items-end gap-1">
			{!isLoading && message.type === 'hintRequest' && (
				<span className="text-[10px] font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-300">
					Hint requested
				</span>
			)}

			{isLoading ? (
				<MessageContentWrapper variant={variant}>
					<MessageLoading />
				</MessageContentWrapper>
			) : (
				<MessageContentWrapper variant={variant}>
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
								<PlayerMessageContent variant={bubbleVariant} />
							</div>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs" side="top">
							<p className="font-bold">AI Reasoning:</p>
							<p>{reasoningForPlayer}</p>
						</TooltipContent>
					</Tooltip>
				) : (
					<PlayerMessageContent variant={bubbleVariant} />
				)
			) : isLoading ? (
				<MessageContentWrapper variant={bubbleVariant}>
					<MessageLoading />
				</MessageContentWrapper>
			) : (
				<div className="flex flex-col items-start gap-1">
					{message.type === 'hintResponse' && (
						<span className="text-[10px] font-semibold tracking-wide text-sky-600 uppercase dark:text-sky-300">
							Hint
						</span>
					)}

					<MessageContentWrapper variant={bubbleVariant}>
						<p className="whitespace-pre-wrap">{message.content}</p>
					</MessageContentWrapper>
				</div>
			)}

			{isPlayer && (
				<Avatar className="h-8 w-8">
					<AvatarFallback>YOU</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
