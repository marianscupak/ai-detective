import { getCompletedInvestigations } from '@/server-actions/profile';

import InvestigationCard from './investigation-card';

const CompletedInvestigationList = async () => {
	const investigations = await getCompletedInvestigations();

	return investigations.map(inv => (
		<InvestigationCard
			key={inv.caseId}
			investigation={inv}
			variant="completed"
		/>
	));
};

export default CompletedInvestigationList;
