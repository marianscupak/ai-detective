import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import StoryLibrary from '@/components/story-library';
import { getAllCaseThemes, getAllDetectiveCases } from '@/server-actions/case';
import { type DetectiveCaseBaseView } from '@/types/case';

const StoriesPage = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) {
		redirect('/sign-in');
	}

	const cases: DetectiveCaseBaseView[] = await getAllDetectiveCases();
	const themes = await getAllCaseThemes();

	return <StoryLibrary stories={cases} themes={themes} />;
};

export default StoriesPage;
