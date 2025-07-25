/*
  # Fresh Start - Complete Database Reset

  1. Clean Slate
    - Drop all existing tables and policies
    - Create fresh tables with proper structure
    - Set up correct RLS policies for admin operations

  2. New Tables
    - `cards` - Product inventory
    - `customers` - Customer information  
    - `orders` - Order management
    - `order_items` - Order line items
    - `email_subscribers` - Newsletter subscribers

  3. Security
    - Enable RLS on all tables
    - Allow public access for admin operations
    - Proper policies for frontend and checkout
*/

-- Drop all existing tables if they exist (cascade to remove dependencies)
DROP TABLE IF EXISTS inventory_logs CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS email_subscribers CASCADE;
DROP TABLE IF EXISTS cards CASCADE;

-- Drop existing sequences
DROP SEQUENCE IF EXISTS order_number_seq CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS set_order_number() CASCADE;
DROP FUNCTION IF EXISTS update_inventory_on_order() CASCADE;

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create cards table
CREATE TABLE cards (
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

-- Create customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table with sequence for order numbers
CREATE SEQUENCE order_number_seq START 1000;

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL DEFAULT ('LE-' || LPAD(nextval('order_number_seq')::text, 6, '0')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  stripe_payment_intent_id text,
  billing_address jsonb,
  shipping_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  card_id uuid REFERENCES cards(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create email_subscribers table
CREATE TABLE email_subscribers (
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

-- Enable RLS on all tables
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Cards policies - Allow full public access for admin panel
CREATE POLICY "Public full access to cards"
  ON cards
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Customers policies - Allow creation during checkout
CREATE POLICY "Public can create customers"
  ON customers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can read customers"
  ON customers
  FOR SELECT
  TO public
  USING (true);

-- Orders policies - Allow creation during checkout
CREATE POLICY "Public can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can read orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can update orders"
  ON orders
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Order items policies
CREATE POLICY "Public can manage order items"
  ON order_items
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Email subscribers policies
CREATE POLICY "Public can manage subscribers"
  ON email_subscribers
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
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
);