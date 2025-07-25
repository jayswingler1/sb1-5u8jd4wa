/*
  # Fix RLS policy for cards table

  1. Security
    - Update RLS policy on `cards` table to allow anonymous read access
    - Ensure public users can view active cards without authentication
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public full access to cards" ON cards;

-- Create new policy that allows anonymous users to read active cards
CREATE POLICY "Allow anonymous read access to active cards"
  ON cards
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Also allow public role access (fallback)
CREATE POLICY "Allow public read access to active cards"
  ON cards
  FOR SELECT
  TO public
  USING (is_active = true);