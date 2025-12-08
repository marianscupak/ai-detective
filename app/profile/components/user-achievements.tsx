import { Suspense } from 'react';
import { format } from 'date-fns';

import { cn } from '@/lib/cn';
import { getUserAchievementsAction } from '@/server-actions/achievement';

const UserAchievementList = async () => {
	const achievements = await getUserAchievementsAction();

	return (
		<div className="h-full flex-1 overflow-y-auto">
			<ul className="flex flex-col gap-2">
				{achievements.map(ach => (
					<li
						key={ach.achievementId}
						className={cn(
							'flex flex-col gap-1 rounded-lg border p-2 shadow-sm',
							ach.isUnlocked
								? 'border-green-500 bg-green-50'
								: 'border-border bg-muted'
						)}
					>
						<div className="text-sm font-semibold">{ach.title}</div>
						<p className="text-xs text-foreground">{ach.description}</p>

						{ach.isUnlocked ? (
							<div className="text-xs text-green-600">
								Unlocked: {format(ach.earnedAt!, 'dd.MM.yyyy')}{' '}
							</div>
						) : (
							<div className="text-xs font-medium text-foreground">Locked</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

const UserAchievements = () => {
	return (
		<div className="h-full flex-1 overflow-auto">
			<div className="flex flex-col rounded-lg border bg-card p-2 shadow-sm md:h-full">
				<h2 className="pb-2 text-xl font-semibold md:text-center md:text-base lg:text-xl">
					Achievements
				</h2>
				<Suspense>
					<UserAchievementList />
				</Suspense>
			</div>
		</div>
	);
};

export default UserAchievements;
