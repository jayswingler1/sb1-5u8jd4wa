/*
  # Create cards table and related schema

  1. New Tables
    - `cards`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `price` (numeric, required)
      - `original_price` (numeric, optional)
      - `image_url` (text, required)
      - `rarity` (text, default 'Common')
      - `condition` (text, default 'NM')
      - `stock_quantity` (integer, default 0)
      - `video_episode` (text, optional)
      - `pull_date` (date, optional)
      - `description` (text, optional)
      - `set_name` (text, optional)
      - `card_number` (text, optional)
      - `is_featured` (boolean, default false)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `cards` table
    - Add policies for public access (for admin operations)

  3. Sample Data
    - Insert sample cards for testing
*/

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  image_url text NOT NULL,
  rarity text DEFAULT 'Common' NOT NULL,
  condition text DEFAULT 'NM' NOT NULL,
  stock_quantity integer DEFAULT 0 NOT NULL,
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

-- Create policies for public access
CREATE POLICY "Anyone can read cards"
  ON cards
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert cards"
  ON cards
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update cards"
  ON cards
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cards"
  ON cards
  FOR DELETE
  TO public
  USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO cards (name, price, original_price, image_url, rarity, condition, stock_quantity, set_name, card_number, is_featured, is_active) VALUES
('Charizard', 299.99, 399.99, 'https://images.pokemontcg.io/base1/4_hires.png', 'Rare', 'NM', 1, 'Base Set', '4/102', true, true),
('Blastoise', 199.99, 249.99, 'https://images.pokemontcg.io/base1/2_hires.png', 'Rare', 'NM', 2, 'Base Set', '2/102', true, true),
('Venusaur', 179.99, 229.99, 'https://images.pokemontcg.io/base1/15_hires.png', 'Rare', 'LP', 1, 'Base Set', '15/102', false, true),
('Pikachu', 89.99, null, 'https://images.pokemontcg.io/base1/58_hires.png', 'Common', 'NM', 5, 'Base Set', '58/102', true, true),
('Mewtwo', 149.99, 199.99, 'https://images.pokemontcg.io/base1/10_hires.png', 'Rare', 'NM', 1, 'Base Set', '10/102', false, true)
ON CONFLICT DO NOTHING;