'use client';

type NavProps = {
	items: { id: string; label: string }[];
};

export const StoryAsideNav = ({ items }: NavProps) => {
	const scrollTo = (id: string) => {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<aside className="fixed top-16 left-0 z-30 h-[calc(100vh-64px)] w-64 border-r border-gray-300 bg-white p-6 md:block">
			<div className="space-y-4">
				<ul className="space-y-1">
					{items.map(item => (
						<li key={item.id}>
							<button
								onClick={() => scrollTo(item.id)}
								className="w-full rounded-lg px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
};
