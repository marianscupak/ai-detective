import { drizzle } from 'drizzle-orm/libsql';
import { createClient, type Config } from '@libsql/client';

import * as schema from './schema';

const getClientOptions = (): Config => {
	if (process.env.TURSO_DATABASE_URL) {
		return {
			url: process.env.TURSO_DATABASE_URL!,
			authToken: process.env.TURSO_AUTH_TOKEN
		};
	}

	if (process.env.DATABASE_URL) {
		return {
			url: process.env.DATABASE_URL!
		};
	}

	throw new Error(
		'No database URL configured. Set TURSO_DATABASE_URL or DATABASE_URL.'
	);
};

const client = createClient(getClientOptions());

export const db = drizzle(client, { schema });
