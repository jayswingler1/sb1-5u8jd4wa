import { useState, useEffect } from 'react';
import { supabase, Card } from '../lib/supabase';

export const useCards = (featured = false) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, [featured]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      
      setError('Unable to load cards. Please check your connection.');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshCards = () => {
    fetchCards();
  };

  return { cards, loading, error, refreshCards };
};