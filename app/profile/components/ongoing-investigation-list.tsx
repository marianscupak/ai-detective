import { getOngoingInvestigations } from '@/server-actions/profile';

import InvestigationCard from './investigation-card';

const OngoingInvestigationList = async () => {
	const investigations = await getOngoingInvestigations();

	return investigations.map(inv => (
		<InvestigationCard
			key={inv.caseId}
			investigation={inv}
			variant="in-progress"
		/>
	));
};

export default OngoingInvestigationList;
