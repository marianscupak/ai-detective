import Link from 'next/link';
import { format } from 'date-fns';

import { getOngoingInvestigations } from '@/server-actions/profile';

const OngoingInvestigationList = async () => {
	const investigations = await getOngoingInvestigations();

	return investigations.map(inv => (
		<li
			key={inv.caseId}
			className="flex h-fit min-h-28 w-full shrink-0 flex-col justify-between gap-2 rounded-lg border bg-gray-100 p-2 shadow not-only:w-9/10 md:min-h-24 md:w-full md:not-only:w-full lg:h-20 lg:min-h-auto lg:flex-row lg:gap-0"
		>
			<div className="flex flex-col justify-between md:gap-1 lg:gap-0">
				<h3 className="font-semibold md:text-sm lg:text-base">
					{inv.caseTitle}
				</h3>
				<div className="flex flex-col text-sm text-gray-700 md:gap-1 md:text-xs lg:gap-0">
					<div>Started at {format(inv.startedAt, 'MM.dd. p')}</div>
					<div>
						Progress:{' '}
						<span className="font-bold">{(inv.progress ?? 0) * 100}%</span>
					</div>
				</div>
			</div>
			<div className="flex items-end justify-around lg:flex-col">
				<Link
					href={`/case/${inv.caseId}/investigation`}
					className="text-sm font-medium md:text-xs xl:text-sm"
				>
					Case details
				</Link>
				<Link
					href={`/case/${inv.caseId}/investigation`}
					className="text-sm font-medium md:text-xs xl:text-sm"
				>
					Continue
				</Link>
			</div>
		</li>
	));
};

export default OngoingInvestigationList;
