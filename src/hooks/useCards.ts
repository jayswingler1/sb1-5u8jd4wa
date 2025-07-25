import { useState, useEffect } from 'react';
import { supabase, Card } from '../lib/supabase';

export const useCards = (featured = false) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching cards...', { featured });
      
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
      console.log('Cards fetched:', data?.length || 0);
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Unable to load cards. Please check your connection.');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [featured]);

  const refreshCards = () => {
    console.log('Manual refresh triggered');
    fetchCards();
  };

  return { cards, loading, error, refreshCards };
};