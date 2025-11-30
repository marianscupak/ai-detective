import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const proxy = async (req: NextRequest) => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	const publicPaths = ['/', '/sign-in'];
	console.log(req.nextUrl.pathname);

	if (publicPaths.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	if (!session) {
		return NextResponse.redirect(new URL('/sign-in', req.url));
	}

	return NextResponse.next();
};

export const config = {
	matcher: [
		// Exclude API routes, static files, image optimizations, and .png files
		'/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.ico$).*)'
	]
};
