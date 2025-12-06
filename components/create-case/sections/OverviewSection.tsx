'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-case/SectionCard';
import { FormField } from '@/components/create-case/FormField';
import { CaseTextarea } from '@/components/create-case/CaseTextarea';
import { Input } from '@/components/ui/input';

type OverviewSectionProps = {
	form: UseFormReturn<CreateCaseFormValues>;
};

export const OverviewSection: React.FC<OverviewSectionProps> = ({ form }) => {
	const {
		register,
		formState: { errors }
	} = form;

	return (
		<SectionCard title="Case overview">
			<FormField label="Title" error={errors.title}>
				<Input {...register('title')} />
			</FormField>

			<FormField label="Theme" error={errors.theme}>
				<Input {...register('theme')} />
			</FormField>

			<FormField label="Summary" error={errors.summary}>
				<CaseTextarea {...register('summary')} />
			</FormField>
		</SectionCard>
	);
};
