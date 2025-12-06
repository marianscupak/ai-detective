'use server';

import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import {
	caseCharacter,
	caseEvidence,
	detectiveCase
} from '@/db/schema/game-schema';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import {
	type Character,
	type DetectiveCase,
	type Evidence,
	type Solution,
	type VictimOrTarget,
	type DetectiveCaseBaseView
} from '@/types/case';

export const getAllDetectiveCases = async (): Promise<
	DetectiveCaseBaseView[]
> => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	const rows = await db.select().from(detectiveCase);

	return rows as DetectiveCaseBaseView[];
};

export const getDetectiveCaseById = async (
	caseId: string
): Promise<DetectiveCase> => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	const caseRows = await db
		.select()
		.from(detectiveCase)
		.where(eq(detectiveCase.id, caseId))
		.limit(1);

	if (caseRows.length === 0) {
		throw new Error('Case not found');
	}

	const rawCase = caseRows[0];

	const rawCharacters = await db
		.select()
		.from(caseCharacter)
		.where(eq(caseCharacter.caseId, caseId));

	let player: Character | null = null;
	let victim: VictimOrTarget | null = null;
	const suspects: Character[] = [];

	for (const ch of rawCharacters) {
		if (ch.role === 'player') {
			player = {
				id: ch.id,
				name: ch.name,
				description: ch.description
			};
		} else if (ch.role === 'victim') {
			victim = {
				name: ch.name,
				description: ch.description
			};
		} else {
			suspects.push({
				id: ch.id,
				name: ch.name,
				description: ch.description
			});
		}
	}

	if (!player) throw new Error('Case is missing a player character.');
	if (!victim) throw new Error('Case is missing a victim/target.');

	const evidenceRows = await db
		.select()
		.from(caseEvidence)
		.where(eq(caseEvidence.caseId, caseId));

	const evidence: Evidence[] = evidenceRows.map(ev => ({
		id: ev.id,
		location: ev.location,
		description: ev.description,
		significance: ev.significance
	}));

	const solution: Solution = {
		culpritCharacterId: rawCase.culpritCharacterId,
		motive: rawCase.motive,
		method: rawCase.method
	};

	const result: DetectiveCase = {
		id: rawCase.id,
		authorId: rawCase.authorId,
		createdAt: rawCase.createdAt.toString(),

		title: rawCase.title,
		theme: rawCase.theme,
		summary: rawCase.summary,

		setting: {
			location: rawCase.location,
			dateTime: rawCase.dateTime,
			incident: rawCase.incident
		},

		characters: {
			player,
			victimOrTarget: victim,
			suspects
		},

		evidence,
		solution,

		notesForAI: rawCase.notesForAI ?? undefined
	};

	return result;
};

export const getAllCaseThemes = async (): Promise<string[]> => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	const rows = await db
		.select({ theme: detectiveCase.theme })
		.from(detectiveCase);

	return Array.from(new Set(rows.map(r => r.theme)));
};
