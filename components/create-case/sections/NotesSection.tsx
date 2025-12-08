'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-case/SectionCard';
import { FormField } from '@/components/create-case/FormField';
import { CaseTextarea } from '@/components/create-case/CaseTextarea';

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
