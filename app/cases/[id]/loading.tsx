'use client';

const LoadingCasePage = () => {
	return (
		<div className="relative flex">
			<aside className="bg-muted/20 fixed top-0 left-0 hidden h-full w-48 animate-pulse flex-col gap-4 border-r px-4 py-8 md:flex lg:w-64">
				<div className="bg-muted h-4 w-24 rounded" />
				<div className="bg-muted h-4 w-28 rounded" />
				<div className="bg-muted h-4 w-20 rounded" />
				<div className="bg-muted h-4 w-32 rounded" />
				<div className="bg-muted h-4 w-24 rounded" />
			</aside>

			<main className="mx-auto ml-0 max-w-4xl flex-1 animate-pulse px-8 py-12 md:ml-48 lg:ml-64">
				<div className="mb-10 space-y-3">
					<div className="bg-muted h-8 w-2/3 rounded" />
					<div className="bg-muted/70 h-4 w-1/3 rounded" />
				</div>

				<div className="mb-12 space-y-3">
					<div className="bg-muted h-6 w-40 rounded" />
					<div className="bg-muted/70 h-4 w-full rounded" />
					<div className="bg-muted/70 h-4 w-5/6 rounded" />
					<div className="bg-muted/70 h-4 w-2/3 rounded" />
				</div>

				<div className="mb-12">
					<div className="bg-muted mb-4 h-6 w-32 rounded" />
					<div className="space-y-3">
						<div className="bg-muted h-20 w-full rounded" />
						<div className="bg-muted h-20 w-full rounded" />
						<div className="bg-muted h-20 w-full rounded" />
					</div>
				</div>

				<div className="mb-12">
					<div className="bg-muted mb-4 h-6 w-40 rounded" />
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="bg-muted h-24 rounded" />
						<div className="bg-muted h-24 rounded" />
						<div className="bg-muted h-24 rounded" />
						<div className="bg-muted h-24 rounded" />
					</div>
				</div>

				<div className="mb-12">
					<div className="bg-muted mb-4 h-6 w-32 rounded" />
					<div className="space-y-3">
						<div className="bg-muted h-12 rounded" />
						<div className="bg-muted h-12 rounded" />
						<div className="bg-muted h-12 rounded" />
					</div>
				</div>

				<div className="mt-10 flex justify-end">
					<div className="bg-muted h-10 w-40 rounded-xl" />
				</div>
			</main>
		</div>
	);
};

export default LoadingCasePage;
