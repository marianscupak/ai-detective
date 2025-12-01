import {
	Card,
	CardHeader,
	CardContent,
	CardFooter
} from '@/components/ui/card';

const LoadingInvestigationRoom = () => {
	return (
		<div className="flex h-full items-center justify-center p-4">
			<Card className="mx-auto flex h-[95%] w-full max-w-3xl flex-col">
				<CardHeader>
					<div className="space-y-2">
						<div className="bg-muted h-6 w-40 animate-pulse rounded" />
						<div className="bg-muted h-4 w-32 animate-pulse rounded" />
					</div>
				</CardHeader>

				<CardContent className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
					<div className="border-muted border-t-primary h-10 w-10 animate-spin rounded-full border-4" />

					<p className="text-muted-foreground text-sm">
						Loading investigation…
					</p>
				</CardContent>

				<CardFooter>
					<div className="flex w-full items-center space-x-2">
						<div className="bg-muted h-9 flex-1 animate-pulse rounded" />
						<div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default LoadingInvestigationRoom;
