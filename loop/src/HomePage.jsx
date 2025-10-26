import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Clock, MapPin, User, MessageCircle,
  ChevronDown, ChevronUp, X
} from 'lucide-react';

const RequestCard = ({ request, onAccept, isMyRequest = false }) => {
  const navigate = useNavigate();

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
        marginBottom: '0.5rem',
        gap: '0.75rem',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '0.25rem',
          }}>
            {request.item}
          </h3>
          {request.requestedBy && (
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              {request.isMine ? (
                <span>You requested • {request.status === 'fulfilled' ? `Fulfilled by ${request.fulfilledBy}` : 'Pending'}</span>
              ) : (
                <span>By {request.requestedBy} • {request.status === 'in-progress' ? `Accepted by ${request.acceptedBy}` : 'Not accepted yet'}</span>
              )}
            </p>
          )}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}>
            {request.category}
          </span>
        </div>
      </div>

      <p style={{
        margin: '0.5rem 0',
        color: '#6b7280',
        fontSize: '0.9375rem',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
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

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate(`/chat/${request.id}`)}
            style={{
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
            }}
          >
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    item: '',
    description: '',
    location: '',
    neededUntil: '',
  });

  const [requests, setRequests] = useState([
    { id: 1, item: 'USB-C Charger', description: 'Need a USB-C charger for my laptop. Will return it tomorrow!', category: 'Electronics', requestedBy: 'Alex Johnson', location: 'Main Library', neededUntil: 'Tomorrow, 6 PM', status: 'pending', points: 5, isMine: false },
    { id: 2, item: 'Textbook: Chemistry 101', description: 'Looking to borrow for the semester. Can exchange for other textbooks.', category: 'Books', requestedBy: 'Taylor Smith', location: 'Science Building', neededUntil: 'Next Monday', status: 'pending', points: 10, isMine: false },
    { id: 3, item: 'Camera Tripod', description: 'Need for a photography project this weekend.', category: 'Photography', requestedBy: 'Jordan Lee', location: 'Art Department', neededUntil: 'Sunday', status: 'in-progress', points: 8, acceptedBy: 'You', isMine: false },
  ]);

  const handleAcceptRequest = (requestId) => {
    setRequests(requests.map(request =>
      request.id === requestId
        ? { ...request, status: 'in-progress', acceptedBy: 'You' }
        : request
    ));
  };

  const handleCreateRequest = () => {
    setIsModalOpen(true);
  };

  const handleSubmitNewRequest = (e) => {
    e.preventDefault();
    const newId = requests.length + 1;
    const requestToAdd = {
      id: newId,
      item: newRequest.item,
      description: newRequest.description,
      category: 'General',
      requestedBy: 'You',
      location: newRequest.location,
      neededUntil: newRequest.neededUntil,
      status: 'pending',
      points: 5,
      isMine: true,
    };
    setRequests([...requests, requestToAdd]);
    setNewRequest({ item: '', description: '', location: '', neededUntil: '' });
    setIsModalOpen(false);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || request.status === activeFilter;
    const matchesMyRequests = !showMyRequests || request.isMine;
    return matchesSearch && matchesFilter && matchesMyRequests;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
      {/* Header */}
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
          {showMyRequests ? 'My Requests' : 'Help Someone Out'}
        </h1>

        <button
          onClick={() => setShowMyRequests(!showMyRequests)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            color: '#4b5563',
            fontWeight: '500',
            fontSize: '0.875rem',
          }}
        >
          {showMyRequests ? (
            <>
              <ChevronUp size={16} />
              Hide My Requests
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              View My Requests
            </>
          )}
        </button>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1rem',
      }}>
        <Search size={20} color="#6b7280" />
        <input
          type="text"
          placeholder={showMyRequests ? 'Search your requests...' : 'Search requests...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: '1rem',
            backgroundColor: 'transparent',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        )}
      </div>

      {/* Requests */}
      <div>
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={handleAcceptRequest}
              isMyRequest={showMyRequests}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No requests found.</p>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleCreateRequest}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#9333ea',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(147, 51, 234, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <Plus size={24} />
      </button>

      {/* Create Request Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Create New Request</h2>
            <form onSubmit={handleSubmitNewRequest} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Item name"
                value={newRequest.item}
                onChange={(e) => setNewRequest({ ...newRequest, item: e.target.value })}
                required
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <textarea
                placeholder="Description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                required
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', minHeight: '80px' }}
              />
              <input
                type="text"
                placeholder="Location"
                value={newRequest.location}
                onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                required
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <input
                type="text"
                placeholder="Needed until (e.g., Friday 5 PM)"
                value={newRequest.neededUntil}
                onChange={(e) => setNewRequest({ ...newRequest, neededUntil: e.target.value })}
                required
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                  }}
                >
                  Add Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
