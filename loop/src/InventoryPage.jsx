import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Search, Filter, ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Calculate points based on item value
const calculatePoints = (value) => {
  // Example calculation - adjust as needed
  if (value < 20) return 5;
  if (value < 50) return 10;
  if (value < 100) return 20;
  if (value < 200) return 35;
  return 50;
};

const ItemCard = ({ item, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${item.available ? '#10B981' : '#EF4444'}`,
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
          {item.name}
        </h3>
        <span style={{
          backgroundColor: item.available ? '#D1FAE5' : '#FEE2E2',
          color: item.available ? '#065F46' : '#991B1B',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
        }}>
          {item.available ? 'Available' : 'Borrowed'}
        </span>
      </div>

      {item.description && (
        <p style={{
          margin: '0.5rem 0',
          color: '#6B7280',
          fontSize: '0.9375rem',
          lineHeight: '1.5',
        }}>
          {item.description}
        </p>
      )}

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
            {item.points} pts
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
          <button
            onClick={() => onToggleStatus(item.id)}
            style={{
              backgroundColor: item.available ? '#D1FAE5' : '#FEE2E2',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.available ? (
              <Check size={18} color="#065F46" />
            ) : (
              <X size={18} color="#991B1B" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const InventoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'USB-C Charger',
      description: '65W fast charging, works with most laptops and phones',
      value: 30,
      points: 10,
      available: true,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      name: 'Chemistry 101 Textbook',
      description: '5th Edition, like new condition',
      value: 120,
      points: 35,
      available: false,
      category: 'Books',
      borrowedBy: 'Alex Johnson',
      returnDate: '2023-11-15',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      name: 'DSLR Camera',
      description: 'Nikon D3500 with 18-55mm lens',
      value: 450,
      points: 50,
      available: true,
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62b39d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    points: '',
    category: 'Electronics',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemValue = parseFloat(formData.value) || 0;
    const points = calculatePoints(itemValue);
    
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { 
              ...formData, 
              id: editingItem.id, 
              available: editingItem.available,
              points: points,
              value: itemValue
            }
          : item
      ));
      setEditingItem(null);
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Date.now(),
        available: true,
        points: points,
        value: itemValue,
        image: formData.image || 'https://placehold.co/400x300/9333ea/white?text=No+Image'
      };
      setItems([...items, newItem]);
    }
    setFormData({ 
      name: '', 
      description: '', 
      value: '', 
      category: 'Electronics',
      image: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      value: item.value.toString(),
      category: item.category || 'Electronics',
      image: item.image
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, available: !item.available }
        : item
    ));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'available' && item.available) ||
                      (activeTab === 'borrowed' && !item.available);
    return matchesSearch && matchesTab;
  });

  const availableCount = items.filter(item => item.available).length;
  const borrowedCount = items.length - availableCount;

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
          filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
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
                  setFormData({ name: '', description: '', value: '', category: 'Electronics', image: '' });
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
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                  }}
                  placeholder="e.g., USB-C Charger"
                  required
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
                  Value
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.9375rem',
                      color: '#111827',
                      backgroundColor: '#F9FAFB',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    placeholder="0"
                    min="0"
                    required
                  />
                  <span style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7280',
                    fontSize: '0.875rem',
                    pointerEvents: 'none',
                  }}>
                    $
                  </span>
                </div>
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
                  Image (Optional)
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
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
                    setFormData({ name: '', description: '', value: '', category: 'Electronics', image: '' });
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
