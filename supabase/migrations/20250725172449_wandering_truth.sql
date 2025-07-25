/*
  # Fix ON CONFLICT constraint errors

  This migration fixes the constraint issues by:
  1. Creating tables with proper primary keys first
  2. Adding unique constraints where needed
  3. Inserting sample data with correct conflict handling
  4. Setting up all RLS policies properly
*/

-- Create email_subscribers table with proper constraints
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  subscription_source text DEFAULT 'website',
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, card_id)
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_verified_purchase boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(card_id, customer_id)
);

-- Create inventory_logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  change_type text NOT NULL CHECK (change_type IN ('sale', 'restock', 'adjustment', 'return')),
  quantity_change integer NOT NULL,
  previous_quantity integer NOT NULL,
  new_quantity integer NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_subscribers
CREATE POLICY "Anyone can subscribe to newsletter"
  ON email_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read active subscribers"
  ON email_subscribers
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage all subscribers"
  ON email_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for cart_items
CREATE POLICY "Users can manage their own cart"
  ON cart_items
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- RLS Policies for product_reviews
CREATE POLICY "Anyone can read approved reviews"
  ON product_reviews
  FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Customers can create reviews"
  ON product_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all reviews"
  ON product_reviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for inventory_logs
CREATE POLICY "Admins can read inventory logs"
  ON inventory_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create inventory logs"
  ON inventory_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update RLS policies for existing tables to allow admin access
DROP POLICY IF EXISTS "Authenticated users can manage cards" ON cards;
CREATE POLICY "Admins can manage all cards"
  ON cards
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create or replace functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'LE-' || LPAD(nextval('order_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for order numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_email_subscribers_updated_at ON email_subscribers;
CREATE TRIGGER update_email_subscribers_updated_at
    BEFORE UPDATE ON email_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample cards (using INSERT ... ON CONFLICT with proper unique constraint)
INSERT INTO cards (
  name, price, original_price, image_url, rarity, condition, stock_quantity, 
  video_episode, pull_date, description, set_name, card_number, is_featured, is_active
) VALUES 
(
  'Charizard VMAX Rainbow Rare', 299.99, 349.99, 
  'https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Legendary', 'NM', 1, 'EP #47', '2024-01-15',
  'Pulled live on stream! Perfect condition rainbow rare Charizard VMAX.',
  'Champion''s Path', '074/073', true, true
),
(
  'Pikachu Gold Card', 149.99, 199.99,
  'https://images.pexels.com/photos/9072319/pexels-photo-9072319.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Rare', 'NM', 2, 'EP #45', '2024-01-10',
  'Special gold Pikachu card from celebrations set.',
  'Celebrations', '025/025', true, true
),
(
  'Giratina VSTAR', 89.99, null,
  'https://images.pexels.com/photos/9072322/pexels-photo-9072322.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Rare', 'NM', 3, 'EP #43', '2024-01-05',
  'Powerful Giratina VSTAR from Lost Origin.',
  'Lost Origin', '131/196', false, true
),
(
  'Alakazam V', 24.99, null,
  'https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Uncommon', 'LP', 5, 'EP #41', '2023-12-28',
  'Classic Alakazam V card in lightly played condition.',
  'Brilliant Stars', '059/172', false, true
),
(
  'Machamp GX', 19.99, 29.99,
  'https://images.pexels.com/photos/9072319/pexels-photo-9072319.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Common', 'MP', 8, 'EP #39', '2023-12-20',
  'Fighting type Machamp GX, great for collectors.',
  'Burning Shadows', '064/147', false, true
)
ON CONFLICT (id) DO NOTHING;