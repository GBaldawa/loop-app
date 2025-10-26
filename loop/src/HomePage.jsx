import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Clock, MapPin, User, MessageCircle } from 'lucide-react';

const RequestCard = ({ request, onAccept }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.25rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0
        }}>
          {request.item}
        </h3>
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
          backgroundColor: request.status === 'pending' ? '#fef3c7' : '#d1fae5',
          color: request.status === 'pending' ? '#92400e' : '#065f46'
        }}>
          {request.status === 'pending' ? 'Pending' : 'In Progress'}
        </span>
      </div>
      
      <p style={{
        fontSize: '0.9375rem',
        color: '#4b5563',
        margin: '0 0 1rem'
      }}>
        {request.description}
      </p>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <Clock size={16} />
        <span>Needed until: {request.neededUntil}</span>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <MapPin size={16} />
        <span>{request.location}</span>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.75rem',
        borderTop: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={16} color="#9333ea" />
          </div>
          <span style={{
            fontSize: '0.875rem',
            color: '#4b5563'
          }}>
            {request.requestedBy}
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#9333ea',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <MessageCircle size={16} />
            Chat
          </button>
          <button 
            onClick={() => onAccept(request.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              color: '#9333ea',
              border: '2px solid #9333ea',
              borderRadius: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {request.status === 'pending' ? 'Accept' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample requests data
  const [requests, setRequests] = useState([
    {
      id: 1,
      item: 'USB-C Charger',
      description: 'Need a USB-C charger for my laptop. Will return it tomorrow evening.',
      category: 'Electronics',
      requestedBy: 'Alex Johnson',
      location: 'Main Library',
      neededUntil: 'Tomorrow, 6 PM',
      status: 'pending',
      points: 5
    },
    {
      id: 2,
      item: 'Textbook: Chemistry 101',
      description: 'Looking for the Chemistry 101 textbook for a week. Will take good care of it!',
      category: 'Books',
      requestedBy: 'Taylor Smith',
      location: 'Science Building',
      neededUntil: 'Next Monday',
      status: 'pending',
      points: 10
    },
    {
      id: 3,
      item: 'Camera Tripod',
      description: 'Need a tripod for a photography project this weekend.',
      category: 'Photography',
      requestedBy: 'Jordan Lee',
      location: 'Art Department',
      neededUntil: 'Sunday',
      status: 'in-progress',
      points: 8
    }
  ]);

  const handleAcceptRequest = (requestId) => {
    // In a real app, this would update the request status in the database
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'in-progress' } : req
    ));
    alert('Request accepted! You can now coordinate with the requester.');
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || request.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
      <h1 style={{
        fontSize: '1.75rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#1f2937'
      }}>Help Someone Out</h1>
      
      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Search size={20} color="#6b7280" style={{ marginRight: '0.75rem' }} />
        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: '1rem',
            backgroundColor: 'transparent'
          }}
        />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {['all', 'pending', 'in-progress'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeFilter === filter ? '#9333ea' : '#e5e7eb',
              color: activeFilter === filter ? 'white' : '#4b5563',
              fontWeight: '500',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: activeFilter === filter ? '#7e22ce' : '#d1d5db'
              }
            }}
          >
            {filter === 'all' ? 'All Requests' : 
             filter === 'pending' ? 'Pending' : 'In Progress'}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div>
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <RequestCard 
              key={request.id} 
              request={request} 
              onAccept={handleAcceptRequest}
            />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#f3e8ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Search size={32} color="#9333ea" />
            </div>
            <p style={{ 
              fontSize: '1rem', 
              fontWeight: '500', 
              color: '#4b5563', 
              marginBottom: '0.5rem' 
            }}>
              No requests found
            </p>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#9ca3af',
              margin: 0
            }}>
              {searchQuery ? 'Try a different search term' : 'Check back later for new requests'}
            </p>
          </div>
        )}
      </div>

      {/* Add Request Button */}
      <Link to="/add-request" style={{
        position: 'fixed',
        bottom: '5.5rem',
        left: '1rem',
        backgroundColor: '#9333ea',
        color: 'white',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
        textDecoration: 'none',
        zIndex: 100
      }}>
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default HomePage;
