import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { db } from '@/db';
import {
	detectiveCase,
	caseCharacter,
	caseEvidence
} from '@/db/schema/game-schema';
import { type DetectiveCase } from '@/types/case';
import { auth } from '@/lib/auth';

export const POST = async (req: Request) => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user?.id) {
		return new NextResponse('Unauthorized', { status: 401 });
	}

	const authorId = session.user.id;
	const body = (await req.json()) as DetectiveCase;

	const caseId = `${body.title}-${Date.now()}`;
	console.log(caseId, body.id, `title-${Date.now()}`);

	const playerDbId = `${caseId}-player`;
	const victimDbId = `${caseId}-victim`;

	const suspectRows = body.characters.suspects.map((s, index) => {
		const dbId = `${caseId}-suspect-${index + 1}`;
		return {
			originalId: s.id,
			dbId,
			name: s.name,
			description: s.description
		};
	});

	const culpritOriginalId = body.solution.culpritCharacterId;
	const culpritRow = suspectRows.find(
		row => row.originalId === culpritOriginalId
	);

	const culpritDbId = culpritRow?.dbId ?? culpritOriginalId;

	await db.transaction(async tx => {
		await tx.insert(detectiveCase).values({
			id: caseId,
			authorId,
			title: body.title,
			theme: body.theme,
			summary: body.summary,
			location: body.setting.location,
			dateTime: body.setting.dateTime,
			incident: body.setting.incident,
			culpritCharacterId: culpritDbId,
			motive: body.solution.motive,
			method: body.solution.method,
			notesForAI: body.notesForAI ?? null
		});

		await tx.insert(caseCharacter).values([
			{
				id: playerDbId,
				caseId,
				role: 'player',
				name: body.characters.player.name,
				description: body.characters.player.description
			},
			{
				id: victimDbId,
				caseId,
				role: 'victim',
				name: body.characters.victimOrTarget.name,
				description: body.characters.victimOrTarget.description
			},
			...suspectRows.map(row => ({
				id: row.dbId,
				caseId,
				role: 'suspect',
				name: row.name,
				description: row.description
			}))
		]);

		if (body.evidence.length > 0) {
			await tx.insert(caseEvidence).values(
				body.evidence.map((e, index) => ({
					id: `${caseId}-evidence-${index + 1}`,
					caseId,
					description: e.description,
					location: e.location,
					significance: e.significance
				}))
			);
		}
	});

	return NextResponse.json({ id: caseId });
};
