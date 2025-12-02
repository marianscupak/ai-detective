'use client';

import { SendHorizontal } from 'lucide-react';
import {
	useEffect,
	useRef,
	useState,
	useTransition,
	type FormEvent,
	useCallback
} from 'react';

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
import { getGameSessionStatus, sendChatMessage } from '@/server-actions/game';
import { ChatMessageBubble } from '@/components/chat/chat-message-bubble';
import { AiMessageLoadingBubble } from '@/components/chat/ai-message-loading-bubble';
import { GameConclusion } from '@/components/chat/game-conclusion';

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

	const [isGameFinished, setIsGameFinished] = useState(
		initialGameSession.status === 'completed'
	);

	const [currentProgress, setCurrentProgress] = useState(
		initialGameSession.progress ?? 0
	);

	useEffect(() => {
		if (!isPending && !isGameFinished) {
			inputRef.current?.focus();
		}
	}, [isPending, isGameFinished]);

	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}, [messages.length]);

	const reloadProgress = useCallback(async () => {
		const gameSession = await getGameSessionStatus(initialGameSession.id);
		setCurrentProgress(gameSession.progress ?? 0);

		if (gameSession.status === 'completed') {
			setIsGameFinished(true);
		}
	}, [initialGameSession.id]);

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

				await reloadProgress();
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
				{isGameFinished ? (
					<GameConclusion />
				) : (
					<form
						onSubmit={handleSendMessage}
						className="flex w-full items-center space-x-2"
					>
						<Input
							ref={inputRef}
							placeholder={
								isPending ? 'The game master is thinking…' : 'Type your theory…'
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
				)}
			</CardFooter>
		</Card>
	);
};
