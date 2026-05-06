import { createClient } from '@sanity/client';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- CONFIGURATION ---
// Replace these with your real values or ensure they are in your .env
const PROJECT_ID = 'prijy7nr';
const TOKEN = 'skBUn945pDnKScirFdNPyI2jCYHxAfCIPoQO8XOtdZx6ymYqI0gIYEXPzhzeIncthfrRi8v4E4u2FMe2a9vPfrw8yQeYAky0ZNp9jpTiOfjcksgV26sOFzKH1gccYJ8qTAaAElj20G0CXSudwevCaNEVvflIWNvuCXTskHORKMfhKS2dbRNf';
const DATASET = 'production';
// ---------------------

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
});

async function migrate() {
  try {
    console.log('🚀 Starting migration...');

    const coursesPath = path.resolve(__dirname, './courses.json');
    const data = await fs.readFile(coursesPath, 'utf-8');
    const courses = JSON.parse(data);

    console.log(`📦 Found ${courses.length} courses in courses.json`);

    for (const course of courses) {
      console.log(`➡️ Migrating: ${course.title}...`);
      
      const doc = {
        _type: 'course',
        _id: `course-${course.id}`, // Maintain deterministic IDs
        title: course.title,
        icon: course.icon,
        cat: course.cat,
        duration: course.duration,
        timeline: course.timeline,
        highlights: course.highlights || [],
        curriculum: course.curriculum || [],
        learn: course.learn || [],
        outcomes: course.outcomes || [],
      };

      await client.createOrReplace(doc);
      console.log(`✅ Success: ${course.title}`);
    }

    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
  }
}

migrate();
