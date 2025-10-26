import React, { useState, useEffect } from "react";
import { Search, Plus, Star, MapPin, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';

// Component to fetch and display current user rating
const UserRating = ({ userId, fallbackRating = null }) => {
  const [currentRating, setCurrentRating] = useState(fallbackRating);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!userId) {
        setCurrentRating(fallbackRating);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCurrentRating(userData.rating || 5.0);
        } else {
          setCurrentRating(fallbackRating);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
        setCurrentRating(fallbackRating);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRating();
  }, [userId, fallbackRating]);

  if (loading) {
    return <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>...</span>;
  }

  return (
    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
      {currentRating ? currentRating.toFixed(1) : 'New'}
    </span>
  );
};

const ItemCard = ({ item, onRequest }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.25rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
    onClick={() => onRequest(item)}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem',
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.25rem',
          }}>
            {item.name}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}>
            <User size={14} />
            {item.ownerName}
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {item.distance && (
            <span style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
            }}>
              {item.distance.toFixed(1)} mi
            </span>
          )}
          <Star size={14} style={{ color: '#fbbf24' }} />
          <UserRating userId={item.ownerId} fallbackRating={item.ownerRating} />
        </div>
      </div>

      {item.description && (
        <p style={{
          margin: '0.5rem 0',
          fontSize: '0.875rem',
          color: '#4b5563',
          lineHeight: '1.4',
        }}>
          {item.description}
        </p>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.75rem',
        fontSize: '0.75rem',
        color: '#6b7280',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <MapPin size={12} />
          <span>{item.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} />
          <span>{item.category}</span>
        </div>
      </div>

      <div style={{
        width: '100%',
        marginTop: '0.75rem',
        padding: '0.625rem 1rem',
        backgroundColor: '#f0f9ff',
        color: '#0369a1',
        border: '1px solid #bae6fd',
        borderRadius: '0.75rem',
        fontWeight: '500',
        fontSize: '0.875rem',
        textAlign: 'center'
      }}>
        Click to Request This Item
      </div>
    </div>
  );
};

const ItemsPage = ({ availableItems, onRequestItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  // Debug logging
  console.log('🔍 ItemsPage rendered with:', {
    availableItemsCount: availableItems.length,
    availableItems: availableItems
  });

  const categories = ['all', 'Electronics', 'Books', 'Tools', 'Clothing', 'Sports', 'General'];

  const filteredItems = availableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.distance || 999) - (b.distance || 999);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'owner':
        return a.ownerName.localeCompare(b.ownerName);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return (
    <div style={{ padding: '1rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{
        marginBottom: '1.5rem',
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 1rem 0',
        }}>
          Browse Items
        </h1>
        <p style={{
          margin: 0,
          fontSize: '1rem',
          color: '#6b7280',
        }}>
          Find items you can borrow from other users
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        marginBottom: '1rem',
      }}>
        <Search size={20} style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
        }} />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 3rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#9333ea'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeFilter === category ? '#9333ea' : 'white',
              color: activeFilter === category ? 'white' : '#6b7280',
              border: `1px solid ${activeFilter === category ? '#9333ea' : '#d1d5db'}`,
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '0.75rem',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
      }}>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
        }}>
          Sort by:
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            outline: 'none',
          }}
        >
          <option value="distance">Distance</option>
          <option value="name">Name</option>
          <option value="owner">Owner</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Description */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '0.75rem',
        padding: '1rem',
        marginBottom: '1rem',
        fontSize: '0.875rem',
        color: '#0369a1'
      }}>
        <strong>How to borrow items:</strong> Browse available items below, then click on any item to create a request. The item owner will be notified and can accept your request!
      </div>

      {/* Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {sortedItems.length > 0 ? (
          sortedItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onRequest={onRequestItem}
            />
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#6b7280',
          }}>
            <p style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
              No items found
            </p>
            <p style={{ margin: '0', fontSize: '0.875rem' }}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1rem',
        border: '1px solid #e5e7eb',
        marginBottom: '1rem',
      }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1f2937',
        }}>
          Available Items
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          <span>Total: {availableItems.length}</span>
          <span>Filtered: {sortedItems.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;