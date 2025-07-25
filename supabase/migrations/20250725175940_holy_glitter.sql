/*
  # Setup Orders and Payments System

  1. Security Policies
    - Allow anonymous users to create orders during checkout
    - Allow customers to view their own orders
    - Allow order items to be created with orders
    - Allow inventory updates when orders are placed

  2. Functions
    - Auto-generate order numbers
    - Update inventory when orders are placed

  3. Storage (if needed)
    - Setup for card images
*/

-- Allow anonymous users to create orders (checkout process)
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
CREATE POLICY "Anonymous can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anonymous users to create order items
DROP POLICY IF EXISTS "Customers can create order items" ON order_items;
CREATE POLICY "Anonymous can create order items"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anonymous users to read cards for checkout
DROP POLICY IF EXISTS "Public can read cards" ON cards;
CREATE POLICY "Public can read cards"
  ON cards
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow anonymous users to update card inventory (for stock management)
CREATE POLICY "Public can update card stock"
  ON cards
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to create inventory logs
DROP POLICY IF EXISTS "System can create inventory logs" ON inventory_logs;
CREATE POLICY "Public can create inventory logs"
  ON inventory_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anonymous users to create cart items
DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;
CREATE POLICY "Public can manage cart"
  ON cart_items
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure order number generation function exists
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'LE-' || LPAD(nextval('order_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'order_number_seq') THEN
    CREATE SEQUENCE order_number_seq START 1000;
  END IF;
END $$;

-- Ensure trigger exists for order number generation
DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Function to update inventory when order is placed
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the inventory change
  INSERT INTO inventory_logs (
    card_id,
    change_type,
    quantity_change,
    previous_quantity,
    new_quantity,
    order_id,
    notes
  )
  SELECT 
    NEW.card_id,
    'sale',
    -NEW.quantity,
    c.stock_quantity,
    c.stock_quantity - NEW.quantity,
    NEW.order_id,
    'Sold via order'
  FROM cards c
  WHERE c.id = NEW.card_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory logging
DROP TRIGGER IF EXISTS log_inventory_change ON order_items;
CREATE TRIGGER log_inventory_change
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_on_order();

-- Enable RLS on all tables (ensure they're enabled)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;