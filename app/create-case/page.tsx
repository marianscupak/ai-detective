'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { CaseSavedDialog } from '@/components/create-case/CaseSavedDialog';
import { CreateCaseForm } from '@/components/create-case/CreateCaseForm';
import { SectionCard } from '@/components/create-case/SectionCard';
import {
	type DetectiveCase,
	type Character,
	type Evidence
} from '@/types/case';
import { createCaseSchema, type CreateCaseFormValues } from '@/lib/schema/case';
import { createCaseAction } from '@/server-actions/case';

const CreateCasePage: React.FC = () => {
	const router = useRouter();

	const formMethods = useForm<CreateCaseFormValues>({
		resolver: zodResolver(createCaseSchema),
		defaultValues: {
			title: '',
			theme: '',
			summary: '',
			settingLocation: '',
			settingDateTimeLocal: '',
			settingIncident: '',
			playerName: '',
			playerDescription: '',
			victimName: '',
			victimDescription: '',
			suspects: [{ name: '', description: '' }],
			evidences: [{ location: '', description: '', significance: '' }],
			culpritIndex: undefined,
			motive: '',
			method: '',
			notesForAI: ''
		},
		mode: 'onBlur'
	});

	const { reset } = formMethods;

	const [output, setOutput] = React.useState<string | null>(null);
	const [savedCaseId, setSavedCaseId] = React.useState<string | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	const onSubmit = async (values: CreateCaseFormValues) => {
		setError(null);
		setSavedCaseId(null);

		const now = new Date().toISOString();
		const dateTimeIso = values.settingDateTimeLocal
			? new Date(values.settingDateTimeLocal).toISOString()
			: '';

		const mappedSuspects: Character[] = values.suspects.map((s, index) => ({
			id: `char-suspect-${index + 1}`,
			name: s.name,
			description: s.description
		}));

		const mappedEvidence: Evidence[] = values.evidences.map((e, index) => ({
			id: `ev-${index + 1}`,
			description: e.description,
			location: e.location,
			significance: e.significance
		}));

		const culpritIndex = values.culpritIndex!;
		const culpritCharacterId = mappedSuspects[culpritIndex].id;

		const detectiveCase: DetectiveCase = {
			id: `frontend-ignored`,
			authorId: 'frontend-ignored',
			createdAt: now,
			title: values.title,
			theme: values.theme,
			summary: values.summary,
			setting: {
				location: values.settingLocation,
				dateTime: dateTimeIso,
				incident: values.settingIncident
			},
			characters: {
				player: {
					id: 'player-main',
					name: values.playerName,
					description: values.playerDescription
				},
				victimOrTarget: {
					name: values.victimName,
					description: values.victimDescription
				},
				suspects: mappedSuspects
			},
			evidence: mappedEvidence,
			solution: {
				culpritCharacterId,
				motive: values.motive,
				method: values.method
			},
			notesForAI: values.notesForAI ?? undefined
		};

		setOutput(JSON.stringify(detectiveCase, null, 2));

		const result = await createCaseAction(detectiveCase);

		if (!result.success) {
			setError(result.error);
			return;
		}

		setSavedCaseId(result.caseId);
		setIsDialogOpen(true);
	};

	const handleDialogConfirm = () => {
		setIsDialogOpen(false);
		reset();
		router.push('/');
	};

	return (
		<FormProvider {...formMethods}>
			<div className="flex w-full justify-center px-4 py-8">
				<div className="flex w-full max-w-5xl flex-col gap-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold tracking-tight">
							Create Case
						</h1>
						<Link
							href="/"
							className="inline-flex h-10 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
						>
							Back to home
						</Link>
					</div>

					<CreateCaseForm
						form={formMethods}
						onSubmitAction={onSubmit}
						error={error}
						savedCaseId={savedCaseId}
					/>

					{output && (
						<SectionCard title="Generated DetectiveCase JSON">
							<pre className="bg-muted text-foreground max-h-[400px] overflow-auto rounded-md p-4 text-xs">
								{output}
							</pre>
						</SectionCard>
					)}
				</div>
			</div>

			<CaseSavedDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onConfirm={handleDialogConfirm}
			/>
		</FormProvider>
	);
};

export default CreateCasePage;
