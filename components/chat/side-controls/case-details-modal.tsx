'use client';

import { Info } from 'lucide-react';

import { type DetectiveCase } from '@/types/case';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	CaseCharactersSection,
	CaseDetailsSection,
	CaseEvidenceSection
} from '@/components/case/case-sections';

type Props = {
	detectiveCase: DetectiveCase;
};

export const CaseDetailsModal = ({ detectiveCase }: Props) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full justify-start">
					<Info className="mr-2 h-4 w-4" />
					Case Details
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[80vh] w-full p-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle>{detectiveCase.title}</DialogTitle>
					<DialogDescription>
						Read-only overview of the case file. This won&apos;t affect your
						progress.
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[60vh] px-4 py-4">
					<div className="space-y-6">
						<CaseDetailsSection Case={detectiveCase} />
						<CaseCharactersSection Case={detectiveCase} />
						<CaseEvidenceSection Case={detectiveCase} />
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
