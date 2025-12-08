'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound = () => {
	return (
		<div className="bg-background flex h-full w-full items-center justify-center px-4">
			<Card className="w-full max-w-sm shadow-md">
				<CardHeader className="flex items-center justify-center space-y-2 text-center">
					<AlertTriangle className="text-destructive h-10 w-10" />
					<CardTitle className="text-xl">Case Not Found</CardTitle>
				</CardHeader>

				<CardContent className="text-muted-foreground space-y-4 text-center text-sm">
					<p>
						The case file you're trying to access doesn't exist or has been
						misfiled in the archives.
					</p>
					<p>
						Check the URL, or head back to the case board and select a valid
						investigation.
					</p>

					<div className="pt-2">
						<Button asChild variant="default" className="w-full">
							<Link href="/cases">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Return to Case Board
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default NotFound;
