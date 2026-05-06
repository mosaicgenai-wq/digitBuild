import { createClient } from '@sanity/client';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- CONFIGURATION ---
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

async function migrateUsers() {
  try {
    console.log('🚀 Starting User migration...');

    const usersPath = path.resolve(__dirname, './users.json');
    const data = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(data);

    console.log(`📦 Found ${users.length} users in users.json`);

    for (const user of users) {
      console.log(`➡️ Migrating user: ${user.username}...`);
      
      const doc = {
        _type: 'user',
        _id: `user-${user.username}`, // Prevent duplicates
        username: user.username,
        password: user.password,
        name: user.name || 'Existing User',
        email: user.email || '',
        phone: user.phone || '',
        countryCode: user.countryCode || '',
      };

      await client.createOrReplace(doc);
      console.log(`✅ Success: ${user.username}`);
    }

    console.log('\n✨ User migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
  }
}

migrateUsers();
