import { Suspense } from 'react';

import InvestigationsLoader from './loaders/investigations-loader';
import OngoingInvestigationList from './ongoing-investigation-list';

const OngoingInvestigations = () => {
	return (
		<>
			<h2 className="text-xl font-semibold md:text-base lg:text-xl">
				Ongoing investigations
			</h2>
			<ul className="flex gap-2 overflow-x-scroll md:flex-col md:overflow-x-auto md:overflow-y-auto">
				<Suspense fallback={<InvestigationsLoader />}>
					<OngoingInvestigationList />
				</Suspense>
			</ul>
		</>
	);
};

export default OngoingInvestigations;
