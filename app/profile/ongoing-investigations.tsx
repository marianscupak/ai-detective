import { getOngoingInvestigations } from '@/server/profile';

const OngoingInvesstigations = async () => {
	const investigations = await getOngoingInvestigations();

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

export default OngoingInvesstigations;
