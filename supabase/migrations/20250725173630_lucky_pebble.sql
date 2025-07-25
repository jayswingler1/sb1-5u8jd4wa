/*
  # Fix RLS policies for cards table and storage bucket

  1. Cards Table Security
    - Drop existing restrictive policies
    - Create policies allowing public access for admin operations
    - Enable INSERT, UPDATE, DELETE, SELECT for all users

  2. Storage Bucket Security  
    - Create storage bucket with proper RLS policies
    - Allow public uploads to card-images bucket
    - Allow public access to view uploaded images

  3. Notes
    - This allows the admin panel to work without authentication
    - In production, you should implement proper admin authentication
    - Storage policies allow image uploads and public viewing
*/

-- Fix cards table policies
DROP POLICY IF EXISTS "Anyone can read cards" ON cards;
DROP POLICY IF EXISTS "Anyone can insert cards" ON cards;
DROP POLICY IF EXISTS "Anyone can update cards" ON cards;
DROP POLICY IF EXISTS "Anyone can delete cards" ON cards;

-- Create permissive policies for cards table
CREATE POLICY "Public can read cards"
  ON cards
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert cards"
  ON cards
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update cards"
  ON cards
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete cards"
  ON cards
  FOR DELETE
  TO public
  USING (true);

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-images', 'card-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for uploads
CREATE POLICY "Public can upload card images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'card-images');

CREATE POLICY "Public can view card images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'card-images');

CREATE POLICY "Public can update card images"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'card-images')
  WITH CHECK (bucket_id = 'card-images');

CREATE POLICY "Public can delete card images"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'card-images');