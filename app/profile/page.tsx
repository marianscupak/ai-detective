import OngoingInvestigations from './components/ongoing-investigations';
import CompletedInvestigations from './components/completed-investigations';
import ProfileInfo from './components/profile-info';
import UserAchievements from './components/user-achievements';

const ProfilePage = () => {
	return (
		<div className="flex h-full flex-col gap-6 p-2 text-black md:flex-row md:gap-4 md:px-24 md:py-6">
			<div className="flex w-full shrink-0 flex-col gap-6 md:h-full md:w-32 md:gap-4 lg:w-40 xl:w-48">
				<ProfileInfo />
				<UserAchievements />
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
