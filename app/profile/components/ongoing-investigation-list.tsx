import Link from 'next/link';
import { format } from 'date-fns';

import { getOngoingInvestigations } from '@/server-actions/profile';

const OngoingInvestigationList = async () => {
	const investigations = await getOngoingInvestigations();

	return investigations.map(inv => (
		<li
			key={inv.caseId}
			className="flex h-28 flex-col justify-between rounded-lg border bg-gray-100 p-2 shadow lg:h-20 lg:flex-row"
		>
			<div className="flex flex-col justify-between gap-1 lg:gap-0">
				<h3 className="text-sm font-semibold lg:text-base">{inv.caseTitle}</h3>
				<div className="flex flex-col gap-1 lg:gap-0">
					<div className="text-xs text-gray-700">
						Started at {format(inv.startedAt, 'MM.dd. p')}
					</div>
					<div className="text-xs text-gray-700">
						Progress:{' '}
						<span className="font-bold">{(inv.progress ?? 0) * 100}%</span>
					</div>
				</div>
			</div>
			<div className="flex items-end justify-around lg:flex-col">
				<Link
					href={`/case/${inv.caseId}/investigation`}
					className="text-xs font-medium xl:text-sm"
				>
					Case details
				</Link>
				<Link
					href={`/case/${inv.caseId}/investigation`}
					className="text-xs font-medium xl:text-sm"
					prefetch={false}
				>
					Continue
				</Link>
			</div>
		</li>
	));
};

export default OngoingInvestigationList;
