'use client';

import { CheckCircle, Clock, Search } from 'lucide-react';
import { useState } from 'react';

export type FilterOptions = {
	solved: 'all' | 'solved' | 'unsolved';
	date: 'newest' | 'oldest';
	search: string;
	theme: string;
};

export const FilterBar = ({
	onChange,
	themes
}: {
	onChange: (filters: FilterOptions) => void;
	themes: string[];
}) => {
	const [filters, setFilters] = useState<FilterOptions>({
		solved: 'all',
		date: 'newest',
		search: '',
		theme: ''
	});

	const update = (key: keyof FilterOptions, value: string) => {
		const updated = { ...filters, [key]: value };
		setFilters(updated);
		onChange(updated);
	};

	return (
		<div className="mb-10 flex flex-col items-center gap-4 rounded-2xl bg-white p-5 shadow-md md:flex-row">
			<div className="relative w-full md:flex-1">
				<Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Find case..."
					className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-gray-700"
					value={filters.search}
					onChange={e => update('search', e.target.value)}
				/>
			</div>

			<div className="relative">
				<select
					className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 py-3 pr-8 pl-3 text-gray-700"
					value={filters.theme}
					onChange={e => update('theme', e.target.value)}
				>
					<option value="">All Themes</option>

					{themes.map(theme => (
						<option key={theme} value={theme}>
							{theme}
						</option>
					))}
				</select>
			</div>

			<div className="relative">
				<select
					className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 py-3 pr-8 pl-10 text-gray-700"
					value={filters.solved}
					onChange={e => update('solved', e.target.value)}
				>
					<option value="all">All cases</option>
					<option value="solved">Solved</option>
					<option value="unsolved">Unsolved</option>
				</select>
				<CheckCircle className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
			</div>

			<div className="relative">
				<select
					className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 py-3 pr-8 pl-10 text-gray-700"
					value={filters.date}
					onChange={e => update('date', e.target.value)}
				>
					<option value="newest">Newest first</option>
					<option value="oldest">Oldest first</option>
				</select>
				<Clock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
			</div>
		</div>
	);
};
