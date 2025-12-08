'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, PenSquare } from 'lucide-react';

import ProfileLink from './profile-link';

const NAV_ITEMS = [
	{ label: 'Case Library', href: '/cases', icon: Book },
	{ label: 'Create Case', href: '/cases/create', icon: PenSquare }
];

export const Navigation = () => {
	const pathname = usePathname();

	return (
		<nav className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-900">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link
					href="/cases"
					className="text-2xl font-semibold tracking-wide text-gray-900 hover:text-blue-700 dark:text-white"
				>
					AI DETECTIVE
				</Link>

				<div className="hidden gap-10 md:flex">
					{NAV_ITEMS.map(item => {
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

				<div className="flex items-center gap-4 md:hidden">
					{NAV_ITEMS.map(item => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`rounded-lg p-2 transition ${
									isActive
										? 'text-blue-600'
										: 'text-gray-700 dark:text-gray-200'
								} hover:text-blue-700`}
							>
								<Icon className="h-6 w-6" />
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
