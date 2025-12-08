import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Navigation } from '@/components/layout/navigation';

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
				className={`${geistSans.variable} ${geistMono.variable} text-foreground relative flex h-screen flex-col antialiased`}
			>
				<div className="pointer-events-none fixed inset-0 -z-20 bg-[url('/images/noir-bg.jpg')] bg-cover bg-center" />
				<div className="pointer-events-none fixed inset-0 -z-10 bg-black/70" />
				<Navigation />
				<div className="flex-1 overflow-auto">{children}</div>
			</body>
		</html>
	);
};

export default RootLayout;
