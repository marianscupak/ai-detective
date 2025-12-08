import { format } from 'date-fns';
import Link from 'next/link';

import {
	type CompletedUserInvestigation,
	type OngoingUserInvestigation
} from '@/types/game';

type InvestigationCardProps =
	| {
			investigation: OngoingUserInvestigation;
			variant: 'in-progress';
	  }
	| {
			investigation: CompletedUserInvestigation;
			variant: 'completed';
	  };

const InvestigationCard = ({
	investigation,
	variant
}: InvestigationCardProps) => (
	<li className="flex h-fit min-h-28 w-full shrink-0 flex-col justify-between gap-2 rounded-lg border bg-gray-100 p-2 shadow not-only:w-9/10 md:min-h-24 md:w-full md:not-only:w-full lg:h-20 lg:min-h-auto lg:flex-row lg:gap-0">
		<div className="flex flex-col justify-between md:gap-1 lg:gap-0">
			<h3 className="font-semibold md:text-sm lg:text-base">
				{investigation.caseTitle}
			</h3>
			<div className="flex flex-col text-sm text-gray-700 md:gap-1 md:text-xs lg:gap-0">
				{variant === 'completed' ? (
					<>
						<div>
							Completed at {format(investigation.startedAt, 'MM.dd. p')}
						</div>
						<div>
							Total player messages:{' '}
							<span className="font-bold">{investigation.messages}</span>
						</div>
					</>
				) : (
					<>
						<div>Started at {format(investigation.startedAt, 'MM.dd. p')}</div>
						<div>
							Progress:{' '}
							<span className="font-bold">
								{(investigation.progress ?? 0) * 100}%
							</span>
						</div>
					</>
				)}
			</div>
		</div>
		<div className="flex items-end justify-around lg:flex-col">
			<Link
				href={`/case/${investigation.caseId}`}
				className="text-sm font-medium md:text-xs xl:text-sm"
			>
				Case details
			</Link>
			<Link
				href={`/case/${investigation.caseId}/investigation`}
				className="text-sm font-medium md:text-xs xl:text-sm"
			>
				{variant === 'completed' ? 'View investigation' : 'Continue'}
			</Link>
		</div>
	</li>
);

export default InvestigationCard;
