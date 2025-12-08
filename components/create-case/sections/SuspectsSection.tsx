'use client';

import React from 'react';
import {
	useFieldArray,
	type UseFormReturn,
	type FieldErrors
} from 'react-hook-form';

import type { CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-case/section-card';
import { FormField } from '@/components/create-case/form-field';
import { CaseTextarea } from '@/components/create-case/case-textarea';
import { ArrayItemCard } from '@/components/create-case/array-item-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SuspectsSectionProps = {
	form: UseFormReturn<CreateCaseFormValues>;
};

export const SuspectsSection: React.FC<SuspectsSectionProps> = ({ form }) => {
	const {
		control,
		register,
		formState: { errors }
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'suspects'
	});

	const suspectsError = errors.suspects as
		| FieldErrors<CreateCaseFormValues['suspects']>
		| undefined;

	return (
		<SectionCard title="Suspects">
			<div className="grid gap-4 md:grid-cols-3">
				<div className="md:col-span-1">
					<h2 className="text-sm font-semibold">Suspects</h2>
					<p className="text-muted-foreground text-xs">
						Add all important characters in the Case.
					</p>
					{typeof errors.suspects === 'object' &&
						!Array.isArray(errors.suspects) &&
						errors.suspects && (
							<p className="mt-2 text-xs text-red-500">
								{(errors.suspects as any).message}
							</p>
						)}
				</div>
				<div className="flex flex-col gap-4 md:col-span-2">
					{fields.map((field, index) => {
						const fieldError = Array.isArray(suspectsError)
							? suspectsError[index]
							: undefined;

						return (
							<ArrayItemCard
								key={field.id}
								title={`Suspect #${index + 1}`}
								canRemove={fields.length > 1}
								onRemoveAction={() => remove(index)}
							>
								<FormField label="Name" error={fieldError?.name as any}>
									<Input {...register(`suspects.${index}.name` as const)} />
								</FormField>
								<FormField
									label="Description"
									error={fieldError?.description as any}
								>
									<CaseTextarea
										{...register(`suspects.${index}.description` as const)}
									/>
								</FormField>
							</ArrayItemCard>
						);
					})}

					<Button
						type="button"
						variant="outline"
						onClick={() => append({ name: '', description: '' })}
					>
						+ Add suspect
					</Button>
				</div>
			</div>
		</SectionCard>
	);
};
