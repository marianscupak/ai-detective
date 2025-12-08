'use client';

type NavProps = {
	items: { id: string; label: string }[];
};

export const CaseAsideNav = ({ items }: NavProps) => {
	const scrollTo = (id: string) => {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<aside className="fixed top-16 left-0 z-30 hidden h-[calc(100vh-64px)] w-48 border-r border-border bg-card p-4 md:block md:w-48 md:p-6 lg:w-64">
			<div className="space-y-4">
				<ul className="space-y-1">
					{items.map(item => (
						<li key={item.id}>
							<button
								onClick={() => scrollTo(item.id)}
								className="w-full rounded-lg px-3 py-2 text-left text-foreground transition hover:bg-muted hover:text-foreground"
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
