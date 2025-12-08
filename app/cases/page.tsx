import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { type Metadata } from 'next';

import { auth } from '@/lib/auth';
import CaseLibrary from '@/components/case/case-library';
import {
	getAllCaseThemes,
	getAllDetectiveCasesWithStatus
} from '@/server-actions/case';

export const metadata: Metadata = {
	title: 'Case Library'
};

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
