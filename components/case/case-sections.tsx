'use client';

import { CheckCircle, CircleDashed, Clock } from 'lucide-react';
import { format } from 'date-fns';

import {
	type CaseLeaderboardEntry,
	type Character,
	type DetectiveCase
} from '@/types/case';

import { Leaderboard } from './leaderboard';

export const CaseHeader = ({
	Case,
	isSolvedForUser
}: {
	Case: DetectiveCase;
	isSolvedForUser: boolean;
}) => {
	const formattedDate = format(new Date(Case.createdAt), 'MMM d, yyyy');

	return (
		<header id="summary-section" className="mb-10 scroll-mt-4 border-b pb-6">
			<div className="flex items-center justify-between">
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<Clock className="text-muted-foreground h-4 w-4" />
					<span>{formattedDate}</span>
				</div>

				{isSolvedForUser ? (
					<div className="flex items-center gap-1 rounded-full border border-blue-700 px-3 py-1 text-sm font-medium text-blue-700">
						<CheckCircle className="h-4 w-4" />
						Solved
					</div>
				) : (
					<div className="text-muted-foreground flex items-center gap-1 rounded-full border border-gray-400 px-3 py-1 text-sm font-medium">
						<CircleDashed className="h-4 w-4" />
						Unsolved
					</div>
				)}
			</div>

			<h1 className="text-foreground mt-4 text-4xl font-bold">{Case.title}</h1>

			<p className="text-foreground mt-4 max-w-2xl">{Case.summary}</p>
		</header>
	);
};

export const CaseEvidenceSection = ({ Case }: { Case: DetectiveCase }) => (
	<section
		id="evidence-section"
		className="bg-card mb-12 scroll-mt-24 rounded-xl p-6 shadow"
	>
		<h2 className="text-foreground mb-4 text-2xl font-semibold">Evidence</h2>

		<ul className="text-foreground space-y-3">
			{Case.evidence.map(e => (
				<li key={e.id} className="border-t pt-3">
					<strong>{e.location}:</strong> {e.description}
				</li>
			))}
		</ul>
	</section>
);

export const CaseCharactersSection = ({ Case }: { Case: DetectiveCase }) => (
	<section
		id="characters-section"
		className="bg-card mb-12 scroll-mt-24 rounded-xl p-6 shadow"
	>
		<h2 className="text-foreground mb-4 text-2xl font-semibold">Characters</h2>

		<ul className="space-y-6">
			<li>
				<h3 className="text-lg font-medium">{Case.characters.player.name}</h3>
				<p className="text-muted-foreground text-sm">Player</p>
				<p className="text-foreground mt-1">
					{Case.characters.player.description}
				</p>
			</li>

			<li>
				<h3 className="text-lg font-medium">
					{Case.characters.victimOrTarget.name}
				</h3>
				<p className="text-muted-foreground text-sm">Victim</p>
				<p className="text-foreground mt-1">
					{Case.characters.victimOrTarget.description}
				</p>
			</li>

			{Case.characters.suspects.map((character: Character) => (
				<li key={character.id}>
					<h3 className="text-lg font-medium">{character.name}</h3>
					<p className="text-muted-foreground text-sm">Suspect</p>
					<p className="text-foreground mt-1">{character.description}</p>
				</li>
			))}
		</ul>
	</section>
);

export const CaseDetailsSection = ({ Case }: { Case: DetectiveCase }) => {
	const formattedDateTime = format(
		new Date(Case.setting.dateTime),
		'dd.MM.yyyy HH:mm'
	);
	return (
		<section
			id="case-details-section"
			className="bg-card mb-12 scroll-mt-24 rounded-xl p-6 shadow"
		>
			<h2 className="text-foreground mb-4 text-2xl font-semibold">
				Case Details
			</h2>

			<ul className="text-foreground space-y-2">
				<li>
					<strong>Incident:</strong> {Case.setting.incident}
				</li>
				<li>
					<strong>Location:</strong> {Case.setting.location}
				</li>
				<li>
					<strong>Date & Time:</strong> {formattedDateTime}
				</li>
				<li>
					<strong>Theme:</strong> {Case.theme}
				</li>
			</ul>
		</section>
	);
};

export const CaseLeaderboardSection = ({
	entries
}: {
	entries: CaseLeaderboardEntry[];
}) => (
	<section
		id="leaderboard-section"
		className="bg-card mb-12 scroll-mt-24 rounded-xl p-6 shadow"
	>
		<h2 className="text-foreground mb-4 text-2xl font-semibold">
			Top Detectives
		</h2>

		<Leaderboard entries={entries} />
	</section>
);
export default {
	CaseHeader,
	CaseEvidenceSection,
	CaseCharactersSection,
	CaseDetailsSection,
	CaseLeaderboardSection
};
