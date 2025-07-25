import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(
      'https://mnmpxutdcopzrtpowkzh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubXB4dXRkY29wenJ0cG93a3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjE4ODcsImV4cCI6MjA2OTAzNzg4N30.-bzqqvmhvHmL5itrZwFvAxgY2JRSrS8FuZX04uOsJDA'
    );

// Types
export interface Card {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  rarity: string;
  condition: string;
  stock_quantity: number;
  video_episode?: string;
  pull_date?: string;
  description?: string;
  set_name?: string;
  card_number?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  card: Card;
  quantity: number;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  stripe_payment_intent_id?: string;
  billing_address: any;
  shipping_address: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  card_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}