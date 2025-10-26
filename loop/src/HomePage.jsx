import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Clock, MapPin, User,
  ChevronDown, ChevronUp, X, Eye, CheckCircle, Star
} from 'lucide-react';
import ItemAutocomplete from './components/ItemAutocomplete';
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

// Request Card for Loaners (showing requests they can fulfill)
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
            {request.itemName}
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
            {request.requesterName}
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
        }}>
          {request.distance && (
            <span style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
            }}>
              {request.distance.toFixed(1)} mi
            </span>
          )}
          <Star size={14} style={{ color: '#fbbf24' }} />
          <UserRating userId={request.requesterId} fallbackRating={request.requesterRating} />
        </div>
      </div>

      {request.description && (
        <p style={{
          margin: '0.5rem 0',
          fontSize: '0.875rem',
          color: '#4b5563',
          lineHeight: '1.4',
        }}>
          {request.description}
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
          <span>{request.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} />
          <span>{new Date(request.neededFrom).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          Accept Request
        </button>
      </div>
    </div>
  );
};

// My Request Card for Borrowers (showing their own requests)
const MyRequestCard = ({ request, loan, onCancelRequest }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#fbbf24';
      case 'accepted': return '#10b981';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Waiting for acceptance';
      case 'accepted': return 'Request accepted';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

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
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1f2937',
        }}>
          {request.itemName}
        </h3>
        <span style={{
          backgroundColor: getStatusColor(request.status),
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
        }}>
          {getStatusText(request.status)}
        </span>
      </div>

      {request.description && (
        <p style={{
          margin: '0.5rem 0',
          fontSize: '0.875rem',
          color: '#4b5563',
          lineHeight: '1.4',
        }}>
          {request.description}
        </p>
      )}

      {/* Show meetup code if request is accepted */}
      {request.status === 'accepted' && loan && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem',
          }}>
            <CheckCircle size={16} style={{ color: '#10b981' }} />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#0369a1',
            }}>
              Meetup Code: {loan.meetupCode}
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            color: '#0369a1',
          }}>
            Contact {loan.loanerName} to arrange pickup
          </p>
        </div>
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
          <span>{request.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} />
          <span>{new Date(request.neededFrom).toLocaleDateString()}</span>
        </div>
      </div>

      {request.status === 'accepted' && request.acceptedBy && !loan && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '0.75rem',
          padding: '0.75rem',
          fontSize: '0.875rem',
          color: '#0369a1'
        }}>
          <strong>Accepted by:</strong> {request.acceptedBy}
          <br />
          <strong>Status:</strong> Waiting for meetup code...
        </div>
      )}

      {/* Cancel button for pending requests */}
      {request.status === 'pending' && onCancelRequest && (
        <div style={{ marginTop: '0.75rem' }}>
          <button
            onClick={() => {
              console.log('🔄 Cancel button clicked for request:', request.id);
              onCancelRequest(request.id);
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            Cancel Request
          </button>
        </div>
      )}
    </div>
  );
};

const HomePage = ({ 
  user, 
  userData, 
  availableItems, 
  requests, 
  myRequests, 
  myBorrowedItems = [],
  myInventory = [],
  onCreateRequest, 
  onAcceptRequest,
  onCancelRequest,
  getItemSuggestions
}) => {
  const navigate = useNavigate();
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showOnlyMatching, setShowOnlyMatching] = useState(false);
  
  // Safety checks
  console.log('HomePage props:', { myRequests, myBorrowedItems, requests });
  
  // Use empty arrays as defaults instead of showing loading
  const safeMyRequests = myRequests || [];
  const safeMyBorrowedItems = myBorrowedItems || [];
  const safeRequests = requests || [];
  const [requestFormData, setRequestFormData] = useState({
    itemName: '',
    description: '',
    category: 'General',
    location: '',
    neededFrom: '',
    neededUntil: '',
    maxDistance: 5
  });

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!requestFormData.itemName.trim()) {
      // Use in-app notification instead of alert
      return;
    }

    const success = await onCreateRequest(requestFormData);
    if (success) {
      setRequestFormData({
        itemName: '',
        description: '',
        category: 'General',
        location: '',
        neededFrom: '',
        neededUntil: '',
        maxDistance: 5
      });
      setShowRequestForm(false);
    }
  };

  // Helper function to check if a request matches user's inventory
  const requestMatchesInventory = (request) => {
    return myInventory.some(item => 
      item.available && (
        item.name.toLowerCase().includes(request.itemName.toLowerCase()) ||
        request.itemName.toLowerCase().includes(item.name.toLowerCase()) ||
        // Check if the request item name matches any aliases in our item database
        getItemSuggestions(request.itemName).some(suggestion => 
          suggestion.name.toLowerCase() === item.name.toLowerCase()
        )
      )
    );
  };

  const filteredRequests = safeRequests.filter(request => {
    const matchesSearch = request.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.requesterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesInventory = showOnlyMatching ? requestMatchesInventory(request) : true;
    
    return matchesSearch && matchesInventory;
  });

  const filteredMyRequests = safeMyRequests.filter(request => 
    request.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Welcome, {userData?.name || 'User'}!
        </h1>

        {/* Create Request Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setShowRequestForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#9333ea',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={16} />
            Create Request
          </button>
        </div>

        {/* Sub-tabs for requests */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          padding: '0.25rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setShowMyRequests(false)}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: !showMyRequests ? 'white' : 'transparent',
              color: !showMyRequests ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: !showMyRequests ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Available Requests ({safeRequests.length})
          </button>
          <button
            onClick={() => setShowMyRequests(true)}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: showMyRequests ? 'white' : 'transparent',
              color: showMyRequests ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: showMyRequests ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            My Requests ({safeMyRequests.length})
          </button>
        </div>

        {/* Inventory Matching Toggle - only show when viewing available requests */}
        {!showMyRequests && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '0.75rem',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#0369a1',
            }}>
              <input
                type="checkbox"
                checked={showOnlyMatching}
                onChange={(e) => setShowOnlyMatching(e.target.checked)}
                style={{
                  width: '1rem',
                  height: '1rem',
                  accentColor: '#9333ea',
                }}
              />
              Show only requests I can fulfill
            </label>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              backgroundColor: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
            }}>
              {showOnlyMatching ? `${filteredRequests.length} matching` : `${safeRequests.length} total`}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        marginBottom: '1.5rem',
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
          placeholder="Search requests..."
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

      {/* Content */}
      {showMyRequests ? (
        // My Requests (Borrower view)
        <div>
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#0369a1'
          }}>
            <strong>Your Requests:</strong> Track the status of items you've requested to borrow.
          </div>
          
          {filteredMyRequests.length > 0 ? (
            filteredMyRequests.map(request => {
              // Safety check
              if (!request || !request.id) {
                console.error('Invalid request:', request);
                return null;
              }
              
              // Find the corresponding loan for accepted requests
              const correspondingLoan = request.status === 'accepted' 
                ? safeMyBorrowedItems.find(loan => loan && loan.requestId === request.id)
                : null;
              
              return (
                <MyRequestCard 
                  key={request.id} 
                  request={request} 
                  loan={correspondingLoan}
                  onCancelRequest={onCancelRequest}
                />
              );
            }).filter(Boolean) // Remove any null entries
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#6b7280',
            }}>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
                No requests yet
              </p>
              <button
                onClick={() => setShowRequestForm(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Create Your First Request
              </button>
            </div>
          )}
        </div>
      ) : (
        // Available Requests (Loaner view)
        <div>
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#0369a1'
          }}>
            <strong>Matching Requests:</strong> People are looking for items you have! Accept requests to earn points.
          </div>
          
          {filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onAccept={onAcceptRequest}
              />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#6b7280',
            }}>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
                No matching requests found
              </p>
              <p style={{ margin: '0', fontSize: '0.875rem' }}>
                Add items to your inventory to see matching requests!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
              }}>
                Create Request
              </h2>
              <button
                onClick={() => setShowRequestForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  color: '#6b7280',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Item Name *
                </label>
                <ItemAutocomplete
                  value={requestFormData.itemName}
                  onChange={(value) => setRequestFormData({...requestFormData, itemName: value})}
                  placeholder="e.g., iPhone Charger"
                  getItemSuggestions={getItemSuggestions}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Description
                </label>
                <textarea
                  value={requestFormData.description}
                  onChange={(e) => setRequestFormData({...requestFormData, description: e.target.value})}
                  placeholder="Any specific details about what you need..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
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
                  value={requestFormData.category}
                  onChange={(e) => setRequestFormData({...requestFormData, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'white',
                    transition: 'all 0.2s',
                  }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Books">Books</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Tools">Tools</option>
                  <option value="Sports">Sports</option>
                  <option value="Home">Home</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Location
                </label>
                <input
                  type="text"
                  value={requestFormData.location}
                  onChange={(e) => setRequestFormData({...requestFormData, location: e.target.value})}
                  placeholder="Where do you need to meet?"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                  }}>
                    Needed From
                  </label>
                  <input
                    type="datetime-local"
                    value={requestFormData.neededFrom}
                    onChange={(e) => setRequestFormData({...requestFormData, neededFrom: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                  }}>
                    Needed Until
                  </label>
                  <input
                    type="datetime-local"
                    value={requestFormData.neededUntil}
                    onChange={(e) => setRequestFormData({...requestFormData, neededUntil: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Create Request
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