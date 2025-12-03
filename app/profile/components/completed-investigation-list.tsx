import { getCompletedInvestigations } from '@/server-actions/profile';

const CompletedInvestigationList = async () => {
	const investigations = await getCompletedInvestigations();

	return investigations.map(inv => (
		<li
			key={inv.id}
			className="flex h-28 flex-col justify-between rounded-lg border bg-gray-100 p-2 shadow lg:h-20 lg:flex-row"
		>
			{inv.title}
		</li>
	));
};

export default CompletedInvestigationList;
