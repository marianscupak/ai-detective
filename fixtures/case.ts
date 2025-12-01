import { type Case } from '@/types/case';

export const exampleCase: Case = {
	id: 'case-0a9b8c7d-6e5f-4a3b-2c1d-0e9f8a7b6c5d',
	title: 'The Blackwood Manor Mystery',
	authorId: 'user-admin',
	summary:
		'A ruthless rare book collector is found dead in his private library during a storm. With the phone lines down, a killer is trapped among the guests.',
	createdAt: '2025-11-12T14:30:00Z',
	updatedAt: '2025-11-12T14:30:00Z',
	backstory:
		"The evening at Blackwood Manor was meant to celebrate Arthur Blackwood's latest acquisition. However, after the lights flickered and died, he was found slumped over his mahogany desk, a silver letter opener protruding from his chest. The storm rages outside, the phone lines are dead, and the few guests are now suspects.",
	setting: {
		location:
			'The private library of Blackwood Manor, a secluded estate in the countryside.',
		dateTime: '2025-10-31T22:30:00Z',
		ambiance:
			'A fierce thunderstorm, the smell of old books and rain, and the crackle of a dying fire in the hearth.'
	},
	characters: [
		{
			id: 'char-arthur',
			name: 'Arthur Blackwood',
			description:
				'The victim. A wealthy, ruthless, and widely disliked rare book collector.'
		},
		{
			id: 'char-eleanor',
			name: 'Eleanor Vance',
			description:
				"Arthur's much younger, enigmatic wife, who seemed distant and unhappy in her marriage."
		},
		{
			id: 'char-julian',
			name: 'Julian Croft',
			description:
				"Arthur's ambitious and sharp-witted business rival, who was publicly humiliated by Arthur in a recent deal."
		},
		{
			id: 'char-beatrice',
			name: 'Beatrice Holloway',
			description:
				"The manor's quiet, meticulous librarian, who has dedicated her life to caring for Arthur's collection."
		}
	],
	keyEvents: [
		{
			id: 'event-1',
			description:
				'Julian Croft and Arthur Blackwood were heard having a loud, heated argument in the study just an hour before the murder.',
			isCrucial: false
		},
		{
			id: 'event-2',
			description:
				"A small, almost invisible smudge of archaic restoration ink is found on the collar of Arthur's shirt, a type used only by expert curators.",
			isCrucial: true
		},
		{
			id: 'event-3',
			description:
				"Eleanor Vance was discreetly inquiring about the value of Arthur's estate with his lawyer just last week.",
			isCrucial: false
		}
	],
	resolution:
		'Beatrice Holloway killed Arthur Blackwood. She discovered he was a fraud, planning to sell his priceless collection and replace it with masterful forgeries. When she confronted him, he threatened to ruin her career and frame her for the fraud. In a moment of panic and rage, she grabbed the nearest object—the letter opener—and stabbed him.'
};
