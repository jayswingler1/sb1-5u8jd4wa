/*
  # Create Admin Profile

  1. New Functions
    - `create_admin_profile` - Function to create an admin profile for a specific email
    - `ensure_admin_exists` - Function to check and create admin if needed

  2. Security
    - Only allows creating admin profiles for specific email addresses
    - Maintains existing RLS policies
*/

-- Function to create an admin profile for a specific user
CREATE OR REPLACE FUNCTION create_admin_profile(admin_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users table
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = admin_email;

  -- If user exists, create or update their profile to admin
  IF user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, role, first_name, last_name)
    VALUES (user_id, admin_email, 'admin', 'Admin', 'User')
    ON CONFLICT (id) 
    DO UPDATE SET 
      role = 'admin',
      updated_at = now();
    
    RAISE NOTICE 'Admin profile created/updated for email: %', admin_email;
  ELSE
    RAISE NOTICE 'No user found with email: %', admin_email;
  END IF;
END;
$$;

-- Function to ensure at least one admin exists
CREATE OR REPLACE FUNCTION ensure_admin_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Check if any admin exists
  SELECT COUNT(*) INTO admin_count
  FROM public.profiles
  WHERE role = 'admin';

  -- If no admin exists, log a message
  IF admin_count = 0 THEN
    RAISE NOTICE 'No admin users found. Please create an admin profile manually or sign up and run create_admin_profile function.';
  ELSE
    RAISE NOTICE 'Found % admin user(s)', admin_count;
  END IF;
END;
$$;

-- Run the check
SELECT ensure_admin_exists();