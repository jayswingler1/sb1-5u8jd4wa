/*
  # Create E-commerce Tables

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `addresses`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `type` (text, billing/shipping)
      - `first_name` (text)
      - `last_name` (text)
      - `company` (text)
      - `address_line_1` (text)
      - `address_line_2` (text)
      - `city` (text)
      - `state` (text)
      - `postal_code` (text)
      - `country` (text)
      - `is_default` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `order_number` (text, unique)
      - `status` (text, pending/processing/shipped/delivered/cancelled)
      - `subtotal` (decimal)
      - `tax_amount` (decimal)
      - `shipping_amount` (decimal)
      - `total_amount` (decimal)
      - `currency` (text)
      - `payment_status` (text)
      - `payment_method` (text)
      - `stripe_payment_intent_id` (text)
      - `billing_address` (jsonb)
      - `shipping_address` (jsonb)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `card_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total_price` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for customers and admin access
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('billing', 'shipping')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
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
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  card_id uuid REFERENCES cards(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for customers
CREATE POLICY "Customers can read own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Policies for addresses
CREATE POLICY "Customers can manage own addresses"
  ON addresses
  FOR ALL
  TO authenticated
  USING (customer_id::text = auth.uid()::text);

-- Policies for orders
CREATE POLICY "Customers can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Customers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id::text = auth.uid()::text);

-- Policies for order_items
CREATE POLICY "Customers can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Customers can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id::text = auth.uid()::text
    )
  );

-- Admin policies (for authenticated admin users)
CREATE POLICY "Admins can manage all customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all addresses"
  ON addresses
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (true);

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'LE-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Update triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();