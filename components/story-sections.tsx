'use client';

import { type Character, type DetectiveCase } from '@/types/case';

export const StoryHeader = ({ story }: { story: DetectiveCase }) => (
	<header id="summary-section" className="mb-12 scroll-mt-24">
		<h1 className="text-4xl font-bold text-gray-900">{story.title}</h1>
		<p className="mt-4 text-lg text-gray-700">{story.summary}</p>
	</header>
);

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
			<li>
				<strong>Created:</strong>{' '}
				{new Date(story.createdAt).toLocaleDateString()}
			</li>
		</ul>
	</section>
);

export default {
	StoryHeader,
	StoryEvidenceSection,
	StoryCharactersSection,
	StoryCaseDetailsSection
};
