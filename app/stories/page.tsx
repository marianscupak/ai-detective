import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import StoryLibrary from '@/components/story-library';
import {
	getAllCaseThemes,
	getAllDetectiveCasesWithStatus
} from '@/server-actions/case';

const StoriesPage = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) {
		redirect('/sign-in');
	}

	const cases = await getAllDetectiveCasesWithStatus();
	const themes = await getAllCaseThemes();

	return <StoryLibrary stories={cases} themes={themes} />;
};

export default StoriesPage;
