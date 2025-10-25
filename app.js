import React, { useState, useEffect } from 'react';
import { MapPin, Bell, Plus, User, Home, Search, Star, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

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
  limit
} from 'firebase/firestore';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Real-time data from Firebase
  const [requests, setRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // Create user document if it doesn't exist
          const newUserData = {
            name: firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            credits: 10,
            rating: 5.0,
            loansCompleted: 0,
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for real-time requests (nearby pending requests)
  useEffect(() => {
    if (!user) return;

    const requestsQuery = query(
      collection(db, 'requests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Don't show your own requests
        if (data.requesterId !== user.uid) {
          requestsList.push({
            id: doc.id,
            ...data
          });
        }
      });
      setRequests(requestsList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for active loans where you're the loaner
  useEffect(() => {
    if (!user) return;

    const loansQuery = query(
      collection(db, 'loans'),
      where('loanerId', '==', user.uid),
      where('status', 'in', ['accepted', 'in-progress'])
    );

    const unsubscribe = onSnapshot(loansQuery, (snapshot) => {
      const loansList = [];
      snapshot.forEach((doc) => {
        loansList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setActiveLoans(loansList);
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
      orderBy('sentAt', 'desc'),
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
      setNotifications(notifsList);
    });

    return () => unsubscribe();
  }, [user]);

  const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
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
          
          // User document will be created in onAuthStateChanged
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Loop</h1>
            <p className="text-gray-500">Share. Borrow. Connect.</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 text-sm hover:underline"
            >
              {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HomePage = () => {
    const handleAcceptRequest = async (requestId) => {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      try {
        // Create loan document
        await addDoc(collection(db, 'loans'), {
          requestId: requestId,
          itemId: null, // You'd get this from item selection
          loanerId: user.uid,
          borrowerId: request.requesterId,
          itemName: request.itemName,
          status: 'accepted',
          startTime: serverTimestamp(),
          estimatedReturnTime: request.estimatedReturnTime,
          createdAt: serverTimestamp()
        });

        // Update request status
        await updateDoc(doc(db, 'requests', requestId), {
          status: 'accepted',
          acceptedBy: user.uid,
          acceptedAt: serverTimestamp()
        });

        console.log('Request accepted successfully!');
      } catch (error) {
        console.error('Error accepting request:', error);
        alert('Failed to accept request. Please try again.');
      }
    };

    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back!</h2>
              <p className="text-gray-500">{userData?.name}</p>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 rounded-2xl px-4 py-2">
                <p className="text-xs text-gray-600">Credits</p>
                <p className="text-2xl font-bold text-blue-500">{userData?.credits || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{userData?.loansCompleted || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Loans</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <p className="text-2xl font-bold text-gray-800">{userData?.rating?.toFixed(1) || '5.0'}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Rating</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{activeLoans.length}</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Nearby Requests</h3>
          </div>

          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No requests available</p>
                <p className="text-sm text-gray-400 mt-2">Check back later for new items</p>
              </div>
            ) : (
              requests.map(request => (
                <div key={request.id} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{request.itemName}</h4>
                      <p className="text-sm text-gray-500 mt-1">{request.description || 'No description'}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-50 rounded-xl px-3 py-1">
                        <p className="text-blue-600 font-semibold text-sm">Points</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="w-full bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
                  >
                    Accept Request
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const CreateRequestButton = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newRequest, setNewRequest] = useState({ itemName: '', description: '' });

    const handleCreateRequest = async () => {
      if (!newRequest.itemName) {
        alert('Please enter an item name');
        return;
      }
      
      try {
        // Add request to Firestore
        // Cloud Functions will automatically find matches!
        await addDoc(collection(db, 'requests'), {
          requesterId: user.uid,
          itemName: newRequest.itemName,
          description: newRequest.description,
          status: 'pending',
          location: {
            // TODO: Get actual user location
            lat: 40.7128,
            lng: -74.0060
          },
          maxDistance: 5, // miles
          createdAt: serverTimestamp()
        });
        
        setNewRequest({ itemName: '', description: '' });
        setShowCreateForm(false);
        alert('Request posted! Looking for matches...');
      } catch (error) {
        console.error('Error creating request:', error);
        alert('Failed to create request. Please try again.');
      }
    };

    return (
      <>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="fixed bottom-24 right-4 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition z-30"
        >
          <Plus className="w-6 h-6" />
        </button>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Request an Item</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="What do you need?"
                  value={newRequest.itemName}
                  onChange={(e) => setNewRequest({...newRequest, itemName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 h-24"
                />
                <div className="space-y-3">
                  <button
                    onClick={handleCreateRequest}
                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
                  >
                    Post Request
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const NavigationBar = () => {
    const navItems = [
      { id: 'home', icon: Home, label: 'Home' },
      { id: 'profile', icon: User, label: 'Profile' }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center space-y-1 transition ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        setCurrentPage('home');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-b-3xl shadow-sm p-6 mb-6 text-white">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-4">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userData?.name}</h2>
              <p className="text-sm opacity-90">{user?.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white bg-opacity-20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{userData?.credits || 0}</p>
              <p className="text-xs mt-1 opacity-90">Credits</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{userData?.loansCompleted || 0}</p>
              <p className="text-xs mt-1 opacity-90">Completed</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{activeLoans.length}</p>
              <p className="text-xs mt-1 opacity-90">Active</p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-3">
          <button 
            onClick={handleLogout}
            className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-red-50 transition"
          >
            <span className="font-semibold text-red-600">Log Out</span>
            <span className="text-red-400 text-xl">›</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-500 mb-2">Loop</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="max-w-lg mx-auto bg-white min-h-screen relative">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'profile' && <ProfilePage />}
      
      {currentPage === 'home' && <CreateRequestButton />}
      <NavigationBar />
    </div>
  );
};

export default App;