-- ===================================================================
-- DRIVEWISE - Create Storage Bucket for Question Images
-- ===================================================================
-- Run this in Supabase SQL Editor to create the storage bucket
-- ===================================================================

-- Create the storage bucket for question images
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'question-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'question-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'question-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'question-images' 
  AND auth.role() = 'authenticated'
);

-- ===================================================================
-- BUCKET CREATED!
-- ===================================================================
-- Bucket name: question-images
-- Public access: Yes (for viewing images)
-- Upload access: Authenticated users only
-- ===================================================================
