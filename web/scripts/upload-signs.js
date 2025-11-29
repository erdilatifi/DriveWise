const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer Service Role Key for admin tasks to bypass RLS, otherwise fallback to Anon Key
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: Missing Supabase environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in web/.env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const SIGNS_DIR = path.join(__dirname, '../../mobile/assets/signs');
const BUCKET_NAME = 'signs';

async function uploadFile(localPath, bucketPath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    // Determine content type based on extension
    const ext = path.extname(localPath).toLowerCase();
    let contentType = 'image/png'; // Default
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.svg') contentType = 'image/svg+xml';

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(bucketPath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Failed to upload ${bucketPath}:`, error.message);
    } else {
      console.log(`Uploaded: ${bucketPath}`);
    }
  } catch (err) {
    console.error(`Error reading/uploading ${localPath}:`, err.message);
  }
}

async function processDirectory(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(fullPath, relativePath);
    } else if (entry.isFile()) {
      // The target structure in bucket should be signs/category/filename
      // e.g. signs/danger/1.png
      // Our local structure is mobile/assets/signs/danger/1.png
      // So we want the bucket path to be 'signs/' + relativePath
      
      // Note: The SQL seed data uses paths like 'signs/danger/1.png'.
      // So we prepend 'signs/' to the relative path found inside assets/signs.
      const bucketPath = `signs/${relativePath.replace(/\\/g, '/')}`;
      await uploadFile(fullPath, bucketPath);
    }
  }
}

async function main() {
  console.log(`Starting upload to bucket '${BUCKET_NAME}'...`);
  console.log(`Reading from: ${SIGNS_DIR}`);

  if (!fs.existsSync(SIGNS_DIR)) {
    console.error('Error: Signs directory not found at', SIGNS_DIR);
    return;
  }

  await processDirectory(SIGNS_DIR);
  console.log('Upload complete!');
}

main();
