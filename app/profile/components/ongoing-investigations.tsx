import { Suspense } from 'react';

import InvestigationsLoader from './loaders/investigations-loader';
import OngoingInvestigationList from './ongoing-investigation-list';

const OngoingInvestigations = () => {
	return (
		<>
			<h2 className="font-semibold lg:text-xl">Ongoing investigations</h2>
			<ul className="flex flex-col gap-2 overflow-y-auto">
				<Suspense fallback={<InvestigationsLoader />}>
					<OngoingInvestigationList />
				</Suspense>
			</ul>
		</>
	);
};

export default OngoingInvestigations;
