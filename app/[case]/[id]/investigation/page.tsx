import { ChatRoom } from '@/components/chat/chat-room';
import { loadGameSession } from '@/server-actions/game';
import { SideControls } from '@/components/chat/side-controls';

const InvestigationPage = async () => {
	const { caseDetails, gameSession, chatHistory } = await loadGameSession(
		'case-orient-express-01'
	);

	return (
		<div className="container mx-auto flex h-screen flex-col items-start gap-8 px-4 py-8 lg:flex-row">
			<div className="w-full flex-grow">
				<ChatRoom
					initialCaseDetails={caseDetails}
					initialGameSession={gameSession}
					initialMessages={chatHistory}
				/>
			</div>

			<div className="w-full lg:w-auto">
				<SideControls gameSessionId={gameSession.id} />
			</div>
		</div>
	);
};

export default InvestigationPage;
