import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
	return (
		<div className="flex w-full justify-center bg-zinc-50 px-4 py-8 dark:bg-black">
			<div className="flex w-full max-w-5xl flex-col gap-6">
				{/* Header skeleton */}
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-9 w-28 rounded-md" />
				</div>

				{/* Case overview */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-32" />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-24 w-full" />
					</CardContent>
				</Card>

				{/* Setting */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-24" />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-24 w-full" />
					</CardContent>
				</Card>

				{/* Characters */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-28" />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<div className="grid gap-4 md:grid-cols-3">
							<div>
								<Skeleton className="mb-2 h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="flex flex-col gap-3 md:col-span-2">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-24 w-full" />
							</div>
						</div>

						<hr className="border-border" />

						<div className="grid gap-4 md:grid-cols-3">
							<div>
								<Skeleton className="mb-2 h-4 w-28" />
							</div>
							<div className="flex flex-col gap-3 md:col-span-2">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-24 w-full" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Suspects */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-24" />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex flex-col gap-2 rounded-md border border-dashed p-3">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-20 w-full" />
						</div>
						<Skeleton className="h-9 w-32" />
					</CardContent>
				</Card>

				{/* Evidence */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-24" />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex flex-col gap-2 rounded-md border border-dashed p-3">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-24 w-full" />
						</div>
						<Skeleton className="h-9 w-32" />
					</CardContent>
				</Card>

				{/* Solution */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-20" />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-24 w-full" />
						<Skeleton className="h-24 w-full" />
					</CardContent>
				</Card>

				{/* Notes */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-44" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Skeleton className="h-24 w-full" />
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="flex justify-end">
					<Skeleton className="h-10 w-28" />
				</div>
			</div>
		</div>
	);
};

export default Loading;
