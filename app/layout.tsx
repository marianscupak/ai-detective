import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Navigation } from '@/components/navigation';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: {
		template: '%s | AI Detective',
		default: 'AI Detective'
	},
	description:
		'AI Detective is a web-based interactive game that allows players to take on the role of a detective solving mystery cases through conversations with an AI Game Master.' +
		'The game combines narrative storytelling, logical reasoning, and dynamic interaction with AI to create an engaging investigation experience.'
};

const RootLayout = ({
	children
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col antialiased`}
			>
				<Navigation />
				<div className="flex-1 overflow-auto bg-slate-50">{children}</div>
			</body>
		</html>
	);
};

export default RootLayout;
