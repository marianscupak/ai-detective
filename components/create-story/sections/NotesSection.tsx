'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-story/SectionCard';
import { FormField } from '@/components/create-story/FormField';
import { CaseTextarea } from '@/components/create-story/CaseTextarea';

type NotesSectionProps = {
	form: UseFormReturn<CreateCaseFormValues>;
};

export const NotesSection: React.FC<NotesSectionProps> = ({ form }) => {
	const { register } = form;

	return (
		<SectionCard title="Notes for AI (optional)">
			<FormField label="Notes for AI">
				<CaseTextarea {...register('notesForAI')} />
			</FormField>
		</SectionCard>
	);
};
