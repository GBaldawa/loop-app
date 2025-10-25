import React, { useState, useEffect } from 'react';
import './App.css';

import { MapPin, Home, Bell, User, Plus, Search, Star, Clock, Check, X , CheckCircle, XCircle, MessageCircle} from 'lucide-react';
import MapboxMap from './components/MapboxMap';

const LoopApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [notifications, setNotifications] = useState(3);
  const [userCredits, setUserCredits] = useState(47);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loaningFilter, setLoaningFilter] = useState('active');
  
  // HARDCODED: Would come from backend user session
  const [currentUser] = useState({
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex@university.edu',
    phone: '(555) 123-4567',
    rating: 4.9,
    totalRatings: 23
  });

  // Track available items
  const [availableItems, setAvailableItems] = useState(['USB-C to USB-C Charger']);
  const [newItem, setNewItem] = useState('');

  // HARDCODED: Would fetch from API endpoint /api/requests
  const [requests, setRequests] = useState([
    { id: 1, item: 'USB-C to USB-C Charger', user: 'Sarah M.', userId: 'user_2', location: 'Thompson Hall', time: '2-4 pm', distance: 0.3, rating: 4.8, status: 'active', category: 'chargers' },
    { id: 2, item: 'iPhone Charger', user: 'Mike T.', userId: 'user_3', location: 'Student Center', time: '3-6 pm', distance: 0.5, rating: 4.9, status: 'active', category: 'chargers' },
    { id: 3, item: 'Laptop Charger (HP)', user: 'Emma K.', userId: 'user_4', location: 'Library', time: '1-3 pm', distance: 0.2, rating: 5.0, status: 'active', category: 'chargers' },
    { id: 4, item: 'Textbook - Biology 101', user: 'John D.', userId: 'user_5', location: 'Science Building', time: '10-12 pm', distance: 0.4, rating: 4.7, status: 'active', category: 'books' }
  ]);

  // HARDCODED: Would fetch from API endpoint /api/my-requests
  const [myRequests, setMyRequests] = useState([]);

  // HARDCODED: Would fetch from API endpoint /api/loanings
  const [loanings, setLoanings] = useState([]);
  
  // State for entering meetup codes
  const [codeInput, setCodeInput] = useState({});

  // HARDCODED: Would fetch from API endpoint /api/notifications
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

  // Generate meetup code
  const generateMeetupCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Accept a request
  const handleAcceptRequest = (requestId) => {
    // HARDCODED: Would call API endpoint POST /api/requests/:id/accept
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const pickupCode = generateMeetupCode();
    const returnCode = generateMeetupCode();
    
    // Add to my loanings
    const newLoaning = {
      id: Date.now(),
      item: request.item,
      borrower: request.user,
      borrowerId: request.userId,
      pickupLocation: request.location,
      time: request.time,
      status: 'pending_pickup',
      pickupCode: pickupCode,
      returnCode: returnCode,
      pickupConfirmed: false,
      returnConfirmed: false
    };
    setLoanings([...loanings, newLoaning]);

    // Add to borrower's active requests (simulated)
    const newMyRequest = {
      id: Date.now(),
      item: request.item,
      lender: currentUser.name,
      lenderId: currentUser.id,
      location: request.location,
      time: request.time,
      pickupCode: pickupCode,
      returnCode: returnCode,
      status: 'pending_pickup'
    };
    setMyRequests([...myRequests, newMyRequest]);

    // Remove from available requests
    setRequests(requests.filter(r => r.id !== requestId));
    
    // Show success message
    alert(`Request accepted! Your pickup code is ${pickupCode}\nYour return code is ${returnCode}`);

    setCurrentPage('loaning');
  };

  // Create a new request
  const handleCreateRequest = () => {
    // HARDCODED: Would call API endpoint POST /api/requests
    if (!formData.item || !formData.location || !formData.time) {
      alert('Please fill in all required fields');
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
      status: 'active',
      category: 'other',
      details: formData.details
    };
    
    // Add to requests list
    setRequests([...requests, newRequest]);

    // Reset form
    setFormData({
      item: '',
      location: '',
      time: '',
      details: ''
    });

    // Show in notifications
    const newNotification = {
      id: Date.now(),
      type: 'request_posted',
      title: 'Request posted!',
      message: `Your request for ${formData.item} is now live`,
      time: 'Just now',
      read: false
    };
    setNotificationsList([newNotification, ...notificationsList]);
    setNotifications(notifications + 1);

    alert('Request posted successfully!');
    setCurrentPage('requests');
  };

  // Confirm pickup with code verification (borrower side)
  const handleBorrowerPickup = (requestId, enteredCode) => {
    const request = myRequests.find(r => r.id === requestId);
    if (!request) return;

    if (enteredCode.toUpperCase() !== request.pickupCode) {
      alert('Invalid code! Please check with your lender.');
      return;
    }

    // Update request status
    setMyRequests(myRequests.map(r => 
      r.id === requestId ? { ...r, status: 'picked_up' } : r
    ));

    alert('Pickup confirmed! Remember to return the item.');
    setCodeInput({ ...codeInput, [requestId]: '' });
  };

  // Confirm return with code verification (borrower side)
  const handleBorrowerReturn = (requestId, enteredCode) => {
    const request = myRequests.find(r => r.id === requestId);
    if (!request) return;

    if (enteredCode.toUpperCase() !== request.returnCode) {
      alert('Invalid code! Please check with your lender.');
      return;
    }

    // Update request status to completed
    setMyRequests(myRequests.map(r => 
      r.id === requestId ? { ...r, status: 'completed' } : r
    ));

    alert('Item returned successfully! Thank you.');
    setCodeInput({ ...codeInput, [requestId]: '' });
  };

  // Lender confirms pickup (when borrower shows them the code)
  const handleLenderConfirmPickup = (loaningId) => {
    setLoanings(loanings.map(l => 
      l.id === loaningId ? { ...l, status: 'picked_up', pickupConfirmed: true } : l
    ));
    alert('Pickup confirmed!');
  };

  // Lender confirms return (when borrower returns and shows code)
  const handleLenderConfirmReturn = (loaningId) => {
    const loaning = loanings.find(l => l.id === loaningId);
    if (!loaning) return;

    setLoanings(loanings.map(l => 
      l.id === loaningId ? { ...l, status: 'completed', returnConfirmed: true } : l
    ));

    // Award credits for completed loan
    const creditsEarned = 5;
    setUserCredits(userCredits + creditsEarned);

    // Add notification
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

    alert(`Return confirmed! You earned ${creditsEarned} credits.`);
  };

  // Cancel loaning
  const handleCancelLoaning = (loaningId) => {
    // HARDCODED: Would call API endpoint DELETE /api/loanings/:id
    if (window.confirm('Are you sure you want to cancel this loaning?')) {
      setLoanings(loanings.filter(l => l.id !== loaningId));
      alert('Loaning cancelled');
    }
  };

  // Save profile settings
  const handleSaveProfile = () => {
    // HARDCODED: Would call API endpoint PUT /api/user/profile
    if (!profileData.name || !profileData.email || !profileData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    alert('Profile updated successfully!');
    setCurrentPage('profile');
  };

  // Add new item to available items
  const handleAddItem = () => {
    if (!newItem.trim()) {
      alert('Please enter an item name');
      return;
    }
    setAvailableItems([...availableItems, newItem.trim()]);
    setNewItem('');
    alert('Item added successfully!');
  };

  // Remove item from available items
  const handleRemoveItem = (index) => {
    setAvailableItems(availableItems.filter((_, i) => i !== index));
  };

  // Filter requests
  const getFilteredRequests = () => {
    let filtered = requests.filter(r => r.status === 'active');

    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter === 'chargers') {
      filtered = filtered.filter(r => r.category === 'chargers');
    } else if (activeFilter === 'near') {
      filtered = filtered.filter(r => r.distance <= 0.3);
    }

    return filtered;
  };

  // Filter loanings
  const getFilteredLoanings = () => {
    let filtered = loanings;

    if (loaningFilter === 'active') {
      filtered = filtered.filter(l => l.status === 'pending_pickup' || l.status === 'picked_up');
    } else if (loaningFilter === 'finished') {
      filtered = filtered.filter(l => l.status === 'completed');
    }

    return filtered;
  };

  // Mark notifications as read when viewing
  useEffect(() => {
    if (currentPage === 'notifications') {
      setNotifications(0);
    }
  }, [currentPage]);

  // Navigation Component
  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button onClick={() => setCurrentPage('requests')} className="flex flex-col items-center gap-1">
          <Home className={`w-6 h-6 ${currentPage === 'requests' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'requests' ? 'text-indigo-600' : 'text-gray-400'}`}>Requests</span>
        </button>
        <button onClick={() => setCurrentPage('map')} className="flex flex-col items-center gap-1">
          <MapPin className={`w-6 h-6 ${currentPage === 'map' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'map' ? 'text-indigo-600' : 'text-gray-400'}`}>Map</span>
        </button>
        <button onClick={() => setCurrentPage('loaning')} className="flex flex-col items-center gap-1">
          <Plus className={`w-6 h-6 ${currentPage === 'loaning' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'loaning' ? 'text-indigo-600' : 'text-gray-400'}`}>Loaning</span>
        </button>
        <button onClick={() => setCurrentPage('notifications')} className="flex flex-col items-center gap-1 relative">
          <Bell className={`w-6 h-6 ${currentPage === 'notifications' ? 'text-indigo-600' : 'text-gray-400'}`} />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notifications}</span>
          )}
          <span className={`text-xs ${currentPage === 'notifications' ? 'text-indigo-600' : 'text-gray-400'}`}>Alerts</span>
        </button>
        <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center gap-1">
          <User className={`w-6 h-6 ${currentPage === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}>Profile</span>
        </button>
      </div>
    </div>
  );

  // Requests Page
  const RequestsPage = () => {
    const filteredRequests = getFilteredRequests();

    return (
      <div className="pb-20 px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Nearby Requests</h1>
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">{userCredits} credits</span>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('chargers')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeFilter === 'chargers' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Chargers
          </button>
          <button 
            onClick={() => setActiveFilter('near')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeFilter === 'near' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Near me
          </button>
        </div>

        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No requests found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{request.item}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{request.user}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <button 
                  onClick={() => handleAcceptRequest(request.id)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
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
            <div className="space-y-4">
              {myRequests.map(request => (
                <div key={request.id} className={`border rounded-2xl p-4 ${
                  request.status === 'completed' ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    {request.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {request.status === 'completed' ? 'Completed' : 
                       request.status === 'picked_up' ? 'Item Picked Up' : 
                       'Request Accepted!'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{request.item}</h3>
                  <p className="text-sm text-gray-600 mb-1">Lender: {request.lender}</p>
                  <p className="text-sm text-gray-600 mb-1">Location: {request.location}</p>
                  <p className="text-sm text-gray-600 mb-3">Time: {request.time}</p>
                  
                  {request.status === 'pending_pickup' && (
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-3 border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">Enter lender's pickup code:</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={codeInput[request.id] || ''}
                            onChange={(e) => setCodeInput({ ...codeInput, [request.id]: e.target.value.toUpperCase() })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                            maxLength={4}
                          />
                          <button
                            onClick={() => handleBorrowerPickup(request.id, codeInput[request.id] || '')}
                            className="bg-green-600 text-white px-4 rounded-lg font-medium hover:bg-green-700"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {request.status === 'picked_up' && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 mb-2">
                        <p className="text-sm text-blue-700 font-medium">Remember to return the item!</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">Enter lender's return code:</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={codeInput[`return-${request.id}`] || ''}
                            onChange={(e) => setCodeInput({ ...codeInput, [`return-${request.id}`]: e.target.value.toUpperCase() })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                            maxLength={4}
                          />
                          <button
                            onClick={() => handleBorrowerReturn(request.id, codeInput[`return-${request.id}`] || '')}
                            className="bg-green-600 text-white px-4 rounded-lg font-medium hover:bg-green-700"
                          >
                            Return
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {request.status === 'completed' && (
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                      <p className="text-sm text-gray-600 text-center">✓ Transaction completed</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setCurrentPage('createRequest')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    );
  };

  // Loaning Page
  const LoaningPage = () => {
    const filteredLoanings = getFilteredLoanings();

    return (
      <div className="pb-20 px-4 pt-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Loanings</h1>

        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setLoaningFilter('active')}
            className={`px-4 py-2 rounded-full text-sm ${loaningFilter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setLoaningFilter('finished')}
            className={`px-4 py-2 rounded-full text-sm ${loaningFilter === 'finished' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Finished
          </button>
        </div>

        <div className="space-y-4">
          {filteredLoanings.map(loan => (
            <div key={loan.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{loan.item}</h3>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  loan.status === 'pending_pickup' ? 'bg-yellow-100 text-yellow-700' : 
                  loan.status === 'picked_up' ? 'bg-blue-100 text-blue-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  {loan.status === 'pending_pickup' ? 'Pending Pickup' : 
                   loan.status === 'picked_up' ? 'Out on Loan' : 
                   'Completed'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Borrower: {loan.borrower}</p>
                <p className="text-sm text-gray-600">Location: {loan.pickupLocation}</p>
                <p className="text-sm text-gray-600">Time: {loan.time}</p>
              </div>
              
              {loan.status === 'pending_pickup' && (
                <>
                  <div className="bg-indigo-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Pickup Code (Share with borrower):</p>
                    <p className="text-2xl font-bold text-center text-indigo-600">{loan.pickupCode}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleLenderConfirmPickup(loan.id)}
                      className="bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      Confirm Pickup
                    </button>
                    <button 
                      onClick={() => handleCancelLoaning(loan.id)}
                      className="bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
              
              {loan.status === 'picked_up' && (
                <>
                  <div className="bg-purple-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Return Code (Share with borrower):</p>
                    <p className="text-2xl font-bold text-center text-purple-600">{loan.returnCode}</p>
                  </div>
                  <button 
                    onClick={() => handleLenderConfirmReturn(loan.id)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    Confirm Return
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredLoanings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600">No {loaningFilter} loanings</p>
            <p className="text-sm text-gray-400 mt-1">Help someone out to earn credits!</p>
          </div>
        )}
      </div>
    );
  };

  // Map Page
  const MapPage = () => {
    // Read Mapbox token from environment (Vite). Do NOT hard-code tokens into source.
    // Add a .env.local with VITE_MAPBOX_TOKEN=your_token and restart dev server.
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
    // Read optional custom style from env. Use your style id like:
    // VITE_MAPBOX_STYLE=mapbox://styles/katet06/cmh6pfpuc000l01qnem9n42ai
    const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12';
 
 
    if (!MAPBOX_TOKEN) {
      return (
        <div className="p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700 font-medium">Mapbox token missing</p>
            <p className="text-sm text-yellow-700">Set <code>VITE_MAPBOX_TOKEN</code> in <code>.env.local</code> (do not commit) and restart the dev server.</p>
          </div>
        </div>
      );
    }
 
 
    return (
      <div className="h-screen bg-gray-100 relative">
        {/* Map container component; MapboxMap handles initialization */}
        <MapboxMap token={MAPBOX_TOKEN} style={MAPBOX_STYLE} center={[-74.5, 40]} zoom={9} />
 
 
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search items or location..."
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>
 
 
        <div className="absolute bottom-24 left-4 right-4 space-y-2">
          {requests.slice(0, 2).map(req => (
            <div key={req.id} className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{req.item}</h3>
                <p className="text-sm text-gray-500">{req.user} • {req.distance}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {req.rating}
                </div>
                <p className="text-xs text-blue-500 font-semibold">{req.credits} credits</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
 

  // Profile Page
  const ProfilePage = () => (
    <div className="pb-20 px-4 pt-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
          <User className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">{currentUser.name}</h1>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-lg font-medium">{currentUser.rating}</span>
          <span className="text-gray-500 text-sm">({currentUser.totalRatings} ratings)</span>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
          <Star className="w-5 h-5 text-indigo-600" />
          <span className="text-lg font-semibold text-indigo-600">{userCredits} Loop Credits</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Available Items</h3>
          <div className="space-y-2">
            {availableItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">{item}</span>
                <button 
                  onClick={() => handleRemoveItem(idx)}
                  className="text-red-600 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Enter item name"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleAddItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Settings</h3>
          <button onClick={() => setCurrentPage('settings')} className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-xl text-gray-700">
            Edit Profile
          </button>
          <button className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-xl text-gray-700">
            Notifications
          </button>
          <button className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-xl text-gray-700">
            Location Preferences
          </button>
        </div>
      </div>
    </div>
  );

  // Settings Page
  const SettingsPage = () => (
    <div className="pb-20 px-4 pt-4">
      <button onClick={() => setCurrentPage('profile')} className="mb-6 text-indigo-600 flex items-center gap-2">
        ← Back
      </button>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card (for damage deposits)</label>
              <input
                type="text"
                placeholder="•••• •••• •••• 1234"
                value={profileData.card}
                onChange={(e) => setProfileData({ ...profileData, card: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Enable location services</span>
            <input 
              type="checkbox" 
              checked={profileData.locationServices}
              onChange={(e) => setProfileData({ ...profileData, locationServices: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded" 
            />
          </label>
        </div>

        <button 
          onClick={handleSaveProfile}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  // Notifications Page
  const NotificationsPage = () => (
    <div className="pb-20 px-4 pt-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Notifications</h1>

      <div className="space-y-3">
        {notificationsList.map((notif) => (
          <div 
            key={notif.id} 
            className={`border rounded-2xl p-4 ${
              notif.type === 'new_request' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notif.type === 'new_request' ? 'bg-indigo-600' : 
                notif.type === 'accepted' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {notif.type === 'new_request' && <Bell className="w-5 h-5 text-white" />}
                {notif.type === 'accepted' && <Check className="w-5 h-5 text-green-600" />}
                {notif.type === 'credits' && <Star className="w-5 h-5 text-yellow-600" />}
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

  // Create Request Page
  const CreateRequestPage = () => (
    <div className="pb-20 px-4 pt-4">
      <button onClick={() => setCurrentPage('requests')} className="mb-6 text-indigo-600 flex items-center gap-2">
        ← Back
      </button>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create a Request</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you need?</label>
          <input
            type="text"
            placeholder="e.g., iPhone Charger"
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
          <input
            type="text"
            placeholder="e.g., Library 2nd Floor"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Window</label>
          <input
            type="text"
            placeholder="e.g., 2-4 pm"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details (optional)</label>
          <textarea
            placeholder="Any specific details about your request..."
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
          />
        </div>

        <button 
          onClick={handleCreateRequest}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Post Request
        </button>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="text-4xl font-bold text-indigo-600">∞</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Loop</h1>
          <p className="text-indigo-100">Share. Borrow. Build Community.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setCurrentPage('requests')}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors mb-4"
          >
            Sign In
          </button>

          <div className="text-center">
            <button className="text-indigo-600 text-sm font-medium">Create an account</button>
          </div>
        </div>

        <p className="text-center text-indigo-100 text-xs mt-6">
          By continuing, you agree to Loop's Terms of Service
        </p>
      </div>
    </div>
  );

  // Render current page
  const renderPage = () => {
    if (currentPage === 'login') return <LoginPage />;
    
    return (
      <div className="bg-gray-50 min-h-screen">
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