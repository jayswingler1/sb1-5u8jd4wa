import React, { useState, useEffect } from 'react';
import { supabase, Card } from '../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'cards' | 'orders' | 'subscribers'>('cards');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    rarity: 'Common',
    condition: 'NM',
    stock_quantity: '1',
    set_name: '',
    card_number: '',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase) {
      setSupabaseError('Supabase is not configured. Please set up your environment variables.');
      setLoading(false);
      return;
    }
    fetchCards();
    fetchOrders();
    fetchSubscribers();
  }, []);

  const fetchCards = async () => {
    try {
      // If Supabase is not configured, return empty array
      if (!supabase) {
        setCards([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            first_name,
            last_name,
            email
          ),
          order_items (
            quantity,
            unit_price,
            total_price,
            cards (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('email_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    setUploadingImage(true);
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `card-images/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('card-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      alert('Supabase is not configured. Please set up your environment variables.');
      return;
    }
    
    try {
      let imageUrl = formData.image_url;
      
      // Upload image if a new file was selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }
      
      const cardData = {
        ...formData,
        image_url: imageUrl,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        pull_date: formData.pull_date || null
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

      resetForm();
      fetchCards();
      fetchOrders();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      price: card.price.toString(),
      original_price: card.original_price?.toString() || '',
      rarity: card.rarity,
      condition: card.condition,
      stock_quantity: card.stock_quantity.toString(),
      set_name: card.set_name || '',
      card_number: card.card_number || '',
      is_featured: card.is_featured,
      is_active: card.is_active
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      alert('Supabase is not configured. Cannot delete card.');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Attempting to delete card with ID:', id);
      
      // First, check if the card exists
      const { data: existingCard, error: checkError } = await supabase
        .from('cards')
        .select('id, name')
        .eq('id', id)
        .single();
      
      if (checkError) {
        console.error('Error checking card existence:', checkError);
        alert(`Error finding card: ${checkError.message}`);
        return;
      }
      
      if (!existingCard) {
        console.error('Card not found with ID:', id);
        alert('Card not found in database');
        return;
      }
      
      console.log('Found card to delete:', existingCard);
      
      // Try to delete the card
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error details:', error);
        throw error;
      }
      
      console.log('Delete operation completed successfully');
      
      console.log('Deletion successful - card removed from database');
      alert('Card deleted successfully!');
      
      // Force refresh the cards list
      console.log('Refreshing cards list...');
      await fetchCards();
      console.log('Cards list refreshed');
      
    } catch (error) {
      console.error('Error deleting card:', error);
      alert(`Error deleting card: ${error?.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      original_price: '',
      rarity: 'Common',
      condition: 'NM',
      stock_quantity: '1',
      set_name: '',
      card_number: '',
      is_featured: false,
      is_active: true
    });
    setEditingCard(null);
    setShowAddForm(false);
    setImageFile(null);
    setImagePreview('');
  };

  // Show Supabase configuration error
  if (supabaseError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Supabase Not Configured</h1>
            <p className="text-gray-600 mb-6">
              To use the admin panel, you need to set up Supabase. Please follow these steps:
            </p>
            <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click the "Connect to Supabase" button in the top right corner</li>
                <li>Follow the setup instructions to create your Supabase project</li>
                <li>Your environment variables will be automatically configured</li>
                <li>Refresh this page to access the admin panel</li>
              </ol>
            </div>
            <div className="text-sm text-gray-500">
              Need help? Check the Supabase documentation for setup instructions.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Store Management</h1>
            <div className="flex gap-4">
              {activeTab === 'cards' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Card
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'cards'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cards ({cards.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'subscribers'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Subscribers ({subscribers.length})
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {editingCard ? 'Edit Card' : 'Add New Card'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Original Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rarity
                      </label>
                      <select
                        value={formData.rarity}
                        onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Common">Common</option>
                        <option value="Uncommon">Uncommon</option>
                        <option value="Rare">Rare</option>
                        <option value="Legendary">Legendary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="M">Mint (M)</option>
                        <option value="NM">Near Mint (NM)</option>
                        <option value="LP">Lightly Played (LP)</option>
                        <option value="MP">Moderately Played (MP)</option>
                        <option value="HP">Heavily Played (HP)</option>
                        <option value="D">Damaged (D)</option>
                      </select>
                    </div>

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Image *
                    </label>
                    
                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div className="flex items-center gap-4">
                        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                          <Upload className="w-4 h-4" />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        {imageFile && (
                          <span className="text-sm text-gray-600">
                            {imageFile.name}
                          </span>
                        )}
                      </div>
                      
                      {/* Image Preview */}
                      {(imagePreview || formData.image_url) && (
                        <div className="border-2 border-gray-300 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <img
                            src={imagePreview || formData.image_url}
                            alt="Card preview"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-black"
                          />
                        </div>
                      )}
                      
                      {/* Fallback URL Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Or paste image URL:
                        </label>
                        <input
                          type="url"
                          value={imagePreview || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              setImageFile(null);
                              setImagePreview('');
                              setImagePreview(e.target.value);
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Set Name
                      </label>
                      <select
                        value={formData.set_name}
                        onChange={(e) => setFormData({ ...formData, set_name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a Set</option>
                        <optgroup label="Base Set">
                          <option value="Base Set (1st Edition)">Base Set (1st Edition)</option>
                          <option value="Base Set (Shadowless)">Base Set (Shadowless)</option>
                          <option value="Base Set (Unlimited)">Base Set (Unlimited)</option>
                        </optgroup>
                        <optgroup label="Jungle">
                          <option value="Jungle (1st Edition)">Jungle (1st Edition)</option>
                          <option value="Jungle (Unlimited)">Jungle (Unlimited)</option>
                        </optgroup>
                        <optgroup label="Fossil">
                          <option value="Fossil (1st Edition)">Fossil (1st Edition)</option>
                          <option value="Fossil (Unlimited)">Fossil (Unlimited)</option>
                        </optgroup>
                        <optgroup label="Team Rocket">
                          <option value="Team Rocket (1st Edition)">Team Rocket (1st Edition)</option>
                          <option value="Team Rocket (Unlimited)">Team Rocket (Unlimited)</option>
                        </optgroup>
                        <optgroup label="Gym Series">
                          <option value="Gym Heroes (1st Edition)">Gym Heroes (1st Edition)</option>
                          <option value="Gym Heroes (Unlimited)">Gym Heroes (Unlimited)</option>
                          <option value="Gym Challenge (1st Edition)">Gym Challenge (1st Edition)</option>
                          <option value="Gym Challenge (Unlimited)">Gym Challenge (Unlimited)</option>
                        </optgroup>
                        <optgroup label="Neo Series">
                          <option value="Neo Genesis (1st Edition)">Neo Genesis (1st Edition)</option>
                          <option value="Neo Genesis (Unlimited)">Neo Genesis (Unlimited)</option>
                          <option value="Neo Discovery (1st Edition)">Neo Discovery (1st Edition)</option>
                          <option value="Neo Discovery (Unlimited)">Neo Discovery (Unlimited)</option>
                          <option value="Neo Revelation (1st Edition)">Neo Revelation (1st Edition)</option>
                          <option value="Neo Revelation (Unlimited)">Neo Revelation (Unlimited)</option>
                          <option value="Neo Destiny (1st Edition)">Neo Destiny (1st Edition)</option>
                          <option value="Neo Destiny (Unlimited)">Neo Destiny (Unlimited)</option>
                        </optgroup>
                        <optgroup label="Other WotC Sets">
                          <option value="Base Set 2 (No 1st Edition)">Base Set 2 (No 1st Edition)</option>
                          <option value="Legendary Collection (No 1st Edition)">Legendary Collection (No 1st Edition)</option>
                          <option value="Southern Islands (No 1st Edition)">Southern Islands (No 1st Edition)</option>
                        </optgroup>
                        <optgroup label="e‑Reader Series">
                          <option value="Expedition Base Set (No 1st Edition)">Expedition Base Set (No 1st Edition)</option>
                          <option value="Aquapolis (No 1st Edition)">Aquapolis (No 1st Edition)</option>
                          <option value="Skyridge (No 1st Edition)">Skyridge (No 1st Edition)</option>
                        </optgroup>
                        <optgroup label="💥 EX Series">
                          <option value="EX Ruby & Sapphire">EX Ruby & Sapphire</option>
                          <option value="EX Sandstorm">EX Sandstorm</option>
                          <option value="EX Dragon">EX Dragon</option>
                          <option value="EX Team Magma vs Team Aqua">EX Team Magma vs Team Aqua</option>
                          <option value="EX Hidden Legends">EX Hidden Legends</option>
                          <option value="EX FireRed & LeafGreen">EX FireRed & LeafGreen</option>
                          <option value="EX Team Rocket Returns">EX Team Rocket Returns</option>
                          <option value="EX Deoxys">EX Deoxys</option>
                          <option value="EX Emerald">EX Emerald</option>
                          <option value="EX Unseen Forces">EX Unseen Forces</option>
                          <option value="EX Delta Species">EX Delta Species</option>
                          <option value="EX Legend Maker">EX Legend Maker</option>
                          <option value="EX Holon Phantoms">EX Holon Phantoms</option>
                          <option value="EX Crystal Guardians">EX Crystal Guardians</option>
                          <option value="EX Dragon Frontiers">EX Dragon Frontiers</option>
                          <option value="EX Power Keepers">EX Power Keepers</option>
                        </optgroup>
                        <optgroup label="💎 Diamond & Pearl Series">
                          <option value="Diamond & Pearl">Diamond & Pearl</option>
                          <option value="Mysterious Treasures">Mysterious Treasures</option>
                          <option value="Secret Wonders">Secret Wonders</option>
                          <option value="Great Encounters">Great Encounters</option>
                          <option value="Majestic Dawn">Majestic Dawn</option>
                          <option value="Legends Awakened">Legends Awakened</option>
                          <option value="Stormfront">Stormfront</option>
                        </optgroup>
                        <optgroup label="🌟 Platinum Series">
                          <option value="Platinum">Platinum</option>
                          <option value="Rising Rivals">Rising Rivals</option>
                          <option value="Supreme Victors">Supreme Victors</option>
                          <option value="Arceus">Arceus</option>
                        </optgroup>
                        <optgroup label="🧡 HeartGold & SoulSilver Series">
                          <option value="HeartGold & SoulSilver">HeartGold & SoulSilver</option>
                          <option value="Unleashed">Unleashed</option>
                          <option value="Undaunted">Undaunted</option>
                          <option value="Triumphant">Triumphant</option>
                          <option value="Call of Legends">Call of Legends</option>
                        </optgroup>
                        <optgroup label="⚫ Black & White Series">
                          <option value="Black & White">Black & White</option>
                          <option value="Emerging Powers">Emerging Powers</option>
                          <option value="Noble Victories">Noble Victories</option>
                          <option value="Next Destinies">Next Destinies</option>
                          <option value="Dark Explorers">Dark Explorers</option>
                          <option value="Dragons Exalted">Dragons Exalted</option>
                          <option value="Boundaries Crossed">Boundaries Crossed</option>
                          <option value="Plasma Storm">Plasma Storm</option>
                          <option value="Plasma Freeze">Plasma Freeze</option>
                          <option value="Plasma Blast">Plasma Blast</option>
                          <option value="Legendary Treasures">Legendary Treasures</option>
                        </optgroup>
                        <optgroup label="✨ XY Series">
                          <option value="XY">XY</option>
                          <option value="Flashfire">Flashfire</option>
                          <option value="Furious Fists">Furious Fists</option>
                          <option value="Phantom Forces">Phantom Forces</option>
                          <option value="Primal Clash">Primal Clash</option>
                          <option value="Double Crisis">Double Crisis</option>
                          <option value="Roaring Skies">Roaring Skies</option>
                          <option value="Ancient Origins">Ancient Origins</option>
                          <option value="BREAKthrough">BREAKthrough</option>
                          <option value="BREAKpoint">BREAKpoint</option>
                          <option value="Generations">Generations</option>
                          <option value="Fates Collide">Fates Collide</option>
                          <option value="Steam Siege">Steam Siege</option>
                          <option value="Evolutions">Evolutions</option>
                        </optgroup>
                        <optgroup label="🌙 Sun & Moon Series">
                          <option value="Sun & Moon">Sun & Moon</option>
                          <option value="Guardians Rising">Guardians Rising</option>
                          <option value="Burning Shadows">Burning Shadows</option>
                          <option value="Shining Legends">Shining Legends</option>
                          <option value="Crimson Invasion">Crimson Invasion</option>
                          <option value="Ultra Prism">Ultra Prism</option>
                          <option value="Forbidden Light">Forbidden Light</option>
                          <option value="Celestial Storm">Celestial Storm</option>
                          <option value="Dragon Majesty">Dragon Majesty</option>
                          <option value="Lost Thunder">Lost Thunder</option>
                          <option value="Team Up">Team Up</option>
                          <option value="Detective Pikachu">Detective Pikachu</option>
                          <option value="Unbroken Bonds">Unbroken Bonds</option>
                          <option value="Unified Minds">Unified Minds</option>
                          <option value="Hidden Fates">Hidden Fates</option>
                          <option value="Cosmic Eclipse">Cosmic Eclipse</option>
                        </optgroup>
                        <optgroup label="🛡️ Sword & Shield Series">
                          <option value="Sword & Shield">Sword & Shield</option>
                          <option value="Rebel Clash">Rebel Clash</option>
                          <option value="Darkness Ablaze">Darkness Ablaze</option>
                          <option value="Champion's Path">Champion's Path</option>
                          <option value="Vivid Voltage">Vivid Voltage</option>
                          <option value="Shining Fates">Shining Fates</option>
                          <option value="Battle Styles">Battle Styles</option>
                          <option value="Chilling Reign">Chilling Reign</option>
                          <option value="Evolving Skies">Evolving Skies</option>
                          <option value="Celebrations">Celebrations</option>
                          <option value="Fusion Strike">Fusion Strike</option>
                          <option value="Brilliant Stars">Brilliant Stars</option>
                          <option value="Astral Radiance">Astral Radiance</option>
                          <option value="Pokémon GO">Pokémon GO</option>
                          <option value="Lost Origin">Lost Origin</option>
                          <option value="Silver Tempest">Silver Tempest</option>
                          <option value="Crown Zenith">Crown Zenith</option>
                        </optgroup>
                        <optgroup label="🔴 Scarlet & Violet Series">
                          <option value="Scarlet & Violet">Scarlet & Violet</option>
                          <option value="Paldea Evolved">Paldea Evolved</option>
                          <option value="Obsidian Flames">Obsidian Flames</option>
                          <option value="151">151</option>
                          <option value="Paradox Rift">Paradox Rift</option>
                          <option value="Paldean Fates">Paldean Fates</option>
                          <option value="Temporal Forces">Temporal Forces</option>
                          <option value="Twilight Masquerade">Twilight Masquerade</option>
                          <option value="Shrouded Fable">Shrouded Fable</option>
                          <option value="Stellar Crown">Stellar Crown</option>
                          <option value="Surging Sparks">Surging Sparks</option>
                          <option value="Prismatic Evolutions">Prismatic Evolutions</option>
                          <option value="Journey Together">Journey Together</option>
                          <option value="Destined Rivals">Destined Rivals</option>
                          <option value="Black Bolt">Black Bolt</option>
                          <option value="White Flare">White Flare</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.card_number}
                        onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="mr-2"
                      />
                      Featured on Homepage
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="mr-2"
                      />
                      Active for Sale
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : editingCard ? 'Update Card' : 'Add Card'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'cards' && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Condition</th>
                    <th className="px-4 py-2 text-left">Featured</th>
                    <th className="px-4 py-2 text-left">Active</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr key={card.id} className="border-b">
                      <td className="px-4 py-2">
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium">{card.name}</td>
                      <td className="px-4 py-2">${card.price}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          card.stock_quantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {card.stock_quantity}
                        </span>
                      </td>
                      <td className="px-4 py-2">{card.condition}</td>
                      <td className="px-4 py-2">
                        {card.is_featured ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {card.is_active ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✗</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(card)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(card.id)}
                            className="text-red-600 hover:text-red-800"
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
                <div className="text-center py-8 text-gray-500">
                  No cards found. Add your first card to get started!
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Order #</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Items</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-2 font-mono text-sm">{order.order_number}</td>
                      <td className="px-4 py-2">
                        <div>
                          <div className="font-medium">
                            {order.customers?.first_name} {order.customers?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{order.customers?.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm">
                          {order.order_items?.length || 0} items
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium">${order.total_amount}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders found.
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Source</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{subscriber.email}</td>
                      <td className="px-4 py-2">{subscriber.first_name || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {subscriber.subscription_source}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          subscriber.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.is_active ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {subscribers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No subscribers found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;