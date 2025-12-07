import Link from 'next/link';

import { StoryAsideNav } from '@/components/story-aside-nav';
import {
	StoryHeader,
	StoryEvidenceSection,
	StoryCharactersSection,
	StoryCaseDetailsSection,
	StoryLeaderboardSection
} from '@/components/story-sections';
import {
	getDetectiveCaseById,
	getLeaderboardForCase,
	userHasCompletedCase
} from '@/server-actions/case';

type StoryPageProps = {
	params: { storyId: string };
};

const StoryPage = async ({ params }: StoryPageProps) => {
	const { storyId } = await params;
	const story = await getDetectiveCaseById(storyId);
	const isSolvedForUser = await userHasCompletedCase(storyId);
	const leaderboard = await getLeaderboardForCase(storyId);

	return (
		<div className="relative flex">
			<StoryAsideNav
				items={[
					{ id: 'summary-section', label: 'Summary' },
					{ id: 'case-details-section', label: 'Case Details' },
					{ id: 'evidence-section', label: 'Evidence' },
					{ id: 'characters-section', label: 'Characters' },
					{ id: 'leaderboard-section', label: 'Leaderboard' }
				]}
			/>

			<main className="mx-auto max-w-4xl flex-1 px-8 py-12 md:ml-64">
				<StoryHeader story={story} isSolvedForUser={isSolvedForUser} />
				<StoryCaseDetailsSection story={story} />
				<StoryEvidenceSection story={story} />
				<StoryCharactersSection story={story} />
				<StoryLeaderboardSection entries={leaderboard} />

				<div className="mt-10 flex justify-end">
					<Link
						href={`/cases/${storyId}/investigation`}
						className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow transition hover:bg-blue-700"
					>
						Solve Mystery
					</Link>
				</div>
			</main>
		</div>
	);
};

export default StoryPage;
