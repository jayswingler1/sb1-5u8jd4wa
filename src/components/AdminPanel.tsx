import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff } from 'lucide-react';
import { supabase, Card } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    image_url: '',
    rarity: 'Common',
    condition: 'NM',
    stock_quantity: '1',
    video_episode: '',
    pull_date: '',
    description: '',
    set_name: '',
    card_number: '',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `cards/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('card-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image_url;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const cardData = {
        name: formData.name,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        image_url: imageUrl,
        rarity: formData.rarity,
        condition: formData.condition,
        stock_quantity: parseInt(formData.stock_quantity),
        video_episode: formData.video_episode || null,
        pull_date: formData.pull_date || null,
        description: formData.description || null,
        set_name: formData.set_name || null,
        card_number: formData.card_number || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active
      };

      if (editingCard) {
        const { error } = await supabase
          .from('cards')
          .update(cardData)
          .eq('id', editingCard.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cards')
          .insert([cardData]);

        if (error) throw error;
      }

      await fetchCards();
      resetForm();
    } catch (err) {
      console.error('Error saving card:', err);
      setError('Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      price: card.price.toString(),
      original_price: card.original_price?.toString() || '',
      image_url: card.image_url,
      rarity: card.rarity,
      condition: card.condition,
      stock_quantity: card.stock_quantity.toString(),
      video_episode: card.video_episode || '',
      pull_date: card.pull_date || '',
      description: card.description || '',
      set_name: card.set_name || '',
      card_number: card.card_number || '',
      is_featured: card.is_featured,
      is_active: card.is_active
    });
    setImagePreview(card.image_url);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        setError(`Failed to delete card: ${error.message}`);
        return;
      }

      // Remove the card from local state immediately
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      
      // Also refresh from database to ensure sync
      fetchCards();
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete card. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      original_price: '',
      image_url: '',
      rarity: 'Common',
      condition: 'NM',
      stock_quantity: '1',
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
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading && cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-bold">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Card Management</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Card
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingCard ? 'Edit Card' : 'Add New Card'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rarity
                  </label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => handleInputChange('rarity', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="M">Mint (M)</option>
                    <option value="NM">Near Mint (NM)</option>
                    <option value="LP">Lightly Played (LP)</option>
                    <option value="MP">Moderately Played (MP)</option>
                    <option value="HP">Heavily Played (HP)</option>
                    <option value="D">Damaged (D)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Episode
                  </label>
                  <input
                    type="text"
                    value={formData.video_episode}
                    onChange={(e) => handleInputChange('video_episode', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., EP001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pull Date
                  </label>
                  <input
                    type="date"
                    value={formData.pull_date}
                    onChange={(e) => handleInputChange('pull_date', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Name
                  </label>
                  <input
                    type="text"
                    value={formData.set_name}
                    onChange={(e) => handleInputChange('set_name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Base Set"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.card_number}
                    onChange={(e) => handleInputChange('card_number', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 001/102"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Card description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {imagePreview && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                    Featured Card
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : editingCard ? 'Update Card' : 'Add Card'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cards Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rarity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={card.image_url}
                        alt={card.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{card.name}</div>
                      {card.set_name && (
                        <div className="text-sm text-gray-500">{card.set_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${card.price}</div>
                      {card.original_price && (
                        <div className="text-sm text-gray-500 line-through">${card.original_price}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.stock_quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        card.rarity === 'Legendary' ? 'bg-purple-100 text-purple-800' :
                        card.rarity === 'Rare' ? 'bg-yellow-100 text-yellow-800' :
                        card.rarity === 'Uncommon' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {card.rarity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.condition}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {card.is_active ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        {card.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(card)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cards.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No cards found. Add your first card to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;