import { eq } from 'drizzle-orm';

import { type DetectiveCase } from '@/types/case';
import { db } from '@/db';
import {
	detectiveCase,
	caseCharacter,
	caseEvidence
} from '@/db/schema/game-schema';
import { SEED_AUTHOR_ID } from '@/scripts/seed/constants';
import { achievement } from '@/db/schema/achievement-schema';

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
	},
	{
		id: 'case-baskerville-01',
		authorId: SEED_AUTHOR_ID,
		createdAt: '2025-12-05T18:30:00Z',
		title: 'The Curse of the Baskerville Hound',
		theme: 'Classic Detective Fiction',
		summary:
			'A nobleman dies under mysterious circumstances on the moor, and a legendary demonic hound is blamed. Holmes and Watson uncover a web of deception, hidden identities, and a meticulously crafted terror plot designed to kill the last heir.',
		setting: {
			location:
				'Dartmoor, England — Baskerville Hall and the surrounding moor.',
			dateTime: '1889-10-13T09:00:00Z',
			incident:
				'Sir Charles Baskerville is found dead at his estate gate. Though his death appears natural, footprints of a gigantic hound are discovered nearby.'
		},
		characters: {
			player: {
				id: 'player-watson-holmes-team',
				name: 'Dr. John Watson (Investigating on behalf of Holmes)',
				description:
					'Holmes sends Watson ahead to observe suspects, gather data, and avoid alarming the murderer.'
			},
			victimOrTarget: {
				name: 'Sir Henry Baskerville',
				description:
					'The new heir to the Baskerville estate. Target of the same plot that killed Sir Charles.'
			},
			suspects: [
				{
					id: 'char-jack-stapleton',
					name: 'Jack Stapleton',
					description:
						'A naturalist living near the moor. Charming, knowledgeable, and seemingly harmless — an avid butterfly collector.'
				},
				{
					id: 'char-beryl-stapleton',
					name: 'Beryl Stapleton',
					description:
						'Jack’s “sister,” later revealed to be his wife. Distressed, fearful, and attempting to secretly warn Sir Henry.'
				},
				{
					id: 'char-barrymore',
					name: 'Mr. Barrymore',
					description:
						'The butler of Baskerville Hall. Mysterious, nervous, often seen signaling from windows at night.'
				},
				{
					id: 'char-mrs-barrymore',
					name: 'Mrs. Barrymore',
					description:
						'The butler’s wife. Loyal, secretive, involved in covertly helping her fugitive brother.'
				},
				{
					id: 'char-selden',
					name: 'Selden',
					description:
						'A dangerous escaped convict hiding on the moor — Mrs. Barrymore’s brother.'
				},
				{
					id: 'char-frankland',
					name: 'Mr. Frankland',
					description:
						'A local amateur legal scholar known for argumentative behavior and using his telescope to spy on people.'
				}
			]
		},
		evidence: [
			{
				id: 'hb-ev-01-houndprints',
				description: 'Large pawprints found near Sir Charles’s body.',
				location: 'Yew Alley, Baskerville estate.',
				significance:
					'A key misdirection — prints were artificially created to support the hound legend.'
			},
			{
				id: 'hb-ev-02-warning-note',
				description:
					'A clipped-newspaper warning delivered anonymously to Sir Henry: “Do not go upon the moor.”',
				location: 'Hotel in London.',
				significance:
					'Letter assembled by Beryl Stapleton attempting to protect Sir Henry from her husband’s plan.'
			},
			{
				id: 'hb-ev-03-boots',
				description:
					'Sir Henry’s boots are stolen — first an old one, then a new one.',
				location: 'Sir Henry’s hotel room in London.',
				significance: 'Stapleton needed Henry’s scent to train his hound.'
			},
			{
				id: 'hb-ev-04-night-signal',
				description: 'Barrymore signaling with a candle from an upper window.',
				location: 'Baskerville Hall.',
				significance:
					'A red herring — Barrymore is helping Selden survive on the moor.'
			},
			{
				id: 'hb-ev-05-scream',
				description: 'A terrified scream heard from the moor at night.',
				location: 'Grimpen Mire area.',
				significance:
					'Selden dies wearing Sir Henry’s clothes, mistaken by Stapleton for his real target.'
			},
			{
				id: 'hb-ev-06-hound-lair',
				description:
					'A hidden shed where a massive hound is kept, half-starved.',
				location: 'On the moor near Stapleton’s home.',
				significance:
					'Evidence Stapleton used a real dog — not a supernatural creature — in his terror plot.'
			},
			{
				id: 'hb-ev-07-phosphorus',
				description:
					'A tin of luminous phosphorus used to make the hound appear ghostly.',
				location: 'Stapleton’s hidden supplies.',
				significance: 'Explains the “glowing demon hound” witnesses reported.'
			},
			{
				id: 'hb-ev-08-marriage-secret',
				description:
					'Proof that Beryl is actually Stapleton’s wife, not his sister.',
				location: 'Records uncovered by Holmes.',
				significance:
					'Reveals Stapleson’s coercion and manipulation of Beryl, and removes suspicion of her involvement.'
			},
			{
				id: 'hb-ev-09-schoolmaster-past',
				description:
					'A document linking Stapleton to a ruined school in the north.',
				location: 'Public records.',
				significance:
					'Stapleton is actually a Baskerville descendant who fled after scandal — giving him a financial motive.'
			}
		],
		solution: {
			culpritCharacterId: 'char-jack-stapleton',
			motive:
				'Stapleton is a secret Baskerville heir seeking to eliminate Sir Henry and claim the estate and fortune.',
			method:
				'Stapleton used a trained, half-starved hound coated with phosphorus to terrify and kill. He exploited the legend to disguise real murder as supernatural. Selden’s accidental death temporarily disrupted his plan, but he later attempted again to kill Sir Henry on the moor.'
		},
		notesForAI:
			'Gradually move the player away from supernatural interpretations and toward natural logic. Encourage them to track the real hound, note the stolen boots, and question Stapleton’s false identity. The Barrymores and Selden provide strong but incorrect leads.'
	}
];

export const seedAchievements = async () => {
	const achievements = [
		{
			id: 'first-case-closed',
			title: 'First Case Closed',
			description: 'Solve your first mystery case.'
		},
		{
			id: 'storyteller',
			title: 'Storyteller',
			description: 'Publish your first custom detective story.'
		},
		{
			id: 'master-sleuth',
			title: 'Master Sleuth',
			description: 'Solve a case without using any hints.'
		},
		{
			id: 'quick-wit',
			title: 'Quick Wit',
			description: 'Solve a case using fewer than 25 messages.'
		},
		{
			id: 'long-winded-detective',
			title: 'Long-Winded Detective',
			description: 'Spend more than 100 messages solving a single case.'
		},
		{
			id: 'so-close-yet-so-far',
			title: 'So Close Yet So Far',
			description: 'Abandon an investigation with more than 90% progress.'
		}
	];

	await db.insert(achievement).values(achievements).onConflictDoNothing();

	console.log('Achievements seeded.');
};

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
					id: crypto.randomUUID(),
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

	await seedAchievements();

	console.log('[seed] Dev data seeding complete.');
};
