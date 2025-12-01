'use client';

import { SendHorizontal } from 'lucide-react';
import {
	useEffect,
	useRef,
	useState,
	useTransition,
	type FormEvent,
	type PropsWithChildren,
	useCallback
} from 'react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type DetectiveCase } from '@/types/case';
import { type ChatMessage, type GameSession } from '@/types/game';
import { sendChatMessage } from '@/server-actions/game';
import { MessageLoading } from '@/components/chat/message-loading';

type ChatRoomProps = {
	initialCaseDetails: DetectiveCase;
	initialGameSession: GameSession;
	initialMessages: ChatMessage[];
};

export const ChatRoom = ({
	initialCaseDetails,
	initialGameSession,
	initialMessages
}: ChatRoomProps) => {
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [input, setInput] = useState('');
	const [isPending, startTransition] = useTransition();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const currentProgress =
		[...messages]
			.reverse()
			.find(
				m =>
					m.role === 'gameMaster' &&
					m.progress !== null &&
					m.progress !== undefined
			)?.progress ?? 0;

	useEffect(() => {
		if (!isPending) {
			inputRef.current?.focus();
		}
	}, [isPending]);

	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}, [messages.length]);

	const handleSendMessage = async (e: FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isPending) return;

		const content = input;
		setInput('');

		setMessages(prev => [
			...prev,
			{
				id: `temp-${Date.now()}`,
				role: 'player',
				content,
				gameSessionId: initialGameSession.id,
				createdAt: new Date()
			}
		]);

		startTransition(async () => {
			try {
				const aiMessage = await sendChatMessage(
					initialCaseDetails.id,
					initialGameSession.id,
					content
				);
				setMessages(prev => [...prev, aiMessage]);
			} catch {
				setMessages(prev => [
					...prev,
					{
						id: `err-${Date.now()}`,
						role: 'gameMaster',
						content: 'An error occurred. Please try again.',
						gameSessionId: initialGameSession.id,
						createdAt: new Date()
					}
				]);
			}
		});
	};

	return (
		<Card className="mx-auto flex h-[95%] w-full max-w-3xl flex-col">
			<CardHeader>
				<CardTitle>{initialCaseDetails.title}</CardTitle>
				<CardDescription>{initialCaseDetails.setting.location}</CardDescription>

				<div className="mt-4 flex flex-col gap-2">
					<div className="text-muted-foreground flex justify-between text-xs">
						<span>Case progress</span>
						<span>{Math.round(currentProgress * 100)}%</span>
					</div>
					<div className="bg-muted h-2 w-full overflow-hidden rounded-full">
						<div
							className="bg-primary h-full rounded-full transition-all"
							style={{ width: `${currentProgress * 100}%` }}
						/>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden">
				<ScrollArea className="h-full pr-4">
					<div className="flex h-full flex-col space-y-6">
						{messages.map((message, index) => {
							const next = messages[index + 1];

							const relevanceForPlayer =
								message.role === 'player' &&
								next?.role === 'gameMaster' &&
								'relevance' in next &&
								typeof next.relevance === 'number'
									? next.relevance
									: undefined;

							return (
								<ChatMessageBubble
									key={message.id}
									message={message}
									relevanceForPlayer={relevanceForPlayer}
								/>
							);
						})}

						{isPending && <AiMessageLoadingBubble />}
						<div ref={bottomRef} />
					</div>
				</ScrollArea>
			</CardContent>

			<CardFooter>
				<form
					onSubmit={handleSendMessage}
					className="flex w-full items-center space-x-2"
				>
					<Input
						ref={inputRef}
						placeholder={
							isPending ? 'The AI is thinking…' : 'Type your theory…'
						}
						className="flex-1"
						autoComplete="off"
						value={input}
						onChange={e => setInput(e.target.value)}
						disabled={isPending}
					/>
					<Button type="submit" size="icon" disabled={isPending}>
						<SendHorizontal className="h-4 w-4" />
						<span className="sr-only">Send</span>
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
};

export const ChatMessageBubble = ({
	message,
	relevanceForPlayer
}: {
	message: ChatMessage | (Pick<ChatMessage, 'role'> & { loading: true });
	relevanceForPlayer?: number;
}) => {
	const isPlayer = message.role === 'player';

	const MessageContentWrapper = useCallback(
		({ children }: PropsWithChildren) => (
			<div
				className={cn(
					'max-w-sm rounded-lg px-4 py-2 text-sm',
					isPlayer ? 'bg-primary text-primary-foreground' : 'bg-muted'
				)}
			>
				{children}
			</div>
		),
		[isPlayer]
	);

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
					<MessageContentWrapper>
						<MessageLoading />
					</MessageContentWrapper>
				) : (
					<MessageContentWrapper>
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

const AiMessageLoadingBubble = () => {
	return (
		<ChatMessageBubble
			message={{ role: 'gameMaster', loading: true } as const}
		/>
	);
};
