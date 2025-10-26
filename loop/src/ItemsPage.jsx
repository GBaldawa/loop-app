import React, { useState } from 'react';
import { Search, Filter, Sliders, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item, onBorrow }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      opacity: item.available ? 1 : 0.7,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {!item.available && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          zIndex: 1
        }}>
          Borrowed
        </div>
      )}
      
      <div style={{
        height: '140px',
        backgroundColor: item.available ? '#f3e8ff' : '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: item.available ? '#9333ea' : '#9ca3af',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            {item.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        flex: '1'
      }}>
        <div style={{ flex: '1' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0 0 0.25rem',
            color: '#1f2937',
            lineHeight: '1.4',
            minHeight: '2.8em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{item.name}</h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#4b5563',
              fontWeight: '500'
            }}>
              {item.category}
            </span>
          </div>
          
          {item.description && (
            <p style={{
              fontSize: '0.8125rem',
              color: '#6b7280',
              margin: '0 0 0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {item.description}
            </p>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: item.available ? '#10b981' : '#ef4444'
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: item.available ? '#10b981' : '#ef4444',
              fontWeight: '500'
            }}>
              {item.available ? 'Available' : 'Borrowed'}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Earns
            </span>
            <span style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#9333ea',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {item.points}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#9333ea',
                opacity: 0.8
              }}>
                pts
              </span>
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => onBorrow(item)}
          disabled={!item.available}
          style={{
            width: '100%',
            marginTop: '0.75rem',
            padding: '0.625rem 1rem',
            backgroundColor: item.available ? '#9333ea' : '#e5e7eb',
            color: item.available ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: '600',
            fontSize: '0.9375rem',
            cursor: item.available ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: item.available ? '#7e22ce' : '#e5e7eb'
            },
            '&:active': {
              transform: item.available ? 'scale(0.98)' : 'none'
            }
          }}
        >
          {item.available ? 'Borrow Item' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

const ItemsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample items data with points instead of price
  const [items, setItems] = useState([
    { 
      id: 1, 
      name: 'USB-C Laptop Charger', 
      description: '65W fast charging, compatible with most modern laptops',
      category: 'Electronics', 
      available: true,
      points: 5,
      owner: 'Alex J.',
      location: 'Main Library'
    },
    { 
      id: 2, 
      name: 'Textbook: Chemistry 101', 
      description: '5th Edition, like new condition',
      category: 'Books', 
      available: false, 
      points: 8,
      owner: 'Taylor S.',
      location: 'Science Building'
    },
    { 
      id: 3, 
      name: 'DSLR Camera Lens', 
      description: '50mm f/1.8, perfect for portraits',
      category: 'Photography', 
      available: true, 
      points: 12,
      owner: 'Jordan L.',
      location: 'Art Department'
    },
    { 
      id: 4, 
      name: 'Basketball', 
      description: 'Official size 7, good condition',
      category: 'Sports', 
      available: true, 
      points: 3,
      owner: 'Mike T.',
      location: 'Gym'
    },
    { 
      id: 5, 
      name: 'Camping Tent', 
      description: '4-person tent, includes rainfly and stakes',
      category: 'Outdoor', 
      available: true, 
      points: 15,
      owner: 'Chris P.',
      location: 'Student Center'
    },
    { 
      id: 6, 
      name: 'Graphing Calculator', 
      description: 'TI-84 Plus, with cover',
      category: 'School Supplies', 
      available: true, 
      points: 6,
      owner: 'Sam R.',
      location: 'Math Building'
    },
  ]);

  const categories = ['All', ...new Set(items.map(item => item.category))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleBorrow = (item) => {
    // In a real app, this would open a modal or navigate to a borrow form
    alert(`Borrowing ${item.name} for ${item.points} points. This is just a demo.`);
    
    // In a real app, you would update the item's availability in the database
    // For now, we'll just update the local state
    setItems(items.map(i => 
      i.id === item.id ? { ...i, available: false } : i
    ));
  };

  return (
    <div style={{ 
      padding: '1rem', 
      paddingBottom: '5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: 0
        }}>Available Items</h1>
        
        <Link to="/add-item" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#9333ea',
          color: 'white',
          padding: '0.625rem 1.25rem',
          borderRadius: '0.75rem',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 2px 4px rgba(147, 51, 234, 0.2)',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: '#7e22ce',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        }}>
          <Plus size={18} />
          Add Item
        </Link>
      </div>
      
      {/* Search and Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '0.5rem 1rem',
          marginBottom: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb'
        }}>
          <Search size={20} color="#6b7280" style={{ marginRight: '0.75rem' }} />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: '0.9375rem',
              padding: '0.5rem 0',
              '&::placeholder': {
                color: '#9ca3af'
              }
            }}
          />
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: '#f3f4f6'
            }
          }}>
            <Sliders size={20} color="#6b7280" />
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category === 'All' ? 'all' : category)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeFilter === (category === 'All' ? 'all' : category) ? '#9333ea' : '#f3f4f6',
                color: activeFilter === (category === 'All' ? 'all' : category) ? 'white' : '#4b5563',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: activeFilter === (category === 'All' ? 'all' : category) ? '#7e22ce' : '#e5e7eb'
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
          width: '100%'
        }}>
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onBorrow={handleBorrow}
            />
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem 1rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginTop: '1rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#f3e8ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Search size={32} color="#9333ea" />
          </div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            No items found
          </h3>
          <p style={{
            color: '#6b7280',
            margin: '0 auto',
            maxWidth: '320px',
            lineHeight: '1.5'
          }}>
            {searchQuery 
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'There are currently no items available in this category.'}
          </p>
          
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              style={{
                marginTop: '1.25rem',
                padding: '0.5rem 1.25rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#e5e7eb'
                }
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
      
      {/* Floating Action Button for Mobile */}
      <Link to="/add-item" style={{
        position: 'fixed',
        bottom: '5.5rem',
        right: '1rem',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#9333ea',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
        textDecoration: 'none',
        zIndex: 100,
        '@media (min-width: 640px)': {
          display: 'none'
        }
      }}>
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default ItemsPage;
