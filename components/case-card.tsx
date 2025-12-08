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
		<div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow">
			<div className="mb-3 flex items-center justify-between">
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<Clock className="text-muted-foreground h-4 w-4" />
					<span>{formattedDate}</span>
				</div>

				{isSolvedForUser ? (
					<div className="flex items-center gap-1 rounded-full border border-blue-900 px-3 py-1 text-sm font-medium text-blue-900">
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

			<h2 className="text-foreground mb-3 text-xl font-semibold">{title}</h2>

			<p className="text-muted-foreground mb-6 text-sm leading-relaxed">
				{summary}
			</p>

			<Link
				href={`/cases/${id}`}
				className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-900"
			>
				Case details
			</Link>
		</div>
	);
};

export default CaseCard;
