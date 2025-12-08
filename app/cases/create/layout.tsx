import { type Metadata } from 'next';
import { type ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Create Custom Case'
};

const Layout = ({ children }: { children: ReactNode }) => {
	return children;
};

export default Layout;
