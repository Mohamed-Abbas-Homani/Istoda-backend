import { AppDataSource } from '../data-source';
import { seedStories } from './story.seed';

async function runSeed() {
  try {
    // Initialize database connection
    console.log('📡 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected!');

    // Run seeders
    await seedStories(AppDataSource);

    console.log('✨ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

runSeed();
