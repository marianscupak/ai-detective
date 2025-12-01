import { headers } from 'next/headers';
import { Suspense } from 'react';

import { auth } from '@/lib/auth';

import OngoingInvesstigations from './ongoing-investigations';
import InvestigationsLoader from './loaders/investigations-loader';
import CompletedInvestigations from './completed-investigations';

const ProfilePage = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	return (
		<div className="flex h-full gap-4 px-24 py-6 text-black">
			<div className="flex h-full w-64 shrink-0 flex-col gap-4">
				<div className="h-16 rounded-lg bg-gray-300 p-1">
					{session!.user.name}
				</div>
				<div className="h-full rounded-lg bg-gray-300 p-1">Badges</div>
			</div>
			<div className="flex w-full flex-col gap-3 rounded-xl bg-white p-3">
				<h2 className="text-xl font-semibold">Ongoing investigations</h2>
				<Suspense fallback={<InvestigationsLoader />}>
					<OngoingInvesstigations />
				</Suspense>
			</div>
			<div className="flex w-full flex-col gap-3 rounded-xl bg-white p-3">
				<h2 className="text-xl font-semibold">Completed investigations</h2>
				<Suspense fallback={<InvestigationsLoader />}>
					<CompletedInvestigations />
				</Suspense>
			</div>
		</div>
	);
};

export default ProfilePage;
