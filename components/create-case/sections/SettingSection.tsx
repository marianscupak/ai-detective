'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-case/section-card';
import { FormField } from '@/components/create-case/form-field';
import { CaseTextarea } from '@/components/create-case/case-textarea';
import { Input } from '@/components/ui/input';

type SettingSectionProps = {
	form: UseFormReturn<CreateCaseFormValues>;
};

export const SettingSection: React.FC<SettingSectionProps> = ({ form }) => {
	const {
		register,
		formState: { errors }
	} = form;

	return (
		<SectionCard title="Setting">
			<FormField label="Location" error={errors.settingLocation}>
				<Input {...register('settingLocation')} />
			</FormField>

			<FormField label="Date & Time" error={errors.settingDateTimeLocal}>
				<Input type="datetime-local" {...register('settingDateTimeLocal')} />
			</FormField>

			<FormField label="Incident" error={errors.settingIncident}>
				<CaseTextarea {...register('settingIncident')} />
			</FormField>
		</SectionCard>
	);
};
