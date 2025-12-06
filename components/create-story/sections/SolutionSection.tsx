'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-story/SectionCard';
import { FormField } from '@/components/create-story/FormField';
import { CaseTextarea } from '@/components/create-story/CaseTextarea';

type SolutionSectionProps = {
	form: UseFormReturn<CreateCaseFormValues>;
};

export const SolutionSection: React.FC<SolutionSectionProps> = ({ form }) => {
	const {
		register,
		watch,
		formState: { errors }
	} = form;

	const suspects = watch('suspects');

	return (
		<SectionCard title="Solution">
			<FormField label="Culprit" error={errors.culpritIndex}>
				<select
					className="border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					{...register('culpritIndex', {
						setValueAs: v => (v === '' ? undefined : Number(v))
					})}
				>
					<option value="">Select culprit</option>
					{suspects?.map((s, index) => (
						<option key={index} value={index}>
							{s.name || `Suspect #${index + 1}`}
						</option>
					))}
				</select>
			</FormField>

			<FormField label="Motive" error={errors.motive}>
				<CaseTextarea {...register('motive')} />
			</FormField>

			<FormField label="Method" error={errors.method}>
				<CaseTextarea {...register('method')} />
			</FormField>
		</SectionCard>
	);
};
