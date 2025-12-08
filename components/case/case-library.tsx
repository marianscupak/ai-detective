'use client';

import { CaseCard } from '@/components/case/case-card';
import { FilterBar } from '@/components/case/filter-bar';
import { useCasesFilter } from '@/hooks/useCasesFilter';
import { type DetectiveCaseListItem } from '@/types/case';

type LibraryProps = {
	cases: DetectiveCaseListItem[];
	themes: string[];
};

export const CaseLibrary = ({ cases, themes }: LibraryProps) => {
	const { filteredCases, setFilters } = useCasesFilter(cases);

	return (
		<div className="min-h-screen bg-gray-100 px-6 py-10">
			<div className="mx-auto max-w-6xl">
				<header className="mb-10">
					<h1 className="text-4xl font-semibold text-gray-900">Cases</h1>
				</header>

				<FilterBar themes={themes} onChange={setFilters} />

				{filteredCases.length === 0 ? (
					<div className="mt-10 rounded-xl bg-white p-10 text-center text-gray-600 shadow">
						No cases available to solve.
					</div>
				) : (
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{filteredCases.map(story => (
							<CaseCard key={story.id} story={story} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CaseLibrary;
