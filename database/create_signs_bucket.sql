-- Create storage bucket for signs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('signs', 'signs', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the signs bucket

-- Allow public read access to all files in the 'signs' bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'signs' );

-- Allow authenticated users (admins) to insert files
DROP POLICY IF EXISTS "Authenticated users can upload signs" ON storage.objects;
CREATE POLICY "Authenticated users can upload signs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'signs' AND
  (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- Allow authenticated users (admins) to update files
DROP POLICY IF EXISTS "Authenticated users can update signs" ON storage.objects;
CREATE POLICY "Authenticated users can update signs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'signs' AND
  (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- Allow authenticated users (admins) to delete files
DROP POLICY IF EXISTS "Authenticated users can delete signs" ON storage.objects;
CREATE POLICY "Authenticated users can delete signs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'signs' AND
  (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);
