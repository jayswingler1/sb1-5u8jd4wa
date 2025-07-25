import { useState, useEffect } from 'react';
import { supabase, Card } from '../lib/supabase';

export const useCards = (featured = false) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
    
    // Set up real-time subscription with better error handling
    const channel = supabase
      .channel('cards_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cards'
      }, (payload) => {
        console.log('Real-time update received:', payload);
        // Force refresh when any change occurs
        setTimeout(() => {
          fetchCards();
        }, 100);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [featured]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching cards...', { featured });
      
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
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

  const refreshCards = () => {
    console.log('Manual refresh triggered');
    fetchCards();
  };

  return { cards, loading, error, refreshCards };
};