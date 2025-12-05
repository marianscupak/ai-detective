'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ProfileLink from './profile-link';

export const Navigation = () => {
	const pathname = usePathname();
	const navItems = [
		{ label: 'Story Library', href: '/' },
		{ label: 'Create Story', href: '/create-story' }
	];

	return (
		<nav className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-900">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link
					href="/"
					className="text-2xl font-semibold tracking-wide hover:text-blue-700"
				>
					AI DETECTIVE
				</Link>

				<div className="hidden gap-10 md:flex">
					{navItems.map(item => {
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								className="relative font-medium text-gray-700 transition hover:text-blue-700 dark:text-gray-200"
							>
								{item.label}

								{isActive && (
									<span className="absolute right-0 -bottom-1 left-0 mx-auto h-0.5 w-full rounded bg-blue-600" />
								)}
							</Link>
						);
					})}
				</div>

				<div className="flex items-center gap-4">
					<ProfileLink />
				</div>
			</div>
		</nav>
	);
};
