import { type Metadata } from 'next';
import { Suspense } from 'react';
import { Loader } from 'lucide-react';

import { SignInButtons } from '@/components/sign-in/sign-in-buttons';

export const metadata: Metadata = {
	title: 'Sign In'
};

const LoginPage = () => (
	<Suspense fallback={<Loader />}>
		<SignInButtons />
	</Suspense>
);

export default LoginPage;
