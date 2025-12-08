import { notFound } from 'next/navigation';
import { type Metadata } from 'next';

import { loadGameSession } from '@/server-actions/game';
import { GameClientShell } from '@/components/chat/game-client-shell';
import { getDetectiveCaseById } from '@/server-actions/case';

export const generateMetadata = async ({
	params
}: Props): Promise<Metadata> => {
	const { id } = await params;

	const detectiveCase = await getDetectiveCaseById(id);

	return {
		title: detectiveCase.title,
		description: detectiveCase.summary
	};
};

type Props = {
	params: Promise<{
		id: string;
	}>;
};

const InvestigationPage = async ({ params }: Props) => {
	const { id } = await params;

	try {
		const { caseDetails, gameSession, chatHistory } = await loadGameSession(id);

		return (
			<GameClientShell
				initialCaseDetails={caseDetails}
				initialGameSession={gameSession}
				initialMessages={chatHistory}
			/>
		);
	} catch {
		notFound();
	}
};

export default InvestigationPage;
