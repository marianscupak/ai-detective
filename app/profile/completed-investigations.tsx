import { getCompletedInvestigations } from '@/server/profile';

const CompletedInvestigations = async () => {
	const investigations = await getCompletedInvestigations();

	return (
		<ul className="flex flex-col gap-2">
			{investigations.map(inv => (
				<li key={inv.id} className="h-12 rounded-lg bg-gray-300">
					{inv.title}
				</li>
			))}
		</ul>
	);
};

export default CompletedInvestigations;
