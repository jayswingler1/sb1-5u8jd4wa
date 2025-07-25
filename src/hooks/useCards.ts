import { useState, useEffect } from 'react';
import { supabase, Card } from '../lib/supabase';

export const useCards = (isFeatured?: boolean) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, [isFeatured]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      let query = supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (isFeatured) {
        query = query.eq('is_featured', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  return { cards, loading, error, refetch: fetchCards };
};