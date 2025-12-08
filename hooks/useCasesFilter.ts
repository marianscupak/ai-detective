'use client';

import { useState, useMemo } from 'react';

import { type DetectiveCaseListItem } from '@/types/case';
import { type FilterOptions } from '@/components/filter-bar';

export const useCasesFilter = (cases: DetectiveCaseListItem[]) => {
	const [filters, setFilters] = useState<FilterOptions>({
		solved: 'all',
		date: 'newest',
		search: '',
		theme: ''
	});

	const filteredCases = useMemo(() => {
		const searchText = filters.search.toLowerCase();
		const selectedTheme = filters.theme.toLowerCase();

		let result = [...cases];

		if (searchText) {
			result = result.filter(story => {
				const title = story.title.toLowerCase();
				const theme = story.theme.toLowerCase();
				const incident = story.incident.toLowerCase();

				return (
					title.includes(searchText) ||
					theme.includes(searchText) ||
					incident.includes(searchText)
				);
			});
		}

		if (selectedTheme) {
			result = result.filter(
				story => story.theme.toLowerCase() === selectedTheme
			);
		}

		if (filters.solved === 'solved') {
			result = result.filter(story => story.isSolvedForUser);
		} else if (filters.solved === 'unsolved') {
			result = result.filter(story => !story.isSolvedForUser);
		}

		result.sort((a, b) => {
			const tA = new Date(a.createdAt).getTime();
			const tB = new Date(b.createdAt).getTime();
			return filters.date === 'newest' ? tB - tA : tA - tB;
		});

		return result;
	}, [cases, filters]);

	return { filteredCases, setFilters };
};
