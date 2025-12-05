'use client';

import { authClient } from '@/lib/auth-client';

import EditProfileModal from './edit-profile-modal';

const ProfileInfo = () => {
	const { data } = authClient.useSession();

	return (
		<div className="flex h-fit items-center gap-2 rounded-lg border bg-white p-3 shadow-sm">
			{data?.user.name}
			<EditProfileModal />
		</div>
	);
};

export default ProfileInfo;
