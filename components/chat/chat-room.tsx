'use client';

import { SendHorizontal } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';

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
import { type Case } from '@/types/case';

import { type ChatMessage } from './types';

type ChatRoomProps = {
	caseDetails: Case;
};

export const ChatRoom = ({ caseDetails }: ChatRoomProps) => {
	// State for managing the list of messages
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 'init',
			role: 'gameMaster',
			content: caseDetails.backstory
		}
	]);

	// State for the user's current input
	const [input, setInput] = useState('');

	// Ref for the scroll area to automatically scroll down
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	// Function to handle sending a message
	const handleSendMessage = (e: FormEvent) => {
		e.preventDefault();
		if (input.trim() === '') return;

		const newPlayerMessage: ChatMessage = {
			id: `player-${Date.now()}`,
			role: 'player',
			content: input
		};

		setMessages(prev => [...prev, newPlayerMessage]);
		setInput('');

		// --- AI Response Simulation ---
		// In a real app, you would make an API call here.
		// We'll simulate a delayed response.
		setTimeout(() => {
			const aiResponse: ChatMessage = {
				id: `gm-${Date.now()}`,
				role: 'gameMaster',
				content: "That's an interesting theory. What makes you say that?"
			};
			setMessages(prev => [...prev, aiResponse]);
		}, 1200);
	};

	// Effect to scroll to the bottom whenever messages change
	useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTo({
				top: scrollAreaRef.current.scrollHeight,
				behavior: 'smooth'
			});
		}
	}, [messages]);

	return (
		<Card className="mx-auto flex h-[90vh] w-full max-w-3xl flex-col">
			<CardHeader>
				<CardTitle>{caseDetails.title}</CardTitle>
				<CardDescription>{caseDetails.setting.location}</CardDescription>
			</CardHeader>

			<CardContent className="flex-grow overflow-hidden">
				<ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
					<div className="space-y-6">
						{messages.map(message => (
							<ChatMessageBubble key={message.id} message={message} />
						))}
					</div>
				</ScrollArea>
			</CardContent>

			<CardFooter>
				<form
					onSubmit={handleSendMessage}
					className="flex w-full items-center space-x-2"
				>
					<Input
						id="message"
						placeholder="Type your theory..."
						className="flex-1"
						autoComplete="off"
						value={input}
						onChange={e => setInput(e.target.value)}
					/>
					<Button type="submit" size="icon">
						<SendHorizontal className="h-4 w-4" />
						<span className="sr-only">Send</span>
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
};

// Sub-component for rendering a single message bubble
const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
	const isPlayer = message.role === 'player';

	return (
		<div
			className={cn(
				'flex items-start gap-3',
				isPlayer ? 'justify-end' : 'justify-start'
			)}
		>
			{!isPlayer && (
				<Avatar className="h-8 w-8">
					<AvatarFallback>GM</AvatarFallback>
				</Avatar>
			)}
			<div
				className={cn(
					'max-w-sm rounded-lg px-4 py-2 text-sm',
					isPlayer ? 'bg-primary text-primary-foreground' : 'bg-muted'
				)}
			>
				<p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
			</div>
			{isPlayer && (
				<Avatar className="h-8 w-8">
					<AvatarFallback>YOU</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
