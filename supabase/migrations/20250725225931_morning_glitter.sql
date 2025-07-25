/*
  # Clear existing cards from database

  This migration removes all existing cards from the cards table to start fresh.
  
  1. Delete all existing card records
  2. Reset any sequences if needed
*/

-- Delete all existing cards
DELETE FROM cards;

-- Optional: Reset the sequence for order numbers if you have one
-- This ensures order numbers start fresh when new orders are created
-- DELETE FROM orders;
-- ALTER SEQUENCE IF EXISTS order_number_seq RESTART WITH 1;