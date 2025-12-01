import 'dotenv/config';
import { seedData } from '@/scripts/seed/seed';
import { ensureSeedAuthorExists } from '@/scripts/seed/helpers';

const main = async () => {
	try {
		await ensureSeedAuthorExists();
		await seedData();
		console.log('✅ Seed completed');
		process.exit(0);
	} catch (error) {
		console.error('❌ Seed failed', error);
		process.exit(1);
	}
};

main();
