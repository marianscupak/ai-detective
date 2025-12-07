import { defineConfig, type Config } from 'drizzle-kit';

const getConfig = (): Config => {
	const baseConfig: Config = {
		out: './drizzle',
		schema: './db/schema/*',
		dialect: 'turso'
	};

	if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
		return {
			...baseConfig,
			dbCredentials: {
				url: process.env.TURSO_DATABASE_URL!,
				authToken: process.env.TURSO_AUTH_TOKEN
			}
		};
	} else if (process.env.DATABASE_URL) {
		return {
			...baseConfig,
			dialect: 'sqlite',
			dbCredentials: {
				url: process.env.DATABASE_URL!
			}
		};
	} else {
		throw new Error(
			'No database URL configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN or DATABASE_URL.'
		);
	}
};

export default defineConfig(getConfig());
