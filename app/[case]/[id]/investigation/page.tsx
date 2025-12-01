import { ChatRoom } from '@/components/chat/chat-room';
import { loadGameSession } from '@/lib/actions/game';

const InvestigationPage = async () => {
	const caseDetails = await loadGameSession('case-orient-express-01');

	return (
		<ChatRoom
			initialCaseDetails={caseDetails.caseDetails}
			initialGameSession={caseDetails.gameSession}
			initialMessages={caseDetails.chatHistory}
		/>
	);
};

export default InvestigationPage;
