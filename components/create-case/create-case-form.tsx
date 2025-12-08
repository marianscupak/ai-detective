'use client';

import React from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { OverviewSection } from '@/components/create-case/sections/OverviewSection';
import { SettingSection } from '@/components/create-case/sections/SettingSection';
import { CharactersSection } from '@/components/create-case/sections/CharactersSection';
import { SuspectsSection } from '@/components/create-case/sections/SuspectsSection';
import { EvidenceSection } from '@/components/create-case/sections/EvidenceSection';
import { SolutionSection } from '@/components/create-case/sections/SolutionSection';
import { NotesSection } from '@/components/create-case/sections/NotesSection';
import { type CreateCaseFormValues } from '@/lib/schema/case';

type CreateCaseFormProps = {
	form: UseFormReturn<CreateCaseFormValues>;
	onSubmitAction: (values: CreateCaseFormValues) => Promise<void>;
	error: string | null;
	savedCaseId: string | null;
};

export const CreateCaseForm: React.FC<CreateCaseFormProps> = ({
	form,
	onSubmitAction,
	error,
	savedCaseId
}) => {
	const {
		handleSubmit,
		formState: { isSubmitting }
	} = form;

	return (
		<form
			onSubmit={handleSubmit(onSubmitAction)}
			className="flex flex-col gap-6"
		>
			<OverviewSection form={form} />
			<SettingSection form={form} />
			<CharactersSection form={form} />
			<SuspectsSection form={form} />
			<EvidenceSection form={form} />
			<SolutionSection form={form} />
			<NotesSection form={form} />

			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-xs" />
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Saving...' : 'Save case'}
				</Button>
			</div>

			{error && (
				<p className="text-sm text-red-500">Error while saving case: {error}</p>
			)}
			{savedCaseId && (
				<p className="text-sm text-emerald-600">
					Case saved successfully with ID: {savedCaseId}
				</p>
			)}
		</form>
	);
};
