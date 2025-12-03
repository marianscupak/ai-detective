import { headers } from 'next/headers';
import { Pencil } from 'lucide-react';

import { auth } from '@/lib/auth';

import OngoingInvestigations from './components/ongoing-investigations';
import CompletedInvestigations from './components/completed-investigations';

const ProfilePage = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	return (
		<div className="flex h-full gap-4 px-24 py-6 text-black">
			<div className="flex h-full w-32 shrink-0 flex-col gap-4 lg:w-40 xl:w-48">
				<div className="flex h-fit items-center gap-2 rounded-lg border bg-white p-3 shadow-sm">
					{/* TODO: Edit profiel actions */}
					{session!.user.name} <Pencil className="ml-auto size-4 shrink-0" />
				</div>
				<div className="h-full rounded-lg border bg-white p-1 shadow-sm">
					Badges
				</div>
			</div>
			<div className="flex w-full flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm">
				<OngoingInvestigations />
			</div>
			<div className="flex w-full flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm">
				<CompletedInvestigations />
			</div>
		</div>
	);
};

export default ProfilePage;
