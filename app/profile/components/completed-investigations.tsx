import { Suspense } from 'react';

import InvestigationsLoader from './loaders/investigations-loader';
import CompletedInvestigationList from './completed-investigation-list';

const CompletedInvestigations = () => {
	return (
		<>
			<h2 className="font-semibold lg:text-xl">Completed investigations</h2>
			<ul className="flex flex-col gap-2 overflow-y-auto">
				<Suspense fallback={<InvestigationsLoader />}>
					<CompletedInvestigationList />
				</Suspense>
			</ul>
		</>
	);
};

export default CompletedInvestigations;
