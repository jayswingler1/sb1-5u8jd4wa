/*
  # Create Cards Inventory System

  1. New Tables
    - `cards`
      - `id` (uuid, primary key)
      - `name` (text, card name)
      - `price` (decimal, current price)
      - `original_price` (decimal, original price for sale display)
      - `image_url` (text, card image)
      - `rarity` (text, card rarity level)
      - `condition` (text, card condition)
      - `stock_quantity` (integer, available quantity)
      - `video_episode` (text, episode where card was pulled)
      - `pull_date` (date, when card was pulled)
      - `description` (text, card description)
      - `set_name` (text, which set the card belongs to)
      - `card_number` (text, card number in set)
      - `is_featured` (boolean, whether to show on homepage)
      - `is_active` (boolean, whether card is available for sale)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cards` table
    - Add policy for public read access
    - Add policy for authenticated admin write access
*/

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  image_url text NOT NULL,
  rarity text NOT NULL DEFAULT 'Common',
  condition text NOT NULL DEFAULT 'NM',
  stock_quantity integer NOT NULL DEFAULT 0,
  video_episode text,
  pull_date date,
  description text,
  set_name text,
  card_number text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read active cards"
  ON cards
  FOR SELECT
  USING (is_active = true);

-- Policy for authenticated admin write access
CREATE POLICY "Authenticated users can manage cards"
  ON cards
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();