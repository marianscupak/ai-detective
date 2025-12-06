'use client';

import React from 'react';
import {
	useFieldArray,
	type UseFormReturn,
	type FieldErrors
} from 'react-hook-form';

import type { CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-story/SectionCard';
import { FormField } from '@/components/create-story/FormField';
import { CaseTextarea } from '@/components/create-story/CaseTextarea';
import { ArrayItemCard } from '@/components/create-story/ArrayItemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type EvidenceSectionProps = {
	form: UseFormReturn<CreateCaseFormValues>;
};

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({ form }) => {
	const {
		control,
		register,
		formState: { errors }
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'evidences'
	});

	const evidencesError = errors.evidences as
		| FieldErrors<CreateCaseFormValues['evidences']>
		| undefined;

	return (
		<SectionCard title="Evidence">
			{typeof errors.evidences === 'object' &&
				!Array.isArray(errors.evidences) &&
				errors.evidences && (
					<p className="mb-2 text-xs text-red-500">
						{(errors.evidences as any).message}
					</p>
				)}

			{fields.map((field, index) => {
				const fieldError = Array.isArray(evidencesError)
					? evidencesError[index]
					: undefined;

				return (
					<ArrayItemCard
						key={field.id}
						title={`Evidence #${index + 1}`}
						canRemove={fields.length > 1}
						onRemoveAction={() => remove(index)}
					>
						<FormField label="Location" error={fieldError?.location as any}>
							<Input {...register(`evidences.${index}.location` as const)} />
						</FormField>
						<FormField
							label="Description (player-facing)"
							error={fieldError?.description as any}
						>
							<CaseTextarea
								{...register(`evidences.${index}.description` as const)}
							/>
						</FormField>
						<FormField
							label="Significance (AI-only)"
							error={fieldError?.significance as any}
						>
							<CaseTextarea
								{...register(`evidences.${index}.significance` as const)}
							/>
						</FormField>
					</ArrayItemCard>
				);
			})}

			<Button
				type="button"
				variant="outline"
				onClick={() =>
					append({
						location: '',
						description: '',
						significance: ''
					})
				}
			>
				+ Add evidence
			</Button>
		</SectionCard>
	);
};
