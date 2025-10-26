import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// In a real app, you would use a proper map library like react-leaflet or google-map-react
// This is a simplified version for demonstration
const MapComponent = ({ users, onUserSelect }) => {
  // This is just a placeholder for the map
  return (
    <div style={styles.mapContainer}>
      {/* Map placeholder */}
      <div style={styles.mapPlaceholder}>
        <div style={styles.mapOverlay}>
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => onUserSelect(user)}
              style={{
                ...styles.mapPin,
                left: `${user.position.x}%`,
                top: `${user.position.y}%`,
                backgroundColor: user.hasItem ? '#9333EA' : '#10B981',
              }}
            >
              <MapPin size={20} color="white" fill="currentColor" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, onClose }) => {
  if (!user) return null;
  
  return (
    <div style={styles.userCard}>
      <div style={styles.userCardHeader}>
        <h3 style={styles.userName}>{user.name}</h3>
        <button onClick={onClose} style={styles.closeButton}>
          <X size={20} />
        </button>
      </div>
      <div style={styles.userInfo}>
        <div style={styles.avatar}>
          {user.name.charAt(0)}
        </div>
        <div style={styles.userDetails}>
          <p style={styles.distance}>{user.distance} away</p>
          {user.hasItem ? (
            <p style={styles.itemInfo}>
              <span style={styles.itemLabel}>Has item:</span> {user.itemName}
            </p>
          ) : (
            <p style={styles.lookingFor}>Looking for items to borrow</p>
          )}
          <div style={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                style={{
                  color: i < user.rating ? '#F59E0B' : '#E5E7EB',
                  marginRight: '2px'
                }}
              >
                ★
              </span>
            ))}
            <span style={styles.reviewCount}>({user.reviews} reviews)</span>
          </div>
        </div>
      </div>
      <div style={styles.userActions}>
        <button style={styles.messageButton}>
          Message
        </button>
        <button style={styles.viewProfileButton}>
          View Profile
        </button>
      </div>
    </div>
  );
};

const MapPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      distance: '0.3 miles',
      rating: 4,
      reviews: 12,
      hasItem: true,
      itemName: 'USB-C Charger',
      position: { x: 30, y: 40 }
    },
    {
      id: 2,
      name: 'Taylor Smith',
      distance: '0.5 miles',
      rating: 5,
      reviews: 8,
      hasItem: false,
      position: { x: 60, y: 30 }
    },
    {
      id: 3,
      name: 'Jordan Lee',
      distance: '0.8 miles',
      rating: 4,
      reviews: 5,
      hasItem: true,
      itemName: 'Textbook: Chemistry 101',
      position: { x: 40, y: 60 }
    },
    {
      id: 4,
      name: 'Mike T.',
      distance: '1.2 miles',
      rating: 3,
      reviews: 3,
      hasItem: true,
      itemName: 'Basketball',
      position: { x: 70, y: 50 }
    },
  ]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleCloseUserCard = () => {
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.hasItem && user.itemName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <div style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search people or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <X size={18} color="#9CA3AF" />
            </button>
          )}
        </div>
        <button style={styles.filterButton}>
          <Filter size={20} color="#4B5563" />
        </button>
      </div>

      <MapComponent 
        users={filteredUsers} 
        onUserSelect={handleUserSelect} 
      />

      <UserCard 
        user={selectedUser} 
        onClose={handleCloseUserCard} 
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 2.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F3F4F6',
    fontSize: '0.9375rem',
    outline: 'none',
  },
  clearButton: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    backgroundColor: '#E5E7EB',
  },
  mapPlaceholder: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(135deg, #E5E7EB 25%, #F3F4F6 25%, #F3F4F6 50%, #E5E7EB 50%, #E5E7EB 75%, #F3F4F6 75%, #F3F4F6 100%)',
    backgroundSize: '40px 40px',
    overflow: 'hidden',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPin: {
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  userCard: {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 20,
    transform: selected => selected ? 'translateY(0)' : 'translateY(calc(100% + 1rem))',
    transition: 'transform 0.3s ease-in-out',
  },
  userCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  userName: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    color: '#6B7280',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  avatar: {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    backgroundColor: '#9333EA',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginRight: '1rem',
  },
  userDetails: {
    flex: 1,
  },
  distance: {
    margin: '0 0 0.25rem',
    fontSize: '0.875rem',
    color: '#6B7280',
  },
  itemInfo: {
    margin: '0 0 0.25rem',
    fontSize: '0.9375rem',
    color: '#111827',
    fontWeight: '500',
  },
  itemLabel: {
    color: '#6B7280',
    fontWeight: '400',
  },
  lookingFor: {
    margin: '0 0 0.25rem',
    fontSize: '0.9375rem',
    color: '#111827',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
  },
  reviewCount: {
    marginLeft: '0.5rem',
    fontSize: '0.75rem',
    color: '#6B7280',
  },
  userActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  messageButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#F3F4F6',
    color: '#111827',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '0.9375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  viewProfileButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#9333EA',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '0.9375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default MapPage;
