import { ChatMessageBubble } from '@/components/chat/chat-message-bubble';

export const AiMessageLoadingBubble = () => {
	return (
		<ChatMessageBubble
			message={{ role: 'gameMaster', loading: true } as const}
		/>
	);
};
