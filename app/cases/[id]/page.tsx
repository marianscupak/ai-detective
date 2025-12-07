import Link from 'next/link';

import { CaseAsideNav } from '@/components/case-aside-nav';
import {
	CaseHeader,
	CaseEvidenceSection,
	CaseCharactersSection,
	CaseDetailsSection,
	CaseLeaderboardSection
} from '@/components/case-sections';
import {
	getDetectiveCaseById,
	getLeaderboardForCase,
	userHasCompletedCase
} from '@/server-actions/case';

type CasePageProps = {
	params: { id: string };
};

const CasePage = async ({ params }: CasePageProps) => {
	const { id } = await params;
	const Case = await getDetectiveCaseById(id);
	const isSolvedForUser = await userHasCompletedCase(id);
	const leaderboard = await getLeaderboardForCase(id);

	return (
		<div className="relative flex">
			<CaseAsideNav
				items={[
					{ id: 'summary-section', label: 'Summary' },
					{ id: 'case-details-section', label: 'Case Details' },
					{ id: 'evidence-section', label: 'Evidence' },
					{ id: 'characters-section', label: 'Characters' },
					{ id: 'leaderboard-section', label: 'Leaderboard' }
				]}
			/>

			<main className="mx-auto max-w-4xl flex-1 px-8 py-12 md:ml-64">
				<CaseHeader Case={Case} isSolvedForUser={isSolvedForUser} />
				<CaseDetailsSection Case={Case} />
				<CaseEvidenceSection Case={Case} />
				<CaseCharactersSection Case={Case} />
				<CaseLeaderboardSection entries={leaderboard} />

				<div className="mt-10 flex justify-end">
					<Link
						href={`/case/${id}/investigation`}
						className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow transition hover:bg-blue-700"
					>
						{isSolvedForUser ? 'View Solution' : 'Solve Mystery'}
					</Link>
				</div>
			</main>
		</div>
	);
};

export default CasePage;
