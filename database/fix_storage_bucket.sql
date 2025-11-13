-- ===================================================================
-- FIX STORAGE BUCKET RLS POLICIES
-- ===================================================================
-- Run this in Supabase SQL Editor to fix image upload issues
-- ===================================================================

-- STEP 1: Check if the bucket exists
SELECT 
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'decision-trainer';

-- STEP 2: Create bucket if it doesn't exist (this might fail - use Dashboard instead)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('decision-trainer', 'decision-trainer', true, 5242880, 
--         ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);

-- STEP 3: Check existing storage policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- STEP 4: Drop existing policies for decision-trainer bucket (if any)
DROP POLICY IF EXISTS "decision_trainer_public_read" ON storage.objects;
DROP POLICY IF EXISTS "decision_trainer_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "decision_trainer_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "decision_trainer_admin_delete" ON storage.objects;

-- STEP 5: Create new storage policies for decision-trainer bucket

-- Policy 1: Allow public read access to decision-trainer bucket
CREATE POLICY "decision_trainer_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'decision-trainer');

-- Policy 2: Allow authenticated users to upload to decision-trainer bucket
CREATE POLICY "decision_trainer_admin_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'decision-trainer' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Policy 3: Allow admins to update files in decision-trainer bucket
CREATE POLICY "decision_trainer_admin_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'decision-trainer'
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Policy 4: Allow admins to delete files in decision-trainer bucket
CREATE POLICY "decision_trainer_admin_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'decision-trainer'
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- STEP 6: Verify policies were created
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE 'decision_trainer%';

-- STEP 7: Test if current user is admin (should return true for admin users)
SELECT 
  id,
  email,
  is_admin,
  'User should be admin for uploads to work' as note
FROM user_profiles 
WHERE id = auth.uid();
