'use client';

import { Trophy, Medal } from 'lucide-react';

import { type CaseLeaderboardEntry } from '@/types/case';

type Props = {
	entries: CaseLeaderboardEntry[];
};

export const Leaderboard = ({ entries }: Props) => {
	const topThree = entries.slice(0, 3);

	if (topThree.length === 0) {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow">
				No players have solved this case yet.
			</div>
		);
	}

	const medalColor = (index: number) => {
		switch (index) {
			case 0:
				return 'text-yellow-500';
			case 1:
				return 'text-gray-400';
			case 2:
				return 'text-amber-700';
			default:
				return 'text-gray-500';
		}
	};

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
			<h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
				<Trophy className="h-6 w-6 text-yellow-500" />
				Top Detectives
			</h2>

			<div className="space-y-4">
				{topThree.map((entry, index) => (
					<div
						key={entry.userId}
						className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
					>
						<div className="flex items-center gap-3">
							<Medal className={`h-6 w-6 ${medalColor(index)}`} />
							<div>
								<p className="font-medium text-gray-900">{entry.userName}</p>
								<p className="text-sm text-gray-500">
									{entry.messageCount} messages
								</p>
							</div>
						</div>

						<span className="text-xl font-bold text-gray-700">
							#{index + 1}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
