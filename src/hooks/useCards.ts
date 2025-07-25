import { useState, useEffect } from 'react';
import { supabase, Card } from '../lib/supabase';

export const useCards = (featured = false) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
    
    // Set up real-time subscription with error handling for deletions
    let channel;
    try {
      channel = supabase
        .channel('cards_realtime')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'cards'
        }, (payload) => {
          console.log('Real-time update received:', payload);
          try {
            // Handle different event types
            if (payload.eventType === 'DELETE') {
              console.log('Card deleted:', payload.old);
              // Remove deleted card from local state immediately
              setCards(prevCards => prevCards.filter(card => card.id !== payload.old.id));
            } else {
              // For INSERT/UPDATE, refresh the data
              setTimeout(() => {
                fetchCards();
              }, 100);
            }
          } catch (err) {
            console.error('Error processing real-time update:', err);
            // Fallback to full refresh
            fetchCards();
          }
        })
        .subscribe((status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIPTION_ERROR') {
            console.error('Real-time subscription error, falling back to manual refresh');
          }
        });
    } catch (err) {
      console.error('Error setting up real-time subscription:', err);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.error('Error removing channel:', err);
        }
      }
    };
  }, [featured]);

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

  const refreshCards = () => {
    console.log('Manual refresh triggered');
    fetchCards();
  };

  return { cards, loading, error, refreshCards };
};