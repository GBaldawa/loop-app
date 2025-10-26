import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Search, Filter, ArrowLeft, ChevronDown } from 'lucide-react';
import ItemAutocomplete from './components/ItemAutocomplete';
import { useNavigate } from 'react-router-dom';

// Comprehensive item database for smart matching
const ITEM_DATABASE = {
  'Electronics': [
    { name: 'iPhone Charger', aliases: ['iphone charger', 'lightning cable', 'apple charger', 'iphone cable', 'lightning charger'] },
    { name: 'USB Cable', aliases: ['usb cable', 'usb cord', 'charging cable', 'usb charger', 'micro usb'] },
    { name: 'Power Bank', aliases: ['power bank', 'portable charger', 'battery pack', 'external battery'] },
    { name: 'Laptop Charger', aliases: ['laptop charger', 'computer charger', 'macbook charger', 'pc charger'] },
    { name: 'Headphones', aliases: ['headphones', 'earphones', 'earbuds', 'airpods', 'wireless headphones'] },
    { name: 'Phone Case', aliases: ['phone case', 'iphone case', 'phone cover', 'protective case'] },
    { name: 'Bluetooth Speaker', aliases: ['bluetooth speaker', 'wireless speaker', 'portable speaker'] },
    { name: 'Camera', aliases: ['camera', 'digital camera', 'dslr', 'point and shoot'] },
    { name: 'Tablet', aliases: ['tablet', 'ipad', 'android tablet', 'kindle'] },
    { name: 'Gaming Controller', aliases: ['gaming controller', 'xbox controller', 'playstation controller', 'gamepad'] }
  ],
  'Books': [
    { name: 'Textbook', aliases: ['textbook', 'school book', 'course book', 'academic book'] },
    { name: 'Novel', aliases: ['novel', 'fiction book', 'story book', 'literature'] },
    { name: 'Cookbook', aliases: ['cookbook', 'recipe book', 'cooking book'] },
    { name: 'Dictionary', aliases: ['dictionary', 'word book', 'reference book'] },
    { name: 'Magazine', aliases: ['magazine', 'periodical', 'journal'] },
    { name: 'Comic Book', aliases: ['comic book', 'graphic novel', 'manga'] }
  ],
  'Clothing': [
    { name: 'Jacket', aliases: ['jacket', 'coat', 'blazer', 'outerwear'] },
    { name: 'Shoes', aliases: ['shoes', 'sneakers', 'boots', 'sandals', 'heels'] },
    { name: 'Backpack', aliases: ['backpack', 'bag', 'rucksack', 'school bag'] },
    { name: 'Hat', aliases: ['hat', 'cap', 'beanie', 'headwear'] },
    { name: 'Scarf', aliases: ['scarf', 'wrap', 'shawl'] },
    { name: 'Gloves', aliases: ['gloves', 'mittens', 'handwear'] }
  ],
  'Tools': [
    { name: 'Screwdriver', aliases: ['screwdriver', 'screw driver', 'tool'] },
    { name: 'Hammer', aliases: ['hammer', 'mallet', 'tool'] },
    { name: 'Drill', aliases: ['drill', 'power drill', 'electric drill'] },
    { name: 'Wrench', aliases: ['wrench', 'spanner', 'tool'] },
    { name: 'Pliers', aliases: ['pliers', 'tool'] },
    { name: 'Tape Measure', aliases: ['tape measure', 'measuring tape', 'ruler'] }
  ],
  'Sports': [
    { name: 'Basketball', aliases: ['basketball', 'bball', 'sports ball'] },
    { name: 'Tennis Racket', aliases: ['tennis racket', 'tennis racquet', 'racket'] },
    { name: 'Soccer Ball', aliases: ['soccer ball', 'football', 'sports ball'] },
    { name: 'Yoga Mat', aliases: ['yoga mat', 'exercise mat', 'fitness mat'] },
    { name: 'Dumbbells', aliases: ['dumbbells', 'weights', 'exercise weights'] },
    { name: 'Bicycle', aliases: ['bicycle', 'bike', 'cycling'] }
  ],
  'Home': [
    { name: 'Umbrella', aliases: ['umbrella', 'rain umbrella', 'parasol'] },
    { name: 'Flashlight', aliases: ['flashlight', 'torch', 'light'] },
    { name: 'Extension Cord', aliases: ['extension cord', 'power cord', 'cable'] },
    { name: 'Vacuum', aliases: ['vacuum', 'vacuum cleaner', 'cleaner'] },
    { name: 'Iron', aliases: ['iron', 'clothes iron', 'steam iron'] },
    { name: 'Fan', aliases: ['fan', 'electric fan', 'cooling fan'] }
  ],
  'General': [
    { name: 'Keys', aliases: ['keys', 'key', 'house keys', 'car keys'] },
    { name: 'Wallet', aliases: ['wallet', 'purse', 'billfold'] },
    { name: 'Watch', aliases: ['watch', 'timepiece', 'wristwatch'] },
    { name: 'Sunglasses', aliases: ['sunglasses', 'shades', 'eyewear'] },
    { name: 'Water Bottle', aliases: ['water bottle', 'bottle', 'drink bottle'] },
    { name: 'Notebook', aliases: ['notebook', 'notepad', 'journal', 'book'] }
  ]
};

// Smart item matching function
const findMatchingItem = (input) => {
  const normalizedInput = input.toLowerCase().trim();
  
  for (const [category, items] of Object.entries(ITEM_DATABASE)) {
    for (const item of items) {
      // Exact match
      if (item.name.toLowerCase() === normalizedInput) {
        return { ...item, category };
      }
      
      // Alias match
      if (item.aliases.some(alias => alias.toLowerCase() === normalizedInput)) {
        return { ...item, category };
      }
      
      // Partial match
      if (item.name.toLowerCase().includes(normalizedInput) || 
          item.aliases.some(alias => alias.toLowerCase().includes(normalizedInput))) {
        return { ...item, category };
      }
    }
  }
  
  return null;
};

// Get item suggestions for autocomplete
const getItemSuggestions = (input) => {
  if (!input || input.length < 2) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  const suggestions = [];
  
  for (const [category, items] of Object.entries(ITEM_DATABASE)) {
    for (const item of items) {
      // Check if input matches item name or any alias
      const matchesName = item.name.toLowerCase().includes(normalizedInput);
      const matchesAlias = item.aliases.some(alias => alias.toLowerCase().includes(normalizedInput));
      
      if (matchesName || matchesAlias) {
        suggestions.push({
          name: item.name,
          category: category,
          alias: item.aliases[0] // Show first alias as example
        });
      }
    }
  }
  
  // Remove duplicates and limit results
  const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
    index === self.findIndex(s => s.name === suggestion.name)
  ).slice(0, 10);
  
  return uniqueSuggestions;
};

const ItemCard = ({ item, onEdit, onDelete }) => {
  // Safety check for item data
  if (!item) {
    console.error('ItemCard received undefined item');
    return null;
  }

  const itemName = item.name || 'Unnamed Item';
  const itemDescription = item.description || '';
  const itemAvailable = item.available !== false; // Default to true if undefined

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${itemAvailable ? '#10B981' : '#EF4444'}`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
        }}>
          {itemName}
        </h3>
        <span style={{
          backgroundColor: itemAvailable ? '#D1FAE5' : '#FEE2E2',
          color: itemAvailable ? '#065F46' : '#991B1B',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
        }}>
          {itemAvailable ? 'Available' : 'Borrowed'}
        </span>
      </div>

      {itemDescription && (
        <p style={{
          margin: '0.5rem 0',
          color: '#6B7280',
          fontSize: '0.9375rem',
          lineHeight: '1.5',
        }}>
          {itemDescription}
        </p>
      )}

      {/* Value and Points Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0.75rem 0',
        padding: '0.5rem',
        backgroundColor: '#F9FAFB',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#6B7280', fontWeight: '500' }}>Value:</span>
          <span style={{ color: '#059669', fontWeight: '600' }}>${item.value || 25}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#6B7280', fontWeight: '500' }}>Points:</span>
          <span style={{ color: '#9333ea', fontWeight: '600' }}>{item.points || 5}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #F3F4F6',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: '#4B5563',
          }}>
            Earns: 
          </span>
          <span style={{
            fontWeight: '600',
            color: '#9333EA',
          }}>
            {item.points || 5} pts
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
        }}>
          <button
            onClick={() => onEdit(item)}
            style={{
              backgroundColor: '#F3F4F6',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Edit size={18} color="#4B5563" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            style={{
              backgroundColor: '#FEE2E2',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trash2 size={18} color="#EF4444" />
          </button>
        </div>
      </div>
    </div>
  );
};

const InventoryPage = ({ items = [], onAddItem, onEditItem, onDeleteItem }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Debug logging
  console.log('InventoryPage rendered with items:', items);
  console.log('Items length:', items?.length);
  console.log('onAddItem function:', typeof onAddItem);
  console.log('onEditItem function:', typeof onEditItem);
  console.log('onDeleteItem function:', typeof onDeleteItem);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    value: 25,
    image: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      console.log('Submitting item:', formData);
      let success;
      
      if (editingItem) {
        console.log('Editing item:', editingItem.id);
        success = await onEditItem(editingItem.id, formData);
        if (success) {
          setEditingItem(null);
          setFormData({ name: '', description: '', category: 'Electronics', image: '' });
          setShowAddForm(false);
        }
      } else {
        console.log('Adding new item');
        success = await onAddItem(formData);
        if (success) {
          setFormData({ name: '', description: '', category: 'Electronics', image: '' });
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || 'Electronics',
      value: item.value || 25,
      image: item.image || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await onDeleteItem(id);
    }
  };


  const filteredItems = items.filter(item => {
    // Safety check for undefined/null values
    const itemName = item.name || '';
    const itemDescription = item.description || '';
    
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         itemDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'available' && item.available) ||
                      (activeTab === 'borrowed' && !item.available);
    return matchesSearch && matchesTab;
  });

  const availableCount = items.filter(item => item && item.available === true).length;
  const borrowedCount = items.filter(item => item && item.available === false).length;

  // Safety check - if functions are missing, show error
  if (!onAddItem || !onEditItem || !onDeleteItem) {
    console.error('Missing required functions:', { onAddItem, onEditItem, onDeleteItem });
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.75rem',
        margin: '1rem'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
          Error Loading Inventory
        </h2>
        <p style={{ color: '#991b1b' }}>
          There was an error loading the inventory page. Please refresh and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1rem',
      paddingBottom: '5rem',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#F9FAFB'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: 0,
        }}>
          My Inventory
        </h1>
        
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            backgroundColor: '#9333EA',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.5rem 1.25rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#7E22CE',
            },
          }}
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      <div style={{
        display: 'flex',
        backgroundColor: '#F3F4F6',
        borderRadius: '0.75rem',
        padding: '0.25rem',
        marginBottom: '1.5rem',
      }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: activeTab === 'all' ? 'white' : 'transparent',
            color: activeTab === 'all' ? '#1F2937' : '#6B7280',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span>All</span>
          <span style={{
            backgroundColor: activeTab === 'all' ? '#EDE9FE' : '#E5E7EB',
            color: activeTab === 'all' ? '#7C3AED' : '#6B7280',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}>
            {items.length}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab('available')}
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: activeTab === 'available' ? 'white' : 'transparent',
            color: activeTab === 'available' ? '#1F2937' : '#6B7280',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'available' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span>Available</span>
          <span style={{
            backgroundColor: activeTab === 'available' ? '#D1FAE5' : '#E5E7EB',
            color: activeTab === 'available' ? '#065F46' : '#6B7280',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}>
            {availableCount}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab('borrowed')}
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: activeTab === 'borrowed' ? 'white' : 'transparent',
            color: activeTab === 'borrowed' ? '#1F2937' : '#6B7280',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'borrowed' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span>Borrowed</span>
          <span style={{
            backgroundColor: activeTab === 'borrowed' ? '#FEE2E2' : '#E5E7EB',
            color: activeTab === 'borrowed' ? '#991B1B' : '#6B7280',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}>
            {borrowedCount}
          </span>
        </button>
      </div>

      <div style={{
        position: 'relative',
        marginBottom: '1.25rem',
      }}>
        <Search size={18} color="#9CA3AF" style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
        }} />
        <input
          type="text"
          placeholder="Search your items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            backgroundColor: 'white',
            fontSize: '0.9375rem',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} color="#9CA3AF" />
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <ItemCard
              key={item.id || `item-${index}`}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            marginTop: '1rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#F3F4F6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#9CA3AF'
            }}>
              <Search size={32} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '0.5rem'
            }}>
              {searchQuery ? 'No items found' : 'Your inventory is empty'}
            </h3>
            <p style={{
              color: '#6B7280',
              marginBottom: '1.5rem',
              maxWidth: '320px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.5'
            }}>
              {searchQuery 
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'Start by adding your first item to share with others.'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                backgroundColor: '#9333EA',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#7E22CE',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              <Plus size={18} style={{ marginRight: '0.5rem' }} />
              Add Item
            </button>
          </div>
        )}
      </div>

      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '28rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6',
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
              }}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setFormData({ name: '', description: '', category: 'Electronics', image: '' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.25rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={24} color="#6B7280" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{
              padding: '1.5rem',
            }}>
              <div style={{
                marginBottom: '1.25rem',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Item Name
                </label>
                <ItemAutocomplete
                  value={formData.name}
                  onChange={(value) => setFormData({...formData, name: value})}
                  placeholder="e.g., iPhone Charger"
                  getItemSuggestions={getItemSuggestions}
                />
              </div>
              
              <div style={{
                marginBottom: '1.25rem',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.9375rem',
                    color: '#111827',
                    backgroundColor: '#F9FAFB',
                    outline: 'none',
                    transition: 'all 0.2s',
                    minHeight: '80px',
                  }}
                  placeholder="Add details about the item..."
                  rows="3"
                />
              </div>
              
              <div style={{
                marginBottom: '1.25rem',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.9375rem',
                    color: '#111827',
                    backgroundColor: '#F9FAFB',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Books">Books</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Sports">Sports</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style={{
                marginBottom: '1.25rem',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.9375rem',
                    color: '#111827',
                    backgroundColor: '#F9FAFB',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  placeholder="25"
                />
                <p style={{
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#6B7280',
                }}>
                  Estimated dollar value for points calculation
                </p>
              </div>
              
              <div style={{
                marginBottom: '1.25rem',
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Image (Optional)
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'white',
                    transition: 'all 0.2s',
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #F3F4F6',
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({ name: '', description: '', category: 'Electronics', image: '' });
                  }}
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#4B5563',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.9375rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#9333EA',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryPage;
