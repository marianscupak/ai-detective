import { z } from 'zod';

export const suspectDraftSchema = z.object({
	name: z.string().min(1, 'Suspect name is required'),
	description: z.string().min(1, 'Suspect description is required')
});

export const evidenceDraftSchema = z.object({
	location: z.string().min(1, 'Location is required'),
	description: z.string().min(1, 'Description is required'),
	significance: z.string().min(1, 'Significance is required')
});

export const createCaseSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		theme: z.string().min(1, 'Theme is required'),
		summary: z.string().min(1, 'Summary is required'),

		settingLocation: z.string().min(1, 'Location is required'),
		settingDateTimeLocal: z.string().min(1, 'Date & time is required'),
		settingIncident: z.string().min(1, 'Incident is required'),

		playerName: z.string().min(1, 'Player name is required'),
		playerDescription: z.string().min(1, 'Player description is required'),

		victimName: z.string().min(1, 'Victim/Target name is required'),
		victimDescription: z
			.string()
			.min(1, 'Victim/Target description is required'),

		suspects: z
			.array(suspectDraftSchema)
			.min(1, 'At least one suspect is required'),

		evidences: z
			.array(evidenceDraftSchema)
			.min(1, 'At least one evidence is required'),

		culpritIndex: z.number().int().nonnegative().optional(),

		motive: z.string().min(1, 'Motive is required'),
		method: z.string().min(1, 'Method is required'),

		notesForAI: z.string().optional()
	})
	.superRefine((data, ctx) => {
		if (
			data.culpritIndex === undefined ||
			data.culpritIndex === null ||
			Number.isNaN(data.culpritIndex)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['culpritIndex'],
				message: 'Culprit must be selected'
			});
			return;
		}

		if (data.culpritIndex < 0 || data.culpritIndex >= data.suspects.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['culpritIndex'],
				message: 'Culprit index is out of range'
			});
		}
	});

export type CreateCaseFormValues = z.infer<typeof createCaseSchema>;
