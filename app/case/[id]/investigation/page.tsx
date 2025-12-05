import { loadGameSession } from '@/server-actions/game';
import { GameClientShell } from '@/components/chat/game-client-shell';

type Props = {
	params: Promise<{
		id: string;
	}>;
};

const InvestigationPage = async ({ params }: Props) => {
	const { id } = await params;
	const { caseDetails, gameSession, chatHistory } = await loadGameSession(id);

	return (
		<GameClientShell
			initialCaseDetails={caseDetails}
			initialGameSession={gameSession}
			initialMessages={chatHistory}
		/>
	);
};

export default InvestigationPage;
