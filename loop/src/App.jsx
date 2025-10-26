import { useGeolocation } from './hooks/useGeolocation';
import React, { useState, useEffect } from 'react';
import './App.css';

import { MapPin, Home, Bell, User, Plus, Search, Star, Clock, Check, X , CheckCircle, XCircle, MessageCircle} from 'lucide-react';
import MapboxMap from './components/MapboxMap';

// Firebase imports
import { auth, db } from './config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  limit,
  getDocs,
  writeBatch
} from 'firebase/firestore';

const LoopApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [notifications, setNotifications] = useState(3);
  const [userCredits, setUserCredits] = useState(47);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loaningFilter, setLoaningFilter] = useState('active');
  
  // Firebase auth state
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // HARDCODED: Would come from backend user session (fallback)
  const [currentUser, setCurrentUser] = useState({
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex@university.edu',
    phone: '(555) 123-4567',
    rating: 4.9,
    totalRatings: 23,
    points: 0,
    availableItems: ['USB-C to USB-C Charger']
  });

  // Real-time data from Firebase
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loanings, setLoanings] = useState([]);
  const [myBorrowedItems, setMyBorrowedItems] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  
  // User inventory management
  const [userInventory, setUserInventory] = useState([]);
  const [inventoryFilter, setInventoryFilter] = useState('all'); // all, available, occupied
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'other',
    description: '',
    estimatedValue: '',
    condition: 'excellent'
  });

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

const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation();
const [currentLocation, setCurrentLocation] = useState(null);

// Update current location when geolocation hook returns data
useEffect(() => {
  if (userLocation) {
    setCurrentLocation(userLocation);
    console.log('User location detected:', userLocation);
  }
}, [userLocation]);

  // Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setCurrentUser({
            id: firebaseUser.uid,
            name: data.name || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            phone: data.phone || '',
            rating: data.rating || 5.0,
            totalRatings: data.totalRatings || 0,
            availableItems: data.availableItems || []
          });
          setUserCredits(data.credits || 10);
        } else {
          // Create user document if it doesn't exist
          const newUserData = {
            name: firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            credits: 10,
            rating: 5.0,
            totalRatings: 0,
            availableItems: [],
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
          setCurrentUser({
            id: firebaseUser.uid,
            name: newUserData.name,
            email: firebaseUser.email,
            phone: '',
            rating: newUserData.rating,
            totalRatings: newUserData.totalRatings,
            availableItems: newUserData.availableItems
          });
          setUserCredits(newUserData.credits);
        }
        setCurrentPage('requests');
      } else {
        setUser(null);
        setUserData(null);
        setCurrentPage('login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user inventory when user changes
  useEffect(() => {
    if (!user) {
      setUserInventory([]);
      return;
    }

    // For now, initialize with empty inventory
    // In a real app, you'd load this from Firestore
    setUserInventory([]);
  }, [user]);

  // Listen for real-time requests (nearby pending requests)
  useEffect(() => {
    if (!user) {
      console.log('No user, clearing requests');
      setRequests([]);
        return;
      }

    console.log('Setting up requests listener for user:', user.uid);

    const requestsQuery = query(
      collection(db, 'requests'),
      where('status', '==', 'pending'),
      limit(20)
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      console.log('=== REQUESTS UPDATE ===');
      console.log('Snapshot size:', snapshot.size, 'documents');
      console.log('Current user ID:', user.uid);
      
      const requestsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Request ID:', doc.id);
        console.log('Request data:', data);
        console.log('Request requesterId:', data.requesterId);
        console.log('Is own request?', data.requesterId === user.uid);
        
        // Don't show your own requests
        if (data.requesterId !== user.uid) {
          console.log('✅ Adding request to display list');
          requestsList.push({
            id: doc.id,
            ...data
          });
        } else {
          console.log('❌ Skipping own request');
        }
      });
      
      console.log('Final filtered requests count:', requestsList.length);
      console.log('Requests to display:', requestsList);
      setRequests(requestsList);
    }, (error) => {
      console.error('Error in requests listener:', error);
    });

    return () => {
      console.log('Cleaning up requests listener');
      unsubscribe();
    };
  }, [user]);

  // Listen for my requests
  useEffect(() => {
    if (!user) return;

    const myRequestsQuery = query(
      collection(db, 'requests'),
      where('requesterId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(myRequestsQuery, (snapshot) => {
      const requestsList = [];
      snapshot.forEach((doc) => {
        requestsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setMyRequests(requestsList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for active loans where you're the loaner
  useEffect(() => {
    if (!user) return;

    const loansQuery = query(
      collection(db, 'loans'),
      where('loanerId', '==', user.uid),
      where('status', 'in', ['accepted', 'in-progress', 'completed'])
    );

    const unsubscribe = onSnapshot(loansQuery, (snapshot) => {
      const loansList = [];
      snapshot.forEach((doc) => {
        loansList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setLoanings(loansList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for items you're borrowing
  useEffect(() => {
    if (!user) return;

    const borrowedQuery = query(
      collection(db, 'loans'),
      where('borrowerId', '==', user.uid),
      where('status', 'in', ['accepted', 'in-progress', 'completed'])
    );

    const unsubscribe = onSnapshot(borrowedQuery, (snapshot) => {
      const borrowedList = [];
      snapshot.forEach((doc) => {
        borrowedList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setMyBorrowedItems(borrowedList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for notifications
  useEffect(() => {
    if (!user) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false),
      limit(20)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifsList = [];
      snapshot.forEach((doc) => {
        notifsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setNotificationsList(notifsList);
      setNotifications(notifsList.length);
    });

    return () => unsubscribe();
  }, [user]);

  // Load available items from user data
  useEffect(() => {
    if (userData?.availableItems) {
      setAvailableItems(userData.availableItems);
    }
  }, [userData]);


  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Edit request
  const handleEditRequest = async (requestId, updatedData) => {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      alert('Request updated successfully!');
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please try again.');
    }
  };

  // Cancel request
  const handleCancelRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });
      alert('Request cancelled.');
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request. Please try again.');
    }
  };

  // Clean up old test data (for development)
  const cleanupOldData = async () => {
    try {
      // Delete requests older than 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const oldRequestsQuery = query(
        collection(db, 'requests'),
        where('createdAt', '<', oneHourAgo)
      );
      
      const snapshot = await getDocs(oldRequestsQuery);
      const batch = writeBatch(db);
      
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Cleaned up ${snapshot.size} old requests`);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  };

  // Generate meetup code
  const generateMeetupCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Inventory Management Functions
  const handleAddItem = async () => {
    if (!newItemData.name.trim()) {
      alert('Please enter an item name');
        return;
      }

    try {
      const newItem = {
        id: Date.now().toString(),
        name: newItemData.name,
        category: newItemData.category,
        description: newItemData.description,
        estimatedValue: parseFloat(newItemData.estimatedValue) || 0,
        condition: newItemData.condition,
        status: 'available', // available, occupied, unavailable
        addedAt: new Date().toISOString(),
        ownerId: user.uid
      };

      // Add to local state
      setUserInventory(prev => [...prev, newItem]);
      
      // Update user's available items in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        availableItems: [...userInventory.map(item => item.name), newItem.name],
        lastUpdated: serverTimestamp()
      });

      // Reset form
      setNewItemData({
        name: '',
        category: 'other',
        description: '',
        estimatedValue: '',
        condition: 'excellent'
      });
      setShowAddItemForm(false);
      
      alert('Item added to your inventory!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your inventory?')) {
      try {
        const itemToRemove = userInventory.find(item => item.id === itemId);
        if (!itemToRemove) return;

        // Remove from local state
        setUserInventory(prev => prev.filter(item => item.id !== itemId));
        
        // Update user's available items in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          availableItems: userInventory
            .filter(item => item.id !== itemId)
            .map(item => item.name),
          lastUpdated: serverTimestamp()
        });

        alert('Item removed from your inventory');
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item. Please try again.');
      }
    }
  };

  const handleToggleItemStatus = async (itemId, newStatus) => {
    try {
      setUserInventory(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );
      
      alert(`Item marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Failed to update item status. Please try again.');
    }
  };

  // Check if user has a specific item available
  const hasItemAvailable = (itemName) => {
    return userInventory.some(item => 
      item.name.toLowerCase().includes(itemName.toLowerCase()) && 
      item.status === 'available'
    );
  };

  // Filter inventory based on current filter
  const getFilteredInventory = () => {
    let filtered = userInventory;

    if (inventoryFilter === 'available') {
      filtered = filtered.filter(item => item.status === 'available');
    } else if (inventoryFilter === 'occupied') {
      filtered = filtered.filter(item => item.status === 'occupied');
    }

    return filtered;
  };

  // Confirm pickup - mark loan as in progress
  const handleConfirmPickup = async (loanId) => {
    try {
      await updateDoc(doc(db, 'loans', loanId), {
        status: 'in-progress',
        confirmedAt: serverTimestamp()
      });
      alert('Pickup confirmed! Loan is now in progress.');
    } catch (error) {
      console.error('Error confirming pickup:', error);
      alert('Failed to confirm pickup. Please try again.');
    }
  };

  // Complete loan - mark as completed
  const handleCompleteLoan = async (loanId) => {
    try {
      await updateDoc(doc(db, 'loans', loanId), {
        status: 'completed',
        completedAt: serverTimestamp(),
        actualReturnTime: serverTimestamp()
      });
      alert('Loan completed! Points have been awarded.');
    } catch (error) {
      console.error('Error completing loan:', error);
      alert('Failed to complete loan. Please try again.');
    }
  };

  // Cancel loan
  const handleCancelLoan = async (loanId) => {
    try {
      await updateDoc(doc(db, 'loans', loanId), {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });
      alert('Loan cancelled.');
    } catch (error) {
      console.error('Error cancelling loan:', error);
      alert('Failed to cancel loan. Please try again.');
    }
  };

  // Accept a request
  const handleAcceptRequest = async (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    // Check if user has the requested item available
    if (!hasItemAvailable(request.itemName)) {
      alert(`You don't have "${request.itemName}" available in your inventory. Please add it to your inventory first or check if it's marked as available.`);
      return;
    }
      
    try {
      const meetupCode = generateMeetupCode();
      
      // Find the specific item from user's inventory
      const availableItem = userInventory.find(item => 
        item.name.toLowerCase().includes(request.itemName.toLowerCase()) && 
        item.status === 'available'
      );
      
      // Create loan document
      await addDoc(collection(db, 'loans'), {
        requestId: requestId,
        itemId: availableItem?.id || null,
        loanerId: user.uid,
        borrowerId: request.requesterId,
        itemName: request.itemName,
        status: 'accepted',
        meetupCode: meetupCode,
        startTime: serverTimestamp(),
        estimatedReturnTime: request.timeNeeded || request.time || '2 hours',
        createdAt: serverTimestamp()
      });

      // Update request status
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'accepted',
        acceptedBy: user.uid,
        acceptedAt: serverTimestamp()
      });

      // Mark item as occupied in inventory
      if (availableItem) {
        handleToggleItemStatus(availableItem.id, 'occupied');
      }

      alert(`Request accepted! Your meetup code is ${meetupCode}`);
      setCurrentPage('loaning');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    }
  };

  // Create a new request
  const handleCreateRequest = async () => {
    if (!formData.item || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for location
    if (!currentLocation) {
      alert('Please enable location services to create a request');
      return;
    }

    try {
      const newRequest = {
        requesterId: user.uid,
        itemName: formData.item,
        description: formData.details || '',
        location: formData.location || 'Current Location',
        timeNeeded: formData.time,
        status: 'pending',
        lat: currentLocation.lat,  // ✅ AUTO LOCATION
        lng: currentLocation.lng,  // ✅ AUTO LOCATION
        maxDistance: 5,
        createdAt: serverTimestamp()
      };

      console.log('Creating request with location:', newRequest);
      const docRef = await addDoc(collection(db, 'requests'), newRequest);
      console.log('Request created with ID:', docRef.id);

      setFormData({
        item: '',
        location: '',
        time: '',
        details: ''
      });

      alert('Request posted successfully with your location!');
      setCurrentPage('requests');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    }
  };



  // Filter requests
  const getFilteredRequests = () => {
    let filtered = requests.filter(r => r.status === 'pending');

    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      filtered = filtered.filter(l => l.status === 'accepted' || l.status === 'in-progress');
    } else if (loaningFilter === 'finished') {
      filtered = filtered.filter(l => l.status === 'completed' || l.status === 'cancelled');
    }

    return filtered;
  };

  // Mark notifications as read when viewing
  useEffect(() => {
    if (currentPage === 'notifications') {
      setNotifications(0);
    }
  }, [currentPage]);


  // Requests Page
  const RequestsPage = () => {
    const filteredRequests = getFilteredRequests();

    return (
      <div className="pb-20 px-4 pt-4">
          <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Nearby Requests</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={cleanupOldData}
              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full hover:bg-red-200"
            >
              Clean Old Data
            </button>
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">{userCredits} credits</span>
              </div>
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
                    <h3 className="font-semibold text-gray-800 mb-1">{request.itemName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{request.description || 'No description'}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{request.location}</span>
                      </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{request.timeNeeded}</span>
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
            {myRequests.map(request => (
              <div key={request.id} className={`border rounded-2xl p-4 ${
                request.status === 'accepted' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className={`flex items-center gap-2 mb-2 ${
                  request.status === 'accepted' ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  <Check className="w-5 h-5" />
                  <span className="font-medium">
                    {request.status === 'accepted' ? 'Request Accepted!' : 'Request Pending'}
                  </span>
        </div>
                <h3 className="font-semibold text-gray-800 mb-1">{request.itemName}</h3>
                <p className="text-sm text-gray-600 mb-2">{request.description || 'No description'}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{request.location}</span>
            </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{request.timeNeeded}</span>
                    </div>
                  </div>
            ))}
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
          {filteredLoanings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No active loans</p>
              <p className="text-sm text-gray-400 mt-1">When you accept requests, they'll appear here</p>
            </div>
          ) : (
            filteredLoanings.map(loan => (
              <div key={loan.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{loan.itemName}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    loan.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' : 
                    loan.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {loan.status === 'accepted' ? 'Pending Pickup' : 
                     loan.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                    </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">Item: {loan.itemName}</p>
                  <p className="text-sm text-gray-600">Estimated Return: {loan.estimatedReturnTime}</p>
                  <p className="text-sm text-gray-600">Status: {loan.status}</p>
                  </div>
                <div className="bg-indigo-50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-600 mb-1">Your Meetup Code:</p>
                  <p className="text-2xl font-bold text-center text-indigo-600">{loan.meetupCode}</p>
                </div>
                  {loan.status === 'accepted' && (
                  <div className="grid grid-cols-2 gap-2">
                      <button
                      onClick={() => handleConfirmPickup(loan.id)}
                      className="bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                      >
                      Confirm Pickup
                      </button>
                <button
                      onClick={() => handleCancelLoan(loan.id)}
                      className="bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Cancel
                      </button>
          </div>
                  )}
                  {loan.status === 'in-progress' && (
                  <div className="grid grid-cols-2 gap-2">
                      <button
                      onClick={() => handleCompleteLoan(loan.id)}
                      className="bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                      >
                      Mark Returned
                      </button>
                      <button 
                      onClick={() => handleCancelLoan(loan.id)}
                      className="bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                      >
                  Cancel
                      </button>
              </div>
                  )}
                {loan.status === 'completed' && (
                  <div className="text-center py-2">
                    <span className="text-green-600 font-medium">✓ Loan Completed</span>
                </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Borrowed Items Page
  const BorrowedItemsPage = () => {
    return (
      <div className="pb-20 px-4 pt-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Borrowed Items</h1>

        <div className="space-y-4">
          {myBorrowedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No borrowed items</p>
              <p className="text-sm text-gray-400 mt-1">When your requests are accepted, they'll appear here</p>
              </div>
          ) : (
            myBorrowedItems.map(loan => (
              <div key={loan.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{loan.itemName}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    loan.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' : 
                    loan.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {loan.status === 'accepted' ? 'Pending Pickup' : 
                     loan.status === 'in-progress' ? 'In Progress' : 'Completed'}
                  </span>
            </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">Estimated Return: {loan.estimatedReturnTime}</p>
                  <p className="text-sm text-gray-600">Status: {loan.status}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-600 mb-1">Meetup Code:</p>
                  <p className="text-2xl font-bold text-center text-indigo-600">{loan.meetupCode}</p>
                </div>
                {loan.status === 'accepted' && (
                  <div className="text-center py-2">
                    <span className="text-yellow-600 font-medium">Waiting for pickup confirmation</span>
          </div>
        )}
                {loan.status === 'in-progress' && (
                  <div className="text-center py-2">
                    <span className="text-blue-600 font-medium">Item in use</span>
              </div>
                )}
                {loan.status === 'completed' && (
                  <div className="text-center py-2">
                    <span className="text-green-600 font-medium">✓ Returned</span>
            </div>
                )}
          </div>
            ))
        )}
        </div>
      </div>
    );
  };

  // Map Page
  const MapPage = () => {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12';

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700 font-medium">Mapbox token missing</p>
          <p className="text-sm text-yellow-700">Set VITE_MAPBOX_TOKEN in .env.local</p>
        </div>
      </div>
    );
  }

  // Convert requests to markers
  const requestMarkers = requests
    .filter(r => r.lat && r.lng)
    .map(r => ({
      lat: r.lat,
      lng: r.lng,
      label: r.itemName
    }));

  return (
    <div className="h-screen bg-gray-100 relative">
      {/* Location status indicators */}
      {locationLoading && (
        <div className="absolute top-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 z-10">
          <p className="text-blue-700 text-sm">📍 Getting your location...</p>
        </div>
      )}
      
      {locationError && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 z-10">
          <p className="text-red-700 text-sm">⚠️ {locationError}</p>
        </div>
      )}

      {/* Map with user location */}
      <MapboxMap 
        token={MAPBOX_TOKEN} 
        style={MAPBOX_STYLE}
        center={currentLocation ? [currentLocation.lng, currentLocation.lat] : [-74.5, 40]}
        zoom={currentLocation ? 14 : 9}
        userLocation={currentLocation}
        markers={requestMarkers}
      />
      
      {/* Search bar */}
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

      {/* Request cards at bottom */}
      <div className="absolute bottom-24 left-4 right-4 space-y-2">
        {requests.slice(0, 2).map(req => (
          <div key={req.id} className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{req.itemName}</h3>
              <p className="text-sm text-gray-500">{req.location}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {req.rating || '5.0'}
              </div>
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
                  onClick={() => handleRemoveItem(item)}
                  className="text-red-600 text-sm hover:text-red-800"
                >
                  Remove
                </button>
            </div>
            ))}
              </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Add new item..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem(e.target.value);
                  e.target.value = '';
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={() => {
                const input = document.querySelector('input[placeholder="Add new item..."]');
                if (input && input.value) {
                  handleAddItem(input.value);
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
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
          <button 
            onClick={handleLogout}
            className="w-full text-left px-3 py-3 hover:bg-red-50 rounded-xl text-red-600"
          >
            Sign Out
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

    {/* Location Status Indicators */}
    {locationLoading && (
      <div className="mb-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
        📍 Getting your location...
      </div>
    )}
    
    {locationError && (
      <div className="mb-4 p-3 bg-red-50 rounded-xl text-sm text-red-700">
        ⚠️ {locationError}
        <br />
        <span className="text-xs">Please enable location services in your browser settings.</span>
      </div>
    )}

    {currentLocation && (
      <div className="mb-4 p-3 bg-green-50 rounded-xl">
        <p className="text-sm text-green-700 font-medium">✅ Location detected</p>
        <p className="text-xs text-green-600 mt-1">
          Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
        </p>
      </div>
    )}

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">What do you need? *</label>
        <input
          type="text"
          placeholder="e.g., iPhone Charger"
          value={formData.item}
          onChange={(e) => setFormData(prev => ({ ...prev, item: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Location (Optional)
        </label>
        <input
          type="text"
          placeholder="Using your current location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {currentLocation 
            ? '✓ Your current location will be used automatically' 
            : 'Waiting for location permission...'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Time Window *</label>
        <input
          type="text"
          placeholder="e.g., 2 hours, 1 day"
          value={formData.time}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details (optional)</label>
        <textarea
          placeholder="Any specific requirements..."
          value={formData.details}
          onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <button
        onClick={handleCreateRequest}
        disabled={!currentLocation}
        className={`w-full py-4 rounded-xl font-medium transition-colors ${
          currentLocation 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {currentLocation ? 'Post Request' : 'Waiting for location...'}
      </button>
    </div>
  </div>
);
  //Create **`loop/.env.local`** (if it doesn't exist):
  //VITE_MAPBOX_TOKEN= your_mapbox_token_here

  // Login Page
  const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async () => {
      setError('');
      
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      try {
        if (isSignUp) {
          // Sign up
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
          );
          console.log('User created:', userCredential.user.uid);
        } else {
          // Log in
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
          console.log('User logged in');
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message);
      }
    };

    return (
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
            </div>
            )}
            
            <div className="space-y-4 mb-6">
                <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
                </div>

                      <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors mb-4"
                      >
              {isSignUp ? 'Sign Up' : 'Sign In'}
                      </button>

            <div className="text-center">
                      <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-600 text-sm font-medium"
                      >
                {isSignUp ? 'Already have an account? Sign in' : 'Create an account'}
                      </button>
                </div>
        </div>

          <p className="text-center text-indigo-100 text-xs mt-6">
            By continuing, you agree to Loop's Terms of Service
          </p>
            </div>
          </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="text-4xl font-bold text-indigo-600">∞</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Loop</h1>
          <p className="text-indigo-100">Loading...</p>
        </div>
      </div>
    );
  }

  // Inventory Page
  const InventoryPage = () => {
    const filteredInventory = getFilteredInventory();

    return (
      <div className="pb-20 px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My Inventory</h1>
                <button
            onClick={() => setShowAddItemForm(!showAddItemForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
            {showAddItemForm ? 'Cancel' : 'Add Item'}
                </button>
        </div>

        {/* Add Item Form */}
        {showAddItemForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                  placeholder="e.g., iPhone Charger"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newItemData.category}
                    onChange={(e) => setNewItemData({...newItemData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="tools">Tools</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
              </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={newItemData.condition}
                    onChange={(e) => setNewItemData({...newItemData, condition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
            </div>
          </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                  value={newItemData.description}
                  onChange={(e) => setNewItemData({...newItemData, description: e.target.value})}
                  placeholder="Describe your item..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ($)</label>
                <input
                  type="number"
                  value={newItemData.estimatedValue}
                  onChange={(e) => setNewItemData({...newItemData, estimatedValue: e.target.value})}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddItem}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddItemForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInventoryFilter('all')}
            className={`px-4 py-2 rounded-full text-sm ${inventoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All Items
              </button>
          <button
            onClick={() => setInventoryFilter('available')}
            className={`px-4 py-2 rounded-full text-sm ${inventoryFilter === 'available' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Available
          </button>
          <button
            onClick={() => setInventoryFilter('occupied')}
            className={`px-4 py-2 rounded-full text-sm ${inventoryFilter === 'occupied' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Occupied
          </button>
        </div>

        {/* Inventory List */}
        <div className="space-y-4">
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No items in your inventory</p>
              <p className="text-sm text-gray-400 mt-1">Add items to start lending them out</p>
            </div>
          ) : (
            filteredInventory.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description || 'No description'}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="capitalize">{item.category}</span>
                      <span className="capitalize">{item.condition}</span>
                      <span>${item.estimatedValue}</span>
                </div>
              </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      item.status === 'available' ? 'bg-green-100 text-green-700' : 
                      item.status === 'occupied' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'available' ? 'Available' : 
                       item.status === 'occupied' ? 'Occupied' : 'Unavailable'}
                    </span>
        </div>
      </div>
                
                <div className="flex gap-2">
                  {item.status === 'available' && (
                    <button
                      onClick={() => handleToggleItemStatus(item.id, 'occupied')}
                      className="flex-1 bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                    >
                      Mark as Occupied
          </button>
                  )}
                  {item.status === 'occupied' && (
          <button 
                      onClick={() => handleToggleItemStatus(item.id, 'available')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Mark as Available
          </button>
                  )}
              <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Remove
              </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Navigation Component
  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button onClick={() => setCurrentPage('requests')} className="flex flex-col items-center gap-1">
          <Home className={`w-6 h-6 ${currentPage === 'requests' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'requests' ? 'text-indigo-600' : 'text-gray-400'}`}>Requests</span>
        </button>
        <button onClick={() => setCurrentPage('loaning')} className="flex flex-col items-center gap-1">
          <Plus className={`w-6 h-6 ${currentPage === 'loaning' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'loaning' ? 'text-indigo-600' : 'text-gray-400'}`}>Loaning</span>
                  </button>
        <button onClick={() => setCurrentPage('borrowed')} className="flex flex-col items-center gap-1">
          <MessageCircle className={`w-6 h-6 ${currentPage === 'borrowed' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'borrowed' ? 'text-indigo-600' : 'text-gray-400'}`}>Borrowed</span>
        </button>
        <button onClick={() => setCurrentPage('inventory')} className="flex flex-col items-center gap-1">
          <Plus className={`w-6 h-6 ${currentPage === 'inventory' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'inventory' ? 'text-indigo-600' : 'text-gray-400'}`}>Inventory</span>
        </button>
        <button onClick={() => setCurrentPage('map')} className="flex flex-col items-center gap-1">
          <MapPin className={`w-6 h-6 ${currentPage === 'map' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <span className={`text-xs ${currentPage === 'map' ? 'text-indigo-600' : 'text-gray-400'}`}>Map</span>
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

  // Render current page
  const renderPage = () => {
    if (currentPage === 'login') return <LoginPage />;

  return (
      <div className="bg-gray-50 min-h-screen">
        {currentPage === 'requests' && <RequestsPage />}
        {currentPage === 'loaning' && <LoaningPage />}
        {currentPage === 'borrowed' && <BorrowedItemsPage />}
        {currentPage === 'inventory' && <InventoryPage />}
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