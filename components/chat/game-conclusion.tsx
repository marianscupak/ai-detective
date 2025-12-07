import { Lightbulb, PartyPopper } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const GameConclusion = () => (
	<div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-500 bg-green-50 p-6 text-center transition-all duration-500 ease-in-out">
		<PartyPopper className="h-12 w-12 text-green-600" />
		<h3 className="mt-4 text-xl font-bold text-green-800">Case Solved!</h3>
		<p className="mt-1 text-sm text-green-700">
			Congratulations, you've unraveled the mystery.
		</p>
		<div className="mt-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-100/50 p-2 text-left text-xs text-green-800">
			<Lightbulb className="h-4 w-4 flex-shrink-0" />
			<span>
				<strong>Case Debriefing:</strong> You can now hover over your past
				messages to reveal the Game Master's reasoning behind each relevance
				rating.
			</span>
		</div>
		<Button asChild className="mt-4">
			<Link href="/cases">Back to Case Library</Link>
		</Button>
	</div>
);
