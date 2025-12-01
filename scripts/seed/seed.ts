import { eq } from 'drizzle-orm';

import { type DetectiveCase } from '@/types/case';
import { db } from '@/db';
import {
	detectiveCase,
	caseCharacter,
	caseEvidence
} from '@/db/schema/game-schema';
import { SEED_AUTHOR_ID } from '@/scripts/seed/constants';

const MOCK_CASES: DetectiveCase[] = [
	{
		id: 'case-orient-express-01',
		authorId: SEED_AUTHOR_ID,
		createdAt: '2025-11-15T18:00:00Z',
		title: 'The Midnight Diamond',
		theme: 'Classic Detective Fiction',
		summary:
			'Aboard a luxurious trans-European express train, a famed diamond vanishes from a locked compartment. The thief is still on board, and you must find them before the train reaches its destination.',
		setting: {
			location:
				'A first-class compartment on the Orient Express, traveling from Paris to Istanbul.',
			dateTime: '1935-09-12T23:50:00Z',
			incident:
				"The 'Star of Persia', a flawless blue diamond, was stolen from the locked safe in the Countess's private suite."
		},
		characters: {
			player: {
				id: 'player-hercule-poirot-archetype',
				name: 'Hercule Poirot',
				description:
					'A world-renowned private detective, known for his sharp intellect and meticulous methods, traveling as a passenger.'
			},
			victimOrTarget: {
				name: "The 'Star of Persia' Diamond",
				description:
					'A legendary 50-carat blue diamond belonging to Countess Orlova.'
			},
			suspects: [
				{
					id: 'char-countess-orlova',
					name: 'Countess Orlova',
					description:
						"The diamond's owner. An aging Russian aristocrat who is publicly devastated but strangely calm in private."
				},
				{
					id: 'char-silas-croft',
					name: 'Silas Croft',
					description:
						'A slick American businessman who recently lost a fortune and had offered to buy the diamond from the Countess.'
				},
				{
					id: 'char-eliza-vance',
					name: 'Eliza Vance',
					description:
						"The Countess's young, quiet personal maid, who seems nervous and avoids eye contact."
				}
			]
		},
		evidence: [
			{
				id: 'ev-01-scratch',
				description:
					"A faint scratch mark on the floor near the compartment's ventilator shaft.",
				location: "In the Countess's private suite.",
				significance:
					'The thief used the ventilator shaft to bypass the locked door. The scratch was made by a tool used to pry the grille open.'
			},
			{
				id: 'ev-02-grease',
				description:
					"A small, dark smudge of industrial grease on the velvet lining of the diamond's display case.",
				location: 'Inside the safe.',
				significance:
					"This is grease from the train's undercarriage. The thief hid the diamond in a pouch attached to the bottom of the train car to retrieve it later."
			},
			{
				id: 'ev-03-testimony',
				description:
					'Silas Croft claims he saw Eliza Vance walking near the service corridors late at night.',
				location:
					'Silas Croft will reveal this when questioned about his whereabouts.',
				significance:
					'This is a red herring. Silas is trying to frame Eliza to deflect suspicion from himself.'
			}
		],
		solution: {
			culpritCharacterId: 'char-countess-orlova',
			motive:
				"The Countess was secretly bankrupt. She orchestrated the 'theft' of her own diamond to commit insurance fraud, planning to sell the real diamond on the black market later.",
			method:
				'She used a duplicate key to open the safe, faked the theft, and had an accomplice among the train staff hide the real diamond. She created the scene to cast suspicion on her guests.'
		},
		notesForAI:
			'The player should be led to suspect Silas Croft first. The Countess should act as a distraught but dignified victim. The key is for the player to question the impossibility of the theft from a locked room and a locked safe.'
	}
];

export const seedData = async () => {
	for (const mock of MOCK_CASES) {
		const [existing] = await db
			.select({ id: detectiveCase.id })
			.from(detectiveCase)
			.where(eq(detectiveCase.id, mock.id))
			.limit(1);

		if (existing) {
			console.log(`[seed] Case ${mock.id} already exists, skipping.`);
			continue;
		}

		console.log(`[seed] Inserting case ${mock.id}...`);

		await db.transaction(async tx => {
			await tx.insert(detectiveCase).values({
				id: mock.id,
				authorId: mock.authorId,
				title: mock.title,
				theme: mock.theme,
				summary: mock.summary,
				location: mock.setting.location,
				dateTime: mock.setting.dateTime,
				incident: mock.setting.incident,
				culpritCharacterId: mock.solution.culpritCharacterId,
				motive: mock.solution.motive,
				method: mock.solution.method,
				notesForAI: mock.notesForAI
			});

			await tx.insert(caseCharacter).values([
				{
					id: mock.characters.player.id,
					caseId: mock.id,
					role: 'player',
					name: mock.characters.player.name,
					description: mock.characters.player.description
				},
				{
					id: 'victim-or-target',
					caseId: mock.id,
					role: 'victim',
					name: mock.characters.victimOrTarget.name,
					description: mock.characters.victimOrTarget.description
				},
				...mock.characters.suspects.map(s => ({
					id: s.id,
					caseId: mock.id,
					role: 'suspect',
					name: s.name,
					description: s.description
				}))
			]);

			await tx.insert(caseEvidence).values(
				mock.evidence.map(e => ({
					id: e.id,
					caseId: mock.id,
					description: e.description,
					location: e.location,
					significance: e.significance
				}))
			);
		});

		console.log(`[seed] Case ${mock.id} inserted.`);
	}

	console.log('[seed] Dev data seeding complete.');
};
