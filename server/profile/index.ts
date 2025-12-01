'use server';

export type DetectiveCase = {
	// --- Administrative Metadata (Auto-generated or system-set) ---
	id: string;
	authorId: string;
	createdAt: string;

	// --- Case Overview (Filled by user, can be AI-assisted) ---
	title: string; // "Název"
	theme: string; // "Téma" - e.g., "Noir", "Cozy Mystery", "Sci-Fi Crime".
	summary: string; // "Popisek" - A short, engaging summary for the case selection screen.
};

export const getOngoingInvestigations = async () => {
	const data: DetectiveCase[] = [
		{
			id: 'abc',
			authorId: '',
			createdAt: '',
			title: 'Some title',
			theme: 'theme',
			summary: ''
		},
		{
			id: 'abcd',
			authorId: '',
			createdAt: '',
			title: 'Some title 2',
			theme: 'theme',
			summary: ''
		},
		{
			id: 'abcf',
			authorId: '',
			createdAt: '',
			title: 'Some title 3',
			theme: 'theme',
			summary: ''
		}
	];

	await new Promise(resolve => {
		setTimeout(resolve, 2000);
	});

	return data;
};

export const getCompletedInvestigations = async () => {
	const data: DetectiveCase[] = [
		{
			id: 'abc',
			authorId: '',
			createdAt: '',
			title: 'Some title',
			theme: 'theme',
			summary: ''
		},
		{
			id: 'abcd',
			authorId: '',
			createdAt: '',
			title: 'Some title 2',
			theme: 'theme',
			summary: ''
		},
		{
			id: 'abcf',
			authorId: '',
			createdAt: '',
			title: 'Some title 3',
			theme: 'theme',
			summary: ''
		}
	];

	await new Promise(resolve => {
		setTimeout(resolve, 2000);
	});

	return data;
};
