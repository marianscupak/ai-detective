import { type Metadata } from 'next';

import { SigninButton } from '../../components/layout/sign-in-button';

export const metadata: Metadata = {
	title: 'Sign In'
};

const SigninPage = () => {
	return (
		<div className="flex h-full w-full items-center justify-center text-black">
			<SigninButton />
		</div>
	);
};

export default SigninPage;
