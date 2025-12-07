import { CheckCircle, CircleDashed, Clock } from 'lucide-react';
import Link from 'next/link';

import { type DetectiveCaseListItem } from '@/types/case';

type Props = {
	story: DetectiveCaseListItem;
};

export const CaseCard = ({ story }: Props) => {
	const { id, title, summary, createdAt, isSolvedForUser } = story;

	const formattedDate = new Date(createdAt).toLocaleDateString();

	return (
		<div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow">
			<div className="mb-3 flex items-center justify-between">
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

			<h2 className="mb-3 text-xl font-semibold text-gray-900">{title}</h2>

			<p className="mb-6 text-sm leading-relaxed text-gray-600">{summary}</p>

			<Link
				href={`/cases/${id}`}
				className="inline-block rounded-lg bg-blue-500 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
			>
				Case details
			</Link>
		</div>
	);
};

export default CaseCard;
