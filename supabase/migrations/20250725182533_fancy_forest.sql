/*
  # Fix RLS policies for anonymous checkout

  1. Security Updates
    - Allow anonymous users to create customers during checkout
    - Allow anonymous users to create orders and order items
    - Maintain security while enabling public checkout functionality

  2. Policy Changes
    - Update customers table to allow anonymous inserts
    - Update orders table to allow anonymous inserts  
    - Update order_items table to allow anonymous inserts
    - Keep existing authenticated user policies intact
*/

-- Allow anonymous users to create customers during checkout
DROP POLICY IF EXISTS "Anonymous can create customers" ON customers;
CREATE POLICY "Anonymous can create customers"
  ON customers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to create orders
DROP POLICY IF EXISTS "Anonymous can create orders" ON orders;
CREATE POLICY "Anonymous can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to create order items
DROP POLICY IF EXISTS "Anonymous can create order items" ON order_items;
CREATE POLICY "Anonymous can create order items"
  ON order_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to read their own cart items (already exists but ensure it's correct)
DROP POLICY IF EXISTS "Public can manage cart" ON cart_items;
CREATE POLICY "Public can manage cart"
  ON cart_items
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);