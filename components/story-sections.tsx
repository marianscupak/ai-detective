'use client';

import { CheckCircle, CircleDashed, Clock } from 'lucide-react';

import {
	type CaseLeaderboardEntry,
	type Character,
	type DetectiveCase
} from '@/types/case';

import { Leaderboard } from './leaderboard';

export const StoryHeader = ({
	story,
	isSolvedForUser
}: {
	story: DetectiveCase;
	isSolvedForUser: boolean;
}) => {
	const formattedDate = new Date(story.createdAt).toLocaleDateString();

	return (
		<header id="summary-section" className="mb-10 scroll-mt-4 border-b pb-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<Clock className="h-4 w-4 text-gray-400" />
					<span>{formattedDate}</span>
				</div>

				{isSolvedForUser ? (
					<div className="flex items-center gap-1 rounded-full border border-blue-700 px-3 py-1 text-sm font-medium text-blue-700">
						<CheckCircle className="h-4 w-4" />
						Solved
					</div>
				) : (
					<div className="flex items-center gap-1 rounded-full border border-gray-400 px-3 py-1 text-sm font-medium text-gray-600">
						<CircleDashed className="h-4 w-4" />
						Unsolved
					</div>
				)}
			</div>

			<h1 className="mt-4 text-4xl font-bold text-gray-900">{story.title}</h1>

			<p className="mt-4 max-w-2xl text-gray-700">{story.summary}</p>
		</header>
	);
};

export const StoryEvidenceSection = ({ story }: { story: DetectiveCase }) => (
	<section
		id="evidence-section"
		className="mb-12 scroll-mt-24 rounded-xl bg-white p-6 shadow"
	>
		<h2 className="mb-4 text-2xl font-semibold text-gray-900">Evidence</h2>

		<ul className="space-y-3 text-gray-700">
			{story.evidence.map(e => (
				<li key={e.id} className="border-t pt-3">
					<strong>{e.location}:</strong> {e.description}
				</li>
			))}
		</ul>
	</section>
);

export const StoryCharactersSection = ({ story }: { story: DetectiveCase }) => (
	<section
		id="characters-section"
		className="mb-12 scroll-mt-24 rounded-xl bg-white p-6 shadow"
	>
		<h2 className="mb-4 text-2xl font-semibold text-gray-900">Characters</h2>

		<ul className="space-y-6">
			<li>
				<h3 className="text-lg font-medium">{story.characters.player.name}</h3>
				<p className="text-sm text-gray-500">Player</p>
				<p className="mt-1 text-gray-700">
					{story.characters.player.description}
				</p>
			</li>

			<li>
				<h3 className="text-lg font-medium">
					{story.characters.victimOrTarget.name}
				</h3>
				<p className="text-sm text-gray-500">Victim</p>
				<p className="mt-1 text-gray-700">
					{story.characters.victimOrTarget.description}
				</p>
			</li>

			{story.characters.suspects.map((character: Character) => (
				<li key={character.id}>
					<h3 className="text-lg font-medium">{character.name}</h3>
					<p className="text-sm text-gray-500">Suspect</p>
					<p className="mt-1 text-gray-700">{character.description}</p>
				</li>
			))}
		</ul>
	</section>
);

export const StoryCaseDetailsSection = ({
	story
}: {
	story: DetectiveCase;
}) => (
	<section
		id="case-details-section"
		className="mb-12 scroll-mt-24 rounded-xl bg-white p-6 shadow"
	>
		<h2 className="mb-4 text-2xl font-semibold text-gray-900">Case Details</h2>

		<ul className="space-y-2 text-gray-700">
			<li>
				<strong>Incident:</strong> {story.setting.incident}
			</li>
			<li>
				<strong>Location:</strong> {story.setting.location}
			</li>
			<li>
				<strong>Date & Time:</strong> {story.setting.dateTime}
			</li>
			<li>
				<strong>Theme:</strong> {story.theme}
			</li>
		</ul>
	</section>
);

export const StoryLeaderboardSection = ({
	entries
}: {
	entries: CaseLeaderboardEntry[];
}) => (
	<section
		id="leaderboard-section"
		className="mb-12 scroll-mt-24 rounded-xl bg-white p-6 shadow"
	>
		<h2 className="mb-4 text-2xl font-semibold text-gray-900">
			Top Detectives
		</h2>

		<Leaderboard entries={entries} />
	</section>
);
export default {
	StoryHeader,
	StoryEvidenceSection,
	StoryCharactersSection,
	StoryCaseDetailsSection,
	StoryLeaderboardSection
};
