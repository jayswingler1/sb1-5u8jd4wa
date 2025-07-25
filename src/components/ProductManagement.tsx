import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, RefreshCw } from 'lucide-react';
import { supabase, Card } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import StarField from './StarField';

interface ProductManagementProps {
  onClose: () => void;
}

interface CardFormData {
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
}

const ProductManagement: React.FC<ProductManagementProps> = ({ onClose }) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CardFormData>({
    name: '',
    price: 0,
    original_price: undefined,
    image_url: '',
    rarity: 'Common',
    condition: 'NM',
    stock_quantity: 1,
    video_episode: '',
    pull_date: '',
    description: '',
    set_name: '',
    card_number: '',
    is_featured: false,
    is_active: true
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      onClose();
    }
  }, [user, isAdmin, authLoading, onClose]);

  useEffect(() => {
    if (isAdmin) {
      fetchCards();
    }
  }, [isAdmin]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CardFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      original_price: undefined,
      image_url: '',
      rarity: 'Common',
      condition: 'NM',
      stock_quantity: 1,
      video_episode: '',
      pull_date: '',
      description: '',
      set_name: '',
      card_number: '',
      is_featured: false,
      is_active: true
    });
    setEditingCard(null);
    setShowAddForm(false);
  };

  const handleAddCard = async () => {
    try {
      setError(null);
      
      const { error: insertError } = await supabase
        .from('cards')
        .insert([formData]);

      if (insertError) throw insertError;

      await fetchCards();
      resetForm();
    } catch (err) {
      console.error('Error adding card:', err);
      setError('Failed to add card. Please try again.');
    }
  };

  const handleUpdateCard = async () => {
    if (!editingCard) return;

    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('cards')
        .update(formData)
        .eq('id', editingCard.id);

      if (updateError) throw updateError;

      await fetchCards();
      resetForm();
    } catch (err) {
      console.error('Error updating card:', err);
      setError('Failed to update card. Please try again.');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (deleteError) throw deleteError;

      await fetchCards();
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete card. Please try again.');
    }
  };

  const startEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      price: card.price,
      original_price: card.original_price || undefined,
      image_url: card.image_url,
      rarity: card.rarity,
      condition: card.condition,
      stock_quantity: card.stock_quantity,
      video_episode: card.video_episode || '',
      pull_date: card.pull_date || '',
      description: card.description || '',
      set_name: card.set_name || '',
      card_number: card.card_number || '',
      is_featured: card.is_featured,
      is_active: card.is_active
    });
    setShowAddForm(true);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || !isAdmin) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-2xl text-center">
          <h2 className="text-2xl font-black text-red-600 mb-4">Access Denied</h2>
          <p className="text-black mb-6">You don't have permission to access this page.</p>
          <button
            onClick={onClose}
            className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-6 rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 overflow-y-auto">
      <StarField />
      
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] backdrop-blur-md border-b-4 border-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onClose}
              className="flex items-center gap-3 text-black hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-black text-lg">Back to Store</span>
            </button>
            
            <h1 className="text-2xl font-black text-black">Product Management</h1>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchCards}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-black font-bold py-2 px-4 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-4 border-red-500 rounded-3xl p-6 mb-8">
            <p className="text-red-800 font-bold">{error}</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-xl mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black">
                {editingCard ? 'Edit Card' : 'Add New Card'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">Card Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Original Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.original_price || ''}
                  onChange={(e) => handleInputChange('original_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Rarity</label>
                <select
                  value={formData.rarity}
                  onChange={(e) => handleInputChange('rarity', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                >
                  <option value="NM">Near Mint (NM)</option>
                  <option value="LP">Lightly Played (LP)</option>
                  <option value="MP">Moderately Played (MP)</option>
                  <option value="HP">Heavily Played (HP)</option>
                  <option value="DMG">Damaged (DMG)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Video Episode</label>
                <input
                  type="text"
                  value={formData.video_episode}
                  onChange={(e) => handleInputChange('video_episode', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Pull Date</label>
                <input
                  type="date"
                  value={formData.pull_date}
                  onChange={(e) => handleInputChange('pull_date', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Set Name</label>
                <input
                  type="text"
                  value={formData.set_name}
                  onChange={(e) => handleInputChange('set_name', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Card Number</label>
                <input
                  type="text"
                  value={formData.card_number}
                  onChange={(e) => handleInputChange('card_number', e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-bold text-black">Featured</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-bold text-black">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={editingCard ? handleUpdateCard : handleAddCard}
                className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingCard ? 'Update Card' : 'Add Card'}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cards List */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-xl">
          <h2 className="text-2xl font-black text-black mb-6">All Cards ({cards.length})</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#fa98d4] mb-4"></div>
              <p className="text-black text-xl font-bold">Loading cards...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-3 px-4 font-black text-black">Image</th>
                    <th className="text-left py-3 px-4 font-black text-black">Name</th>
                    <th className="text-left py-3 px-4 font-black text-black">Price</th>
                    <th className="text-left py-3 px-4 font-black text-black">Stock</th>
                    <th className="text-left py-3 px-4 font-black text-black">Status</th>
                    <th className="text-left py-3 px-4 font-black text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr key={card.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-12 h-16 object-cover rounded border"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-black">{card.name}</div>
                        <div className="text-sm text-gray-600">{card.set_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#ff6b9d]">${card.price}</div>
                        {card.original_price && card.original_price > card.price && (
                          <div className="text-sm text-gray-500 line-through">${card.original_price}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${card.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {card.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            card.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {card.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {card.is_featured && (
                            <span className="text-xs px-2 py-1 rounded-full font-bold bg-[#fa98d4] text-white">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(card)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {cards.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No cards found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;