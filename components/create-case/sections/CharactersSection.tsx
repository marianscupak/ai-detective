'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { SectionCard } from '@/components/create-case/section-card';
import { FormField } from '@/components/create-case/form-field';
import { CaseTextarea } from '@/components/create-case/case-textarea';
import { Input } from '@/components/ui/input';
import type { CreateCaseFormValues } from '@/lib/schema/case';

type CharactersSectionProps = {
	form: UseFormReturn<CreateCaseFormValues>;
};

export const CharactersSection: React.FC<CharactersSectionProps> = ({
	form
}) => {
	const {
		register,
		formState: { errors }
	} = form;

	return (
		<SectionCard title="Characters">
			{/* Player */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="md:col-span-1">
					<h2 className="text-sm font-semibold">Player</h2>
					<p className="text-muted-foreground text-xs">
						Who the player is in the Case.
					</p>
				</div>
				<div className="flex flex-col gap-3 md:col-span-2">
					<FormField label="Player Name" error={errors.playerName}>
						<Input {...register('playerName')} />
					</FormField>

					<FormField
						label="Player Description"
						error={errors.playerDescription}
					>
						<CaseTextarea {...register('playerDescription')} />
					</FormField>
				</div>
			</div>

			<hr className="border-border" />

			{/* Victim / Target */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="md:col-span-1">
					<h2 className="text-sm font-semibold">Victim / Target</h2>
				</div>
				<div className="flex flex-col gap-3 md:col-span-2">
					<FormField label="Name" error={errors.victimName}>
						<Input {...register('victimName')} />
					</FormField>

					<FormField label="Description" error={errors.victimDescription}>
						<CaseTextarea {...register('victimDescription')} />
					</FormField>
				</div>
			</div>
		</SectionCard>
	);
};
