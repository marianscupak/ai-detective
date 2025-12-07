import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import CaseLibrary from '@/components/case-library';
import {
	getAllCaseThemes,
	getAllDetectiveCasesWithStatus
} from '@/server-actions/case';

const CasesPage = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) {
		redirect('/sign-in');
	}

	const cases = await getAllDetectiveCasesWithStatus();
	const themes = await getAllCaseThemes();

	return <CaseLibrary cases={cases} themes={themes} />;
};

export default CasesPage;
