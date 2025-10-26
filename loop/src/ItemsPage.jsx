import React, { useState } from 'react';
import { Search } from 'lucide-react';
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
            color: '#1f2937'
          }}>{item.name}</h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 0.75rem'
          }}>{item.description}</p>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f3f4f6'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: item.available ? '#10b981' : '#ef4444'
          }}>
            {item.available ? 'Available' : 'Borrowed'}
          </span>
          <span style={{
            fontSize: '0.875rem',
            color: '#9333ea',
            fontWeight: '600'
          }}>
            {item.points} pts
          </span>
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
            cursor: item.available ? 'pointer' : 'not-allowed'
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

  const [items, setItems] = useState([
    { id: 1, name: 'USB-C Laptop Charger', description: '65W fast charging', category: 'Electronics', available: true, points: 5 },
    { id: 2, name: 'Textbook: Chemistry 101', description: '5th Edition', category: 'Books', available: false, points: 8 },
    { id: 3, name: 'DSLR Camera Lens', description: '50mm f/1.8 lens', category: 'Photography', available: true, points: 12 },
  ]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleBorrow = (item) => {
    alert(`Borrowing ${item.name} for ${item.points} points`);
    setItems(items.map(i => i.id === item.id ? { ...i, available: false } : i));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '1.75rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1.5rem'
      }}>
        Available Items
      </h1>

      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '0.5rem 1rem',
        marginBottom: '1.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <Search size={20} color="#6b7280" style={{ marginRight: '0.75rem' }} />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: '0.9375rem'
          }}
        />
      </div>

      {/* Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}>
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} onBorrow={handleBorrow} />
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
