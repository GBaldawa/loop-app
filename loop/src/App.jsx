import React, { useState, useEffect } from 'react';
import './App.css';

import { MapPin, Home, Bell, User, Plus, Search, Star, Clock, Check, X, CheckCircle, XCircle, MessageCircle, Edit, Trash2 } from 'lucide-react';
import MapboxMap from './components/MapboxMap';
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};
const LoopApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [notifications, setNotifications] = useState(3);
  const [userCredits, setUserCredits] = useState(47);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loaningFilter, setLoaningFilter] = useState('active');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  
  const [currentUser, setCurrentUser] = useState({
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex@university.edu',
    phone: '(555) 123-4567',
    rating: 4.9,
    totalRatings: 23,
    availableItems: ['USB-C to USB-C Charger', 'Textbook - Chemistry 201']
  });

  const [requests, setRequests] = useState([
    { id: 1, item: 'USB-C to USB-C Charger', user: 'Sarah M.', userId: 'user_2', location: 'Thompson Hall', time: '2-4 pm', distance: 0.3, rating: 4.8, status: 'active', category: 'matches' },
    { id: 2, item: 'iPhone Charger', user: 'Mike T.', userId: 'user_3', location: 'Student Center', time: '3-6 pm', distance: 0.5, rating: 4.9, status: 'active', category: 'matches' },
    { id: 3, item: 'Laptop Charger (HP)', user: 'Emma K.', userId: 'user_4', location: 'Library', time: '1-3 pm', distance: 0.2, rating: 5.0, status: 'active', category: 'matches' },
    { id: 4, item: 'Textbook - Biology 101', user: 'John D.', userId: 'user_5', location: 'Science Building', time: '10-12 pm', distance: 0.4, rating: 4.7, status: 'active', category: 'books' }
  ]);

  const [myRequests, setMyRequests] = useState([]);
  const [loanings, setLoanings] = useState([]);
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, type: 'new_request', title: 'New request nearby!', message: 'Someone needs a charger at Thompson Hall', time: '2 minutes ago', read: false },
    { id: 2, type: 'accepted', title: 'Request accepted!', message: 'Sarah M. will lend you a charger', time: '10 minutes ago', read: false },
    { id: 3, type: 'credits', title: 'You earned 5 credits!', message: 'Thanks for helping Mike T.', time: '1 hour ago', read: false }
  ]);

  const [formData, setFormData] = useState({
    item: '',
    location: '',
    time: '',
    details: ''
  });

  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    card: '',
    locationServices: true
  });

  const generateMeetupCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAcceptRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const meetupCode = generateMeetupCode();
    
    const newLoaning = {
      id: Date.now(),
      item: request.item,
      borrower: request.user,
      borrowerId: request.userId,
      pickupLocation: request.location,
      time: request.time,
      status: 'accepted',
      pickedUp: false,
      returned: false,
      meetupCode: meetupCode
    };
    setLoanings([...loanings, newLoaning]);
    setRequests(requests.filter(r => r.id !== requestId));
    setCurrentPage('loaning');
  };

  const handleCreateRequest = () => {
    if (!formData.item || !formData.location || !formData.time) {
      return;
    }
  
    const newRequest = {
      id: Date.now(),
      item: formData.item,
      user: currentUser.name,
      userId: currentUser.id,
      location: formData.location,
      time: formData.time,
      distance: 0,
      rating: currentUser.rating,
      status: 'active',  // make it active so it appears
      category: 'other',
      details: formData.details
    };
  
    // Add to requests and myRequests
    setRequests([newRequest, ...requests]);
    setMyRequests([newRequest, ...myRequests]);
  
    // Clear form
    setFormData({
      item: '',
      location: '',
      time: '',
      details: ''
    });
  
    // Go back to Requests page
    setCurrentPage('requests');
  };
  

  const handleConfirmPickup = (loaningId) => {
    setLoanings(loanings.map(l => 
      l.id === loaningId ? { ...l, pickedUp: true } : l
    ));
  };

  const handleConfirmReturn = (loaningId) => {
    const loaning = loanings.find(l => l.id === loaningId);
    if (!loaning) return;

    setLoanings(loanings.map(l => 
      l.id === loaningId ? { ...l, returned: true, status: 'completed' } : l
    ));

    const creditsEarned = 5;
    setUserCredits(userCredits + creditsEarned);

    const newNotification = {
      id: Date.now(),
      type: 'credits',
      title: `You earned ${creditsEarned} credits!`,
      message: `Thanks for helping ${loaning.borrower}`,
      time: 'Just now',
      read: false
    };
    setNotificationsList([newNotification, ...notificationsList]);
    setNotifications(notifications + 1);
  };

  const handleCancelLoaning = (loaningId) => {
    if (window.confirm('Are you sure you want to cancel this loaning?')) {
      setLoanings(loanings.filter(l => l.id !== loaningId));
    }
  };

  const handleSaveProfile = () => {
    if (!profileData.name || !profileData.email || !profileData.phone) {
      return;
    }
    setCurrentUser({
      ...currentUser,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone
    });
    setCurrentPage('profile');
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    setCurrentUser({
      ...currentUser,
      availableItems: [...currentUser.availableItems, newItemName]
    });
    setNewItemName('');
    setShowAddItemModal(false);
  };

  const handleEditItem = (index) => {
    setEditingItemIndex(index);
    setNewItemName(currentUser.availableItems[index]);
    setShowEditItemModal(true);
  };

  const handleSaveEditItem = () => {
    if (!newItemName.trim()) return;
    const updatedItems = [...currentUser.availableItems];
    updatedItems[editingItemIndex] = newItemName;
    setCurrentUser({
      ...currentUser,
      availableItems: updatedItems
    });
    setNewItemName('');
    setShowEditItemModal(false);
    setEditingItemIndex(null);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = currentUser.availableItems.filter((_, i) => i !== index);
      setCurrentUser({
        ...currentUser,
        availableItems: updatedItems
      });
    }
  };

  const getFilteredRequests = () => {
    let filtered = requests.filter(r => r.status === 'active');

    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter === 'matches') {
      filtered = filtered.filter(r => r.category === 'matches');
    } else if (activeFilter === 'near') {
      filtered = filtered.filter(r => r.distance <= 0.3);
    }

    return filtered;
  };

  const getFilteredLoanings = () => {
    let filtered = loanings;

    if (loaningFilter === 'active') {
      filtered = filtered.filter(l => l.status !== 'completed');
    } else if (loaningFilter === 'finished') {
      filtered = filtered.filter(l => l.status === 'completed');
    }

    return filtered;
  };

  useEffect(() => {
    if (currentPage === 'notifications') {
      setNotifications(0);
    }
  }, [currentPage]);

  const Navigation = () => (
    <div className="navigation">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button onClick={() => setCurrentPage('requests')} className={`nav-button ${currentPage === 'requests' ? 'active' : 'inactive'}`}>
          <Home className="nav-icon w-6 h-6" />
          <span className="nav-label text-xs">Requests</span>
        </button>
        <button onClick={() => setCurrentPage('map')} className={`nav-button ${currentPage === 'map' ? 'active' : 'inactive'}`}>
          <MapPin className="nav-icon w-6 h-6" />
          <span className="nav-label text-xs">Map</span>
        </button>
        <button onClick={() => setCurrentPage('loaning')} className={`nav-button ${currentPage === 'loaning' ? 'active' : 'inactive'}`}>
          <Plus className="nav-icon w-6 h-6" />
          <span className="nav-label text-xs">Loaning</span>
        </button>
        <button onClick={() => setCurrentPage('notifications')} className={`nav-button ${currentPage === 'notifications' ? 'active' : 'inactive'} relative`}>
          <Bell className="nav-icon w-6 h-6" />
          {notifications > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notifications}</span>
          )}
          <span className="nav-label text-xs">Alerts</span>
        </button>
        <button onClick={() => setCurrentPage('profile')} className={`nav-button ${currentPage === 'profile' ? 'active' : 'inactive'}`}>
          <User className="nav-icon w-6 h-6" />
          <span className="nav-label text-xs">Profile</span>
        </button>
      </div>
    </div>
  );

  const RequestsPage = () => {
    const filteredRequests = getFilteredRequests();

    return (
      <div className="page-content">
        <div className="flex items-center justify-between section-header">
          <h1>Nearby Requests</h1>
          <div className="credits-badge">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-800">{userCredits} credits</span>
          </div>
        </div>

        <div className="relative section-content">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2 section-content overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`filter-pill ${activeFilter === 'all' ? 'active' : 'inactive'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('matches')}
            className={`filter-pill ${activeFilter === 'matches' ? 'active' : 'inactive'}`}
          >
            My Matches
          </button>
          <button 
            onClick={() => setActiveFilter('near')}
            className={`filter-pill ${activeFilter === 'near' ? 'active' : 'inactive'}`}
          >
            Near me
          </button>
        </div>

        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Search className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-gray-600 font-medium">No requests found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="mb-1">{request.item}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{request.user}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                        <span>{request.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{request.location}</span>
                      <span className="text-gray-400">• {request.distance} mi</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{request.time}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <button 
                  onClick={() => handleAcceptRequest(request.id)}
                  className="btn-primary"
                >
                  Accept & Help Out
                </button>
              </div>
            ))
          )}
        </div>

        {myRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Active Requests</h2>
          {myRequests.map(request => (
            <div key={request.id} className="bg-green-100 border border-green-300 rounded-2xl p-4">
              {/* Status Indicator */}
              {request.status === 'accepted' ? (
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Request Accepted!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <span className="font-medium">Pending Acceptance</span>
                </div>
              )}

              {/* Request Info */}
              <h3 className="font-semibold text-gray-800 mb-2">{request.item}</h3>
              <p className="text-sm text-gray-600 mb-1">Lender: {request.lender || 'TBD'}</p>
              <p className="text-sm text-gray-600 mb-1">Location: {request.location}</p>
              <p className="text-sm text-gray-600 mb-3">Time: {request.time}</p>

              {/* Meetup Code */}
              {request.status === 'accepted' && request.meetupCode && (
                <div className="bg-white rounded-xl p-3 border border-green-300">
                  <p className="text-xs text-gray-600 mb-1">Meetup Code:</p>
                  <p className="text-2xl font-bold text-center text-gray-800">{request.meetupCode}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}


        <button
          onClick={() => setCurrentPage('createRequest')}
          className="fab"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    );
  };

  const LoaningPage = () => {
    const filteredLoanings = getFilteredLoanings();

    return (
      <div className="page-content">
        <h1 className="section-header">My Loanings</h1>

        <div className="flex gap-2 section-content">
          <button 
            onClick={() => setLoaningFilter('active')}
            className={`filter-pill ${loaningFilter === 'active' ? 'active' : 'inactive'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setLoaningFilter('finished')}
            className={`filter-pill ${loaningFilter === 'finished' ? 'active' : 'inactive'}`}
          >
            Finished
          </button>
        </div>

        <div className="space-y-3">
          {filteredLoanings.map(loan => (
            <div key={loan.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3>{loan.item}</h3>
                <span className={`status-badge ${loan.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                  {loan.status === 'completed' ? 'Completed' : loan.pickedUp ? 'Item Out' : 'Pending Pickup'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Borrower: {loan.borrower}</p>
                <p className="text-sm text-gray-600">Location: {loan.pickupLocation}</p>
                <p className="text-sm text-gray-600">Time: {loan.time}</p>
              </div>
              <div className="meetup-code mb-3">
                <p className="meetup-code-label">Your Meetup Code:</p>
                <p className="meetup-code-value">{loan.meetupCode}</p>
              </div>
              
              {loan.status !== 'completed' && (
                <div className="space-y-2">
                  {!loan.pickedUp && (
                    <button 
                      onClick={() => handleConfirmPickup(loan.id)}
                      className="btn-primary btn-success"
                    >
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Confirm Pickup
                    </button>
                  )}
                  {loan.pickedUp && !loan.returned && (
                    <button 
                      onClick={() => handleConfirmReturn(loan.id)}
                      className="btn-primary"
                    >
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Confirm Return
                    </button>
                  )}
                  <button 
                    onClick={() => handleCancelLoaning(loan.id)}
                    className="btn-secondary btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredLoanings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <MessageCircle className="w-10 h-10 text-purple-400" />
            </div>
            <p className="text-gray-600 font-medium">No {loaningFilter} loanings</p>
            <p className="text-sm text-gray-400 mt-1">Help someone out to earn credits!</p>
          </div>
        )}
      </div>
    );
  };

  const MapPage = () => {
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
    const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12';

    if (!MAPBOX_TOKEN) {
      return (
        <div className="p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700 font-medium">Mapbox token missing</p>
            <p className="text-sm text-yellow-700">Set <code>VITE_MAPBOX_TOKEN</code> in <code>.env.local</code> and restart the dev server.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-gray-100 relative">
        <MapboxMap token={MAPBOX_TOKEN} style={MAPBOX_STYLE} center={[-74.5, 40]} zoom={9} />

        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search items or location..."
              className="flex-1 outline-none text-sm border-none"
            />
          </div>
        </div>

        <div className="absolute bottom-24 left-4 right-4 space-y-2">
          {requests.slice(0, 2).map(req => (
            <div key={req.id} className="card flex items-center justify-between">
              <div className="flex-1">
                <h3>{req.item}</h3>
                <p className="text-sm text-gray-500">{req.user} • {req.distance} mi</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-purple-400 mr-1" />
                  {req.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProfilePage = () => (
    <div className="page-content">
      <div className="flex flex-col items-center section-content">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-3">
          <User className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="mb-1">{currentUser.name}</h1>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-5 h-5 fill-purple-400 text-purple-400" />
          <span className="text-lg font-medium">{currentUser.rating}</span>
          <span className="text-gray-500 text-sm">({currentUser.totalRatings} ratings)</span>
        </div>
        <div className="credits-badge">
          <Star className="w-5 h-5 text-purple-600" />
          <span className="text-lg font-semibold text-gray-800">{userCredits} Loop Credits</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="card">
          <h3 className="mb-3">Available Items</h3>
          <div className="space-y-2">
            {currentUser.availableItems.map((item, idx) => (
              <div key={idx} className="item-list-item">
                <span className="text-gray-700 flex-1">{item}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditItem(idx)}
                    className="text-purple-600 text-sm p-2 hover:bg-purple-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(idx)}
                    className="text-red-600 text-sm p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAddItemModal(true)}
            className="w-full mt-3 py-2 text-purple-600 font-medium rounded-xl border-2 border-dashed border-purple-300 hover:bg-purple-50"
          >
            + Add Item
          </button>
        </div>

        <div className="card">
          <h3 className="mb-3">Settings</h3>
          <button onClick={() => setCurrentPage('settings')} className="w-full text-left px-3 py-3 hover:bg-purple-50 rounded-xl text-gray-700">
            Edit Profile
          </button>
          <button className="w-full text-left px-3 py-3 hover:bg-purple-50 rounded-xl text-gray-700">
            Notifications
          </button>
          <button className="w-full text-left px-3 py-3 hover:bg-purple-50 rounded-xl text-gray-700">
            Location Preferences
          </button>
        </div>
      </div>

      <Modal 
        isOpen={showAddItemModal} 
        onClose={() => {
          setShowAddItemModal(false);
          setNewItemName('');
        }}
        title="Add New Item"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
          <input
            type="text"
            placeholder="e.g., MacBook Charger"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="modal-buttons">
          <button 
            onClick={() => {
              setShowAddItemModal(false);
              setNewItemName('');
            }}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddItem}
            className="btn-primary flex-1"
          >
            Add Item
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={showEditItemModal} 
        onClose={() => {
          setShowEditItemModal(false);
          setNewItemName('');
          setEditingItemIndex(null);
        }}
        title="Edit Item"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
          <input
            type="text"
            placeholder="e.g., MacBook Charger"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="modal-buttons">
          <button 
            onClick={() => {
              setShowEditItemModal(false);
              setNewItemName('');
              setEditingItemIndex(null);
            }}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveEditItem}
            className="btn-primary flex-1"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );

  const SettingsPage = () => (
    <div className="page-content">
      <button onClick={() => setCurrentPage('profile')} className="mb-6 text-purple-600 flex items-center gap-2">
        ← Back
      </button>
      <h1 className="section-header">Settings</h1>

      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card (for damage deposits)</label>
              <input
                type="text"
                placeholder="•••• •••• •••• 1234"
                value={profileData.card}
                onChange={(e) => setProfileData({ ...profileData, card: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Enable location services</span>
            <input 
              type="checkbox" 
              checked={profileData.locationServices}
              onChange={(e) => setProfileData({ ...profileData, locationServices: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded" 
            />
          </label>
        </div>

        <button 
          onClick={handleSaveProfile}
          className="btn-primary"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const NotificationsPage = () => (
    <div className="page-content">
      <h1 className="section-header">Notifications</h1>

      <div className="space-y-3">
        {notificationsList.map((notif) => (
          <div 
            key={notif.id} 
            className={`card ${notif.type === 'new_request' ? 'bg-purple-50' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notif.type === 'new_request' ? 'bg-purple-600' : 
                notif.type === 'accepted' ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {notif.type === 'new_request' && <Bell className="w-5 h-5 text-white" />}
                {notif.type === 'accepted' && <Check className="w-5 h-5 text-green-600" />}
                {notif.type === 'credits' && <Star className="w-5 h-5 text-purple-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-1">{notif.title}</p>
                <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                <p className="text-xs text-gray-500">{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CreateRequestPage = () => (
    <div className="page-content">
      <button onClick={() => setCurrentPage('requests')} className="mb-6 text-purple-600 flex items-center gap-2">
        ← Back
      </button>
      <h1 className="section-header">Create a Request</h1>
  
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you need?</label>
          <input
            type="text"
            placeholder="e.g., iPhone Charger"
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            className="input-field"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
          <input
            type="text"
            placeholder="e.g., Thompson Hall"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="input-field"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Window</label>
          <input
            type="text"
            placeholder="e.g., 2-4 pm"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="input-field"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details (optional)</label>
          <textarea
            placeholder="Any specific details or requirements..."
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="input-field"
          />
        </div>
  
        <button 
          onClick={handleCreateRequest}
          className="btn-primary"
        >
          Post Request
        </button>
      </div>
    </div>
  );
  

  const LoginPage = () => (
    <div className="login-container">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="login-logo">
            <div className="text-4xl font-bold text-purple-600">∞</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Loop</h1>
          <p className="text-white text-opacity-90">Share. Borrow. Build Community.</p>
        </div>

        <div className="card p-8">
          <div className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
            />
          </div>

          <button
            onClick={() => setCurrentPage('requests')}
            className="btn-primary mb-4"
          >
            Sign In
          </button>

          <div className="text-center">
            <button className="text-purple-600 text-sm font-medium">Create an account</button>
          </div>
        </div>

        <p className="text-center text-white text-opacity-80 text-xs mt-6">
          By continuing, you agree to Loop's Terms of Service
        </p>
      </div>
    </div>
  );

  const renderPage = () => {
    if (currentPage === 'login') return <LoginPage />;
    
    return (
      <div className="app-container">
        {currentPage === 'requests' && <RequestsPage />}
        {currentPage === 'loaning' && <LoaningPage />}
        {currentPage === 'map' && <MapPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'notifications' && <NotificationsPage />}
        {currentPage === 'createRequest' && <CreateRequestPage />}
        <Navigation />
      </div>
    );
  };

  return renderPage();
};

export default LoopApp;