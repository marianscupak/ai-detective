'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
	type DetectiveCase,
	type Character,
	type Evidence
} from '@/types/case';
import { createCaseSchema, type CreateCaseFormValues } from '@/lib/schema/case';
import { SectionCard } from '@/components/create-story/SectionCard';
import { OverviewSection } from '@/components/create-story/sections/OverviewSection';
import { SettingSection } from '@/components/create-story/sections/SettingSection';
import { CharactersSection } from '@/components/create-story/sections/CharactersSection';
import { SuspectsSection } from '@/components/create-story/sections/SuspectsSection';
import { EvidenceSection } from '@/components/create-story/sections/EvidenceSection';
import { SolutionSection } from '@/components/create-story/sections/SolutionSection';
import { NotesSection } from '@/components/create-story/sections/NotesSection';

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

	const {
		handleSubmit,
		formState: { isSubmitting },
		reset
	} = formMethods;

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
			id: `frontend-ignored`, // backend přepíše podle title
			authorId: 'frontend-ignored', // backend přepíše podle better-auth
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

		try {
			const res = await fetch('/api/cases', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(detectiveCase)
			});

			if (!res.ok) {
				throw new Error('Failed to save case');
			}

			const data = (await res.json()) as { id: string };
			setSavedCaseId(data.id);
			setIsDialogOpen(true);
		} catch (err: any) {
			console.error(err);
			setError(err?.message ?? 'Unexpected error while saving case');
		}
	};

	return (
		<FormProvider {...formMethods}>
			<div className="flex w-full justify-center bg-zinc-50 px-4 py-8 dark:bg-black">
				<div className="flex w-full max-w-5xl flex-col gap-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold tracking-tight">
							Create Case
						</h1>
						<Button
							variant="outline"
							type="button"
							onClick={() => router.push('/')}
						>
							Back to home
						</Button>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<OverviewSection form={formMethods} />
						<SettingSection form={formMethods} />
						<CharactersSection form={formMethods} />
						<SuspectsSection form={formMethods} />
						<EvidenceSection form={formMethods} />
						<SolutionSection form={formMethods} />
						<NotesSection form={formMethods} />

						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs" />
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : 'Save case'}
							</Button>
						</div>

						{error && (
							<p className="text-sm text-red-500">
								Error while saving case: {error}
							</p>
						)}
						{savedCaseId && (
							<p className="text-sm text-emerald-600">
								Case saved successfully with ID: {savedCaseId}
							</p>
						)}
					</form>

					{output && (
						<SectionCard title="Generated DetectiveCase JSON">
							<pre className="max-h-[400px] overflow-auto rounded-md bg-zinc-900 p-4 text-xs text-zinc-100">
								{output}
							</pre>
						</SectionCard>
					)}
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Case saved successfully</DialogTitle>
					</DialogHeader>
					<p className="text-muted-foreground text-sm">
						Your detective case has been created and stored in the database.
					</p>
					<DialogFooter>
						<Button
							onClick={() => {
								setIsDialogOpen(false);
								reset();
								router.push('/');
							}}
						>
							Go to homepage
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</FormProvider>
	);
};

export default CreateCasePage;
