/*
  # Create storage bucket for card images

  1. Storage Setup
    - Create 'card-images' bucket for storing uploaded card images
    - Set up public access policies for reading images
    - Configure upload policies for authenticated users

  2. Security
    - Public read access for displaying images
    - Authenticated upload access for admin panel
    - File size and type restrictions
*/

-- Create the storage bucket for card images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'card-images',
  'card-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Allow public read access to card images
CREATE POLICY "Public read access for card images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'card-images');

-- Allow authenticated users to upload card images
CREATE POLICY "Authenticated users can upload card images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'card-images');

-- Allow authenticated users to update card images
CREATE POLICY "Authenticated users can update card images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'card-images');

-- Allow authenticated users to delete card images
CREATE POLICY "Authenticated users can delete card images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'card-images');