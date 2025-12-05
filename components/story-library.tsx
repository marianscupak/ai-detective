'use client';

import { StoryCard } from '@/components/story-card';
import { FilterBar } from '@/components/filter-bar';
import { useStoriesFilter } from '@/hooks/useStoriesFilter';
import { type DetectiveCaseBaseView } from '@/types/case';

type StoryLibraryProps = {
	stories: DetectiveCaseBaseView[];
	themes: string[];
};

export const StoryLibrary = ({ stories, themes }: StoryLibraryProps) => {
	const { filteredStories, setFilters } = useStoriesFilter(stories);

	return (
		<div className="min-h-screen bg-gray-100 px-6 py-10">
			<div className="mx-auto max-w-6xl">
				<header className="mb-10">
					<h1 className="text-4xl font-semibold text-gray-900">Stories</h1>
				</header>

				<FilterBar themes={themes} onChange={setFilters} />

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{filteredStories.map(story => (
						<StoryCard key={story.id} story={story} />
					))}
				</div>
			</div>
		</div>
	);
};

export default StoryLibrary;
