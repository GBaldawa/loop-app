import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { MapPin, Bell, Plus, User, Home, Search, Star, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
=======
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Home, Search, Plus, Bell, User, MessageCircle } from "lucide-react";
import { useNotifications } from './hooks/useNotifications.jsx';
import useHapticFeedback from './hooks/useHapticFeedback';
import { auth, db } from "./config/firebase";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
  getDocs,
  writeBatch,
  deleteDoc
} from "firebase/firestore";

import LoadingSpinner from './components/LoadingSpinner';

// Import page components
import HomePage from './HomePage';
import ItemsPage from './ItemsPage';
import InventoryPage from './InventoryPage';
import LoaningPage from './LoaningPage';
import ProfilePage from './ProfilePage';
import AuthPage from './AuthPage';
import MapPage from './MapPage';

// Custom hook for geolocation
const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  return { location, error, loading };
};

// Comprehensive item database for smart matching
const ITEM_DATABASE = {
  'Electronics': [
    { name: 'iPhone Charger', aliases: ['iphone charger', 'lightning cable', 'apple charger', 'iphone cable', 'lightning charger'] },
    { name: 'USB Cable', aliases: ['usb cable', 'usb cord', 'charging cable', 'usb charger', 'micro usb'] },
    { name: 'Power Bank', aliases: ['power bank', 'portable charger', 'battery pack', 'external battery'] },
    { name: 'Laptop Charger', aliases: ['laptop charger', 'computer charger', 'macbook charger', 'pc charger'] },
    { name: 'Headphones', aliases: ['headphones', 'earphones', 'earbuds', 'airpods', 'wireless headphones'] },
    { name: 'Phone Case', aliases: ['phone case', 'iphone case', 'phone cover', 'protective case'] },
    { name: 'Bluetooth Speaker', aliases: ['bluetooth speaker', 'wireless speaker', 'portable speaker'] },
    { name: 'Camera', aliases: ['camera', 'digital camera', 'dslr', 'point and shoot'] },
    { name: 'Tablet', aliases: ['tablet', 'ipad', 'android tablet', 'kindle'] },
    { name: 'Gaming Controller', aliases: ['gaming controller', 'xbox controller', 'playstation controller', 'gamepad'] }
  ],
  'Books': [
    { name: 'Textbook', aliases: ['textbook', 'school book', 'course book', 'academic book'] },
    { name: 'Novel', aliases: ['novel', 'fiction book', 'story book', 'literature'] },
    { name: 'Cookbook', aliases: ['cookbook', 'recipe book', 'cooking book'] },
    { name: 'Dictionary', aliases: ['dictionary', 'word book', 'reference book'] },
    { name: 'Magazine', aliases: ['magazine', 'periodical', 'journal'] },
    { name: 'Comic Book', aliases: ['comic book', 'graphic novel', 'manga'] }
  ],
  'Tools': [
    { name: 'Hammer', aliases: ['hammer', 'mallet', 'claw hammer'] },
    { name: 'Screwdriver Set', aliases: ['screwdriver', 'screwdriver set', 'phillips screwdriver', 'flathead'] },
    { name: 'Drill', aliases: ['drill', 'power drill', 'cordless drill', 'electric drill'] },
    { name: 'Wrench Set', aliases: ['wrench', 'wrench set', 'socket wrench', 'adjustable wrench'] },
    { name: 'Tape Measure', aliases: ['tape measure', 'measuring tape', 'ruler'] },
    { name: 'Level', aliases: ['level', 'spirit level', 'bubble level'] },
    { name: 'Pliers', aliases: ['pliers', 'wire cutters', 'needle nose pliers'] }
  ],
  'Clothing': [
    { name: 'Jacket', aliases: ['jacket', 'coat', 'blazer', 'outerwear'] },
    { name: 'Sweater', aliases: ['sweater', 'pullover', 'jumper', 'cardigan'] },
    { name: 'Dress', aliases: ['dress', 'gown', 'frock'] },
    { name: 'Jeans', aliases: ['jeans', 'denim', 'pants'] },
    { name: 'Shoes', aliases: ['shoes', 'sneakers', 'boots', 'sandals', 'heels'] },
    { name: 'Hat', aliases: ['hat', 'cap', 'beanie', 'baseball cap'] },
    { name: 'Scarf', aliases: ['scarf', 'muffler', 'wrap'] }
  ],
  'Sports': [
    { name: 'Basketball', aliases: ['basketball', 'bball', 'hoop ball'] },
    { name: 'Soccer Ball', aliases: ['soccer ball', 'football', 'futbol'] },
    { name: 'Tennis Racket', aliases: ['tennis racket', 'tennis racquet', 'racket'] },
    { name: 'Golf Clubs', aliases: ['golf clubs', 'golf set', 'golf bag'] },
    { name: 'Yoga Mat', aliases: ['yoga mat', 'exercise mat', 'fitness mat'] },
    { name: 'Dumbbells', aliases: ['dumbbells', 'weights', 'free weights'] },
    { name: 'Bicycle', aliases: ['bicycle', 'bike', 'mountain bike', 'road bike'] },
    { name: 'Skateboard', aliases: ['skateboard', 'skate', 'board'] }
  ],
  'General': [
    { name: 'Umbrella', aliases: ['umbrella', 'rain umbrella', 'parasol'] },
    { name: 'Backpack', aliases: ['backpack', 'rucksack', 'bag', 'school bag'] },
    { name: 'Water Bottle', aliases: ['water bottle', 'bottle', 'hydration bottle'] },
    { name: 'Lunch Box', aliases: ['lunch box', 'lunch bag', 'food container'] },
    { name: 'Keys', aliases: ['keys', 'house keys', 'car keys', 'keychain'] },
    { name: 'Wallet', aliases: ['wallet', 'purse', 'billfold'] },
    { name: 'Sunglasses', aliases: ['sunglasses', 'shades', 'sun glasses'] },
    { name: 'Watch', aliases: ['watch', 'wristwatch', 'timepiece'] }
  ]
};

// Smart item matching function
const findMatchingItem = (inputText) => {
  const normalizedInput = inputText.toLowerCase().trim();
  
  // First, try exact matches
  for (const category in ITEM_DATABASE) {
    for (const item of ITEM_DATABASE[category]) {
      if (item.name.toLowerCase() === normalizedInput) {
        return { name: item.name, category };
      }
    }
  }
  
  // Then try alias matches
  for (const category in ITEM_DATABASE) {
    for (const item of ITEM_DATABASE[category]) {
      for (const alias of item.aliases) {
        if (alias === normalizedInput) {
          return { name: item.name, category };
        }
      }
    }
  }
  
  // Finally, try partial matches
  for (const category in ITEM_DATABASE) {
    for (const item of ITEM_DATABASE[category]) {
      for (const alias of item.aliases) {
        if (alias.includes(normalizedInput) || normalizedInput.includes(alias)) {
          return { name: item.name, category };
        }
      }
    }
  }
  
  return null; // No match found
};

// Get suggestions for autocomplete
const getItemSuggestions = (inputText) => {
  const normalizedInput = inputText.toLowerCase().trim();
  const suggestions = [];
  
  if (normalizedInput.length < 2) return suggestions;
  
  for (const category in ITEM_DATABASE) {
    for (const item of ITEM_DATABASE[category]) {
      for (const alias of item.aliases) {
        if (alias.includes(normalizedInput)) {
          suggestions.push({ name: item.name, category, alias });
        }
      }
    }
  }
  
  // Remove duplicates and limit to 10 suggestions
  const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
    index === self.findIndex(s => s.name === suggestion.name)
  ).slice(0, 10);
  
  return uniqueSuggestions;
};

// Auto-navigation helper
const useAutoNavigation = () => {
  const navigate = useNavigate();
  
  const navigateTo = (path, reason = '') => {
    console.log(`🧭 Auto-navigating to ${path}${reason ? ` (${reason})` : ''}`);
    navigate(path);
  };

  return { navigateTo };
};

// Simple market value-based points calculation
const calculatePoints = (itemValue, loanDurationHours) => {
  // 1 hour = market value in points
  // So a $50 item lent for 2 hours = 100 points
  return Math.floor(itemValue * loanDurationHours);
};

const generateMeetupCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { navigateTo } = useAutoNavigation();
  const { NotificationContainer, success, error, warning, info } = useNotifications();
  const { trigger: haptic } = useHapticFeedback();
  const location = useLocation();

  // Core data state
  const [availableItems, setAvailableItems] = useState([]); // All items available for borrowing
  const [myInventory, setMyInventory] = useState([]); // Items I own and can lend
  const [requests, setRequests] = useState([]); // All requests (for loaners to see)
  const [myRequests, setMyRequests] = useState([]); // My borrowing requests
  const [activeLoans, setActiveLoans] = useState([]); // Loans where I'm the loaner
  const [completedLoans, setCompletedLoans] = useState([]); // Completed loans where I'm the loaner
  const [myBorrowedItems, setMyBorrowedItems] = useState([]); // Items I'm currently borrowing
>>>>>>> Stashed changes
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([
    { id: 1, user: 'Sarah K.', item: 'Ladder', distance: '0.3 mi', rating: 4.8, credits: 15, time: '2h ago', status: 'pending' },
    { id: 2, user: 'Mike T.', item: 'Power Drill', distance: '0.5 mi', rating: 4.9, credits: 25, time: '4h ago', status: 'pending' },
    { id: 3, user: 'Emma L.', item: 'Camping Tent', distance: '0.8 mi', rating: 4.7, credits: 20, time: '5h ago', status: 'pending' }
  ]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

<<<<<<< Updated upstream
  useEffect(() => {
    const mockUser = {
      name: 'Alex Johnson',
      credits: 42,
      rating: 4.8,
      loansCompleted: 23
    };
    setUser(mockUser);
=======
  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({
    loanId: null,
    otherUserId: null,
    otherUserName: null,
    userRole: null, // 'borrower' or 'loaner'
    rating: 5,
    comment: ''
  });
  const [shownRatingLoans, setShownRatingLoans] = useState(new Set());

  // Location state
  const { location: userLocation, error: locationError, loading: locationLoading } = useGeolocation();

  // Authentication effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Load or create user data
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          // Create new user document
          const newUserData = {
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email,
            credits: 0,
            rating: 5.0,
            totalRatings: 0,
            loansCompleted: 0,
            itemsOwned: 0,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp()
          };
          await setDoc(userRef, newUserData);
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

  // Real-time user data listener
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Auto-redirect after successful authentication
  useEffect(() => {
    if (user && !loading && (location.pathname === '/login' || location.pathname === '/auth')) {
      console.log('🔄 User authenticated, redirecting to home page');
      navigateTo('/', 'User authenticated');
    }
  }, [user, loading, location.pathname, navigateTo]);

  // Listen for available items (for borrowers to browse)
  useEffect(() => {
    if (!user) return;

    const itemsQuery = query(
      collection(db, 'items'),
      where('available', '==', true)
    );

    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const itemsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Don't include my own items
        if (data.ownerId !== user.uid) {
          itemsList.push({
            id: doc.id,
            ...data,
            distance: userLocation ? calculateDistance(
              userLocation.lat, userLocation.lng,
              data.lat || 0, data.lng || 0
            ) : null
          });
        }
      });
      // Sort by creation time on the client side
      itemsList.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      setAvailableItems(itemsList);
    });

    return () => unsubscribe();
  }, [user, userLocation]);

  // Listen for my inventory (items I own)
  useEffect(() => {
    if (!user) return;

    console.log('Setting up inventory listener for user:', user.uid);

    const inventoryQuery = query(
      collection(db, 'items'),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(inventoryQuery, (snapshot) => {
      console.log('=== INVENTORY UPDATE ===');
      console.log('Snapshot size:', snapshot.size);
      const inventoryList = [];
      snapshot.forEach((doc) => {
        console.log('Inventory item:', doc.id, doc.data());
        inventoryList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort by creation time on the client side
      inventoryList.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      console.log('Setting inventory to:', inventoryList);
      setMyInventory(inventoryList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for requests (for loaners to see matching requests)
  useEffect(() => {
    if (!user) return;

    const requestsQuery = query(
      collection(db, 'requests'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(requestsQuery, async (snapshot) => {
      console.log('=== REQUESTS UPDATE ===');
      console.log('Snapshot size:', snapshot.size);
      const requestsList = [];
      
      // Get current inventory to check for matches
      const inventoryQuery = query(
        collection(db, 'items'),
        where('ownerId', '==', user.uid),
        where('available', '==', true)
      );
      
      const inventorySnapshot = await getDocs(inventoryQuery);
      const currentInventory = [];
      inventorySnapshot.forEach((doc) => {
        currentInventory.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Don't show my own requests in available requests
        if (data.requesterId === user.uid) {
        return;
      }
        
        // Check if I have a matching item in my inventory
        const matchingItem = currentInventory.find(item => 
          item.name.toLowerCase().includes(data.itemName.toLowerCase()) ||
          data.itemName.toLowerCase().includes(item.name.toLowerCase())
        );
        
        requestsList.push({
          id: doc.id,
          ...data,
          requesterName: data.requesterName || 'Unknown',
          matchingItem: matchingItem,
          hasMatchingItem: !!matchingItem,
          distance: userLocation ? calculateDistance(
            userLocation.lat, userLocation.lng,
            data.lat || 0, data.lng || 0
          ) : null
        });
      });
      console.log('Final requests count:', requestsList.length);
      console.log('Requests to display:', requestsList);
      setRequests(requestsList);
    });

    return () => unsubscribe();
  }, [user, userLocation]);

  // Listen for my requests (requests I made as a borrower)
  useEffect(() => {
    if (!user) return;

    const myRequestsQuery = query(
      collection(db, 'requests'),
      where('requesterId', '==', user.uid),
      where('status', 'in', ['pending', 'accepted'])
    );

    const unsubscribe = onSnapshot(myRequestsQuery, (snapshot) => {
      const requestsList = [];
      snapshot.forEach((doc) => {
        requestsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort by creation time on the client side
      requestsList.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      setMyRequests(requestsList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for active loans (where I'm the loaner)
  useEffect(() => {
    if (!user) return;

    const loansQuery = query(
      collection(db, 'loans'),
      where('loanerId', '==', user.uid),
      where('status', 'in', ['accepted', 'in-progress'])
    );

    const unsubscribe = onSnapshot(loansQuery, (snapshot) => {
      console.log('=== ACTIVE LOANS UPDATE ===');
      console.log('Snapshot size:', snapshot.size);
      const loansList = [];
      snapshot.forEach((doc) => {
        console.log('Active loan:', doc.id, doc.data());
        loansList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort by creation time on the client side
      loansList.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      console.log('Setting active loans to:', loansList);
      setActiveLoans(loansList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for completed loans (where I'm the loaner)
  useEffect(() => {
    if (!user) return;

    const completedLoansQuery = query(
      collection(db, 'loans'),
      where('loanerId', '==', user.uid),
      where('status', '==', 'completed')
    );

    const unsubscribe = onSnapshot(completedLoansQuery, (snapshot) => {
      console.log('=== COMPLETED LOANS UPDATE ===');
      console.log('Snapshot size:', snapshot.size);
      const loansList = [];
      snapshot.forEach((doc) => {
        console.log('Completed loan:', doc.id, doc.data());
        loansList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort by completion time on the client side
      loansList.sort((a, b) => {
        const aTime = a.completedAt?.toDate?.() || new Date(0);
        const bTime = b.completedAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      console.log('Setting completed loans to:', loansList);
      setCompletedLoans(loansList);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for my borrowed items (items I'm borrowing)
  useEffect(() => {
    if (!user) return;

    const borrowedQuery = query(
      collection(db, 'loans'),
      where('borrowerId', '==', user.uid),
      where('status', 'in', ['accepted', 'in-progress'])
    );

    const unsubscribe = onSnapshot(borrowedQuery, (snapshot) => {
      const borrowedList = [];
      snapshot.forEach((doc) => {
        borrowedList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort by creation time on the client side
      borrowedList.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
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
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifsList = [];
      snapshot.forEach((doc) => {
        const notification = {
          id: doc.id,
          ...doc.data()
        };
        notifsList.push(notification);
        
        // Auto-show rating modal for show_rating_modal notifications (only once per loan)
        if (notification.type === 'show_rating_modal' && 
            !notification.read && 
            !showRatingModal && 
            !shownRatingLoans.has(notification.loanId)) {
          
          // Check if this loan has already been rated by this user
          const hasRated = async () => {
            try {
              const ratingsQuery = query(
                collection(db, 'ratings'),
                where('loanId', '==', notification.loanId),
                where('raterId', '==', user.uid)
              );
              const ratingsSnapshot = await getDocs(ratingsQuery);
              return !ratingsSnapshot.empty;
            } catch (error) {
              console.error('Error checking existing ratings:', error);
              return false;
            }
          };
          
          // Only show modal if user hasn't rated yet
          hasRated().then(alreadyRated => {
            if (!alreadyRated) {
              setRatingData({
                loanId: notification.loanId,
                otherUserId: notification.otherUserId,
                otherUserName: notification.otherUserName,
                userRole: notification.userRole,
                rating: 5,
                comment: ''
              });
              setShowRatingModal(true);
              
              // Mark this loan as shown to prevent repeated popups
              setShownRatingLoans(prev => new Set([...prev, notification.loanId]));
            }
            
            // Always mark notification as read to prevent repeated popups
            updateDoc(doc(db, 'notifications', notification.id), {
              read: true
            });
          });
        }
      });
      // Sort by creation time on the client side and limit to 20
      notifsList.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      const limitedNotifs = notifsList.slice(0, 20);
      setNotifications(limitedNotifs);
      setNotificationsCount(limitedNotifs.length);
    });

    return () => unsubscribe();
  }, [user]);

  // Core functions

  // BORROWER FUNCTIONS
  const handleCreateRequest = async (requestData) => {
    try {
      if (!user) return false;

      const request = {
        requesterId: user.uid,
        requesterName: userData?.name || user.email?.split('@')[0] || 'User',
        requesterRating: userData?.rating || 0, // Add requester's rating
        itemName: requestData.itemName,
        description: requestData.description || '',
        category: requestData.category || 'General',
        location: requestData.location || 'Current Location',
        lat: requestData.lat || userLocation?.lat || 0,
        lng: requestData.lng || userLocation?.lng || 0,
        neededFrom: requestData.neededFrom || new Date().toISOString(),
        neededUntil: requestData.neededUntil || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        maxDistance: requestData.maxDistance || 5,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'requests'), request);
      
      // Create notification for potential loaners
      await createMatchingNotifications(request);
      
      // Show success notification
      success('Request created successfully! You can now see it in your requests.');
      
      // Auto-navigate to My Requests tab to see the new request
      navigateTo('/', 'Request created successfully');
      
      return true;
    } catch (error) {
      console.error('Error creating request:', error);
      return false;
    }
  };

  const createMatchingNotifications = async (request) => {
    try {
      // Find all users who have matching items
      const itemsQuery = query(
        collection(db, 'items'),
        where('available', '==', true)
      );
      
      const itemsSnapshot = await getDocs(itemsQuery);
      const matchingUsers = new Set();
      
      itemsSnapshot.forEach((doc) => {
        const item = doc.data();
        if (item.name.toLowerCase().includes(request.itemName.toLowerCase()) ||
            request.itemName.toLowerCase().includes(item.name.toLowerCase())) {
          matchingUsers.add(item.ownerId);
        }
      });
      
      // Create notifications for matching users
      const batch = writeBatch(db);
      matchingUsers.forEach(userId => {
        if (userId !== request.requesterId) {
          const notificationRef = doc(collection(db, 'notifications'));
          batch.set(notificationRef, {
            userId: userId,
            type: 'matching_request',
            title: 'New Matching Request!',
            message: `${request.requesterName} needs a ${request.itemName}`,
            requestId: request.id,
            read: false,
            createdAt: serverTimestamp()
          });
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  };

  // LOANER FUNCTIONS
  const handleAcceptRequest = async (requestId) => {
    if (actionLoading) return false;
    setActionLoading(true);
    
    try {
      console.log('=== ACCEPT REQUEST DEBUG ===');
      console.log('Request ID:', requestId);
      console.log('Available requests:', requests);
      console.log('My inventory:', myInventory);

      if (!user) return false;

      const request = requests.find(r => r.id === requestId);
      if (!request) {
        console.log('Request not found');
        error('Request not found. Please refresh and try again.');
        haptic('error');
        return false;
      }

      console.log('Found request:', request);

      // Find matching item in my inventory
      const matchingItem = myInventory.find(item => 
        item.name.toLowerCase().includes(request.itemName.toLowerCase()) ||
        request.itemName.toLowerCase().includes(item.name.toLowerCase())
      );

      console.log('Matching item:', matchingItem);

      if (!matchingItem) {
        console.log('No matching item found in inventory');
        error('You don\'t have this item in your inventory. Please add it first!');
        return false;
      }

      if (!matchingItem.available) {
        console.log('Item is not available');
        error('This item is currently being borrowed by someone else.');
        return false;
      }

      const meetupCode = generateMeetupCode();
      console.log('Generated meetup code:', meetupCode);

      // Create loan document
      const loanData = {
        requestId: requestId,
        loanerId: user.uid,
        loanerName: userData?.name || user.email?.split('@')[0] || 'User',
        borrowerId: request.requesterId,
        borrowerName: request.requesterName,
        itemName: request.itemName,
        itemId: matchingItem.id,
        status: 'accepted',
        meetupCode: meetupCode,
        location: request.location,
        neededFrom: request.neededFrom,
        neededUntil: request.neededUntil,
        createdAt: serverTimestamp()
      };

      console.log('Creating loan:', loanData);
      const loanRef = await addDoc(collection(db, 'loans'), loanData);
      console.log('Loan created with ID:', loanRef.id);
      
      // Update the loan data with the actual ID for the notification
      loanData.id = loanRef.id;

      // Update request status
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'accepted',
        acceptedBy: userData?.name || user.email?.split('@')[0] || 'User',
        acceptedAt: serverTimestamp()
      });

      // Mark item as unavailable
      await updateDoc(doc(db, 'items', matchingItem.id), {
        available: false,
        borrowedAt: serverTimestamp()
      });

      // Create notification for borrower
      await addDoc(collection(db, 'notifications'), {
        userId: request.requesterId,
        type: 'request_accepted',
        title: 'Request Accepted!',
        message: `${userData?.name || 'Someone'} accepted your request for ${request.itemName}`,
        loanId: loanRef.id,
        read: false,
        createdAt: serverTimestamp()
      });

      console.log('Request accepted successfully!');
      success(`Request accepted! Meetup code: ${meetupCode}`, 'Request Accepted');
      haptic('success');
      
      // Auto-navigate to Loans tab to see the new active loan
      navigateTo('/loaning', 'Request accepted - viewing active loans');
      
      return true;
    } catch (error) {
      console.error('Error accepting request:', error);
      error('Failed to accept request. Please try again.');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    if (actionLoading) return false;
    setActionLoading(true);
    
    try {
      console.log('Adding item:', itemData);
      console.log('Current user:', user?.uid);
      console.log('User data:', userData);

      if (!user) {
        console.error('No user logged in');
        return false;
      }

      const newItem = {
        ownerId: user.uid,
        ownerName: userData?.name || user.email?.split('@')[0] || 'User',
        ownerRating: userData?.rating || 0, // Add owner's rating
        name: itemData.name,
        description: itemData.description || '',
        category: itemData.category || 'General',
        value: itemData.value || 25, // Default $25 value
        available: true,
        image: itemData.image || '',
        points: calculatePoints(itemData.value || 25, 4), // Calculate points based on value and default 4 hours
        location: itemData.location || 'Current Location',
        lat: itemData.lat || userLocation?.lat || 0,
        lng: itemData.lng || userLocation?.lng || 0,
        createdAt: serverTimestamp()
      };

      console.log('Creating item:', newItem);

      // Add to items collection
      const itemRef = await addDoc(collection(db, 'items'), newItem);
      console.log('Item created with ID:', itemRef.id);
      
      // Update user's items count
      await updateDoc(doc(db, 'users', user.uid), {
        itemsOwned: (userData?.itemsOwned || 0) + 1,
        lastUpdated: serverTimestamp()
      });

      console.log('Item added successfully');
      success('Item added to your inventory! You can now see matching requests.');
      haptic('success');
      
      // Auto-navigate to Inventory to see the new item
      navigateTo('/inventory', 'Item added - viewing inventory');
      
      return true;
    } catch (error) {
      console.error('Error adding item:', error);
      console.error('Error details:', error.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditItem = async (itemId, itemData) => {
    try {
      await updateDoc(doc(db, 'items', itemId), {
        name: itemData.name,
        description: itemData.description,
        category: itemData.category,
        image: itemData.image,
        lastUpdated: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error editing item:', error);
      return false;
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      // Check if item is currently borrowed
      const loansQuery = query(
        collection(db, 'loans'),
        where('itemId', '==', itemId),
        where('status', 'in', ['accepted', 'in-progress'])
      );
      
      const loansSnapshot = await getDocs(loansQuery);
      if (!loansSnapshot.empty) {
        error('Cannot delete item that is currently being borrowed.');
        return false;
      }

      await updateDoc(doc(db, 'items', itemId), {
        available: false,
        deletedAt: serverTimestamp()
      });

      // Update user's items count
      await updateDoc(doc(db, 'users', user.uid), {
        itemsOwned: Math.max(0, (userData?.itemsOwned || 0) - 1),
        lastUpdated: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  };

  // LOAN MANAGEMENT FUNCTIONS
  const handleConfirmPickup = async (loanId) => {
    try {
      console.log('=== CONFIRM PICKUP DEBUG ===');
      console.log('Loan ID:', loanId);
      console.log('Available loans:', activeLoans);
      
      const loan = activeLoans.find(l => l.id === loanId);
      if (!loan) {
        console.error('Loan not found:', loanId);
        error('Loan not found. Please refresh and try again.');
        return false;
      }
      
      console.log('Found loan:', loan);
      
      await updateDoc(doc(db, 'loans', loanId), {
        status: 'in-progress',
        pickupConfirmedAt: serverTimestamp()
      });

      console.log('Loan status updated to in-progress');

      // Create notification for loaner
      await addDoc(collection(db, 'notifications'), {
        userId: loan.loanerId,
        type: 'pickup_confirmed',
        title: 'Item Picked Up',
        message: `${loan.borrowerName} has picked up the ${loan.itemName}`,
        loanId: loanId,
        read: false,
        createdAt: serverTimestamp()
      });

      console.log('Notification created');
      return true;
    } catch (error) {
      console.error('Error confirming pickup:', error);
      return false;
    }
  };

  const handleCompleteLoan = async (loanId) => {
    try {
      const loan = activeLoans.find(l => l.id === loanId) || myBorrowedItems.find(l => l.id === loanId);
      if (!loan) return false;

      // Update loan status
      await updateDoc(doc(db, 'loans', loanId), {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      // Update request status
      if (loan.requestId) {
        await updateDoc(doc(db, 'requests', loan.requestId), {
          status: 'completed',
          completedAt: serverTimestamp()
        });
      }

      // Mark item as available again
      await updateDoc(doc(db, 'items', loan.itemId), {
        available: true,
        returnedAt: serverTimestamp()
      });

      // Award points to loaner based on item's stored points value
      const itemRef = doc(db, 'items', loan.itemId);
      const itemSnap = await getDoc(itemRef);
      const itemPoints = itemSnap.exists() ? itemSnap.data().points || 5 : 5; // Default 5 points if not stored
      
      // Get current loaner's credits
      const loanerRef = doc(db, 'users', loan.loanerId);
      const loanerSnap = await getDoc(loanerRef);
      const currentCredits = loanerSnap.exists() ? loanerSnap.data().credits || 0 : 0;
      const currentLoansCompleted = loanerSnap.exists() ? loanerSnap.data().loansCompleted || 0 : 0;
      
      await updateDoc(loanerRef, {
        credits: currentCredits + itemPoints,
        loansCompleted: currentLoansCompleted + 1,
        lastUpdated: serverTimestamp()
      });

      // Create notifications
      await addDoc(collection(db, 'notifications'), {
        userId: loan.loanerId,
        type: 'loan_completed',
        title: 'Loan Completed!',
        message: `You earned ${itemPoints} points for lending ${loan.itemName}`,
        loanId: loanId,
        read: false,
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'notifications'), {
        userId: loan.borrowerId,
        type: 'return_completed',
        title: 'Return Completed!',
        message: `You successfully returned ${loan.itemName}`,
        loanId: loanId,
        read: false,
        createdAt: serverTimestamp()
      });

      // Show success notification
      success(`Loan completed! You earned ${itemPoints} points.`, 'Loan Completed');
      haptic('success');
      
      // Show rating modal for the current user
      setRatingData({
        loanId: loanId,
        otherUserId: loan.loanerId === user.uid ? loan.borrowerId : loan.loanerId,
        otherUserName: loan.loanerId === user.uid ? loan.borrowerName : loan.loanerName,
        userRole: loan.loanerId === user.uid ? 'loaner' : 'borrower',
        rating: 5,
        comment: ''
      });
      setShowRatingModal(true);
      
      // Create notification for the other user to rate as well
      const otherUserId = loan.loanerId === user.uid ? loan.borrowerId : loan.loanerId;
      const otherUserName = loan.loanerId === user.uid ? loan.borrowerName : loan.loanerName;
      const currentUserName = userData?.name || user.email?.split('@')[0] || 'User';
      
      await addDoc(collection(db, 'notifications'), {
        userId: otherUserId,
        type: 'rate_user',
        title: 'Rate Your Experience',
        message: `Please rate your experience with ${currentUserName}`,
        loanId: loanId,
        read: false,
        createdAt: serverTimestamp()
      });
      
      // Also create a notification for the other user to show rating modal immediately
      await addDoc(collection(db, 'notifications'), {
        userId: otherUserId,
        type: 'show_rating_modal',
        title: 'Rate Your Experience',
        message: `Please rate your experience with ${currentUserName}`,
        loanId: loanId,
        otherUserId: user.uid,
        otherUserName: currentUserName,
        userRole: loan.loanerId === user.uid ? 'borrower' : 'loaner',
        read: false,
        createdAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error completing loan:', error);
      return false;
    }
  };

  const handleRatingNotification = async (loanId) => {
    try {
      // Get the loan data
      const loanRef = doc(db, 'loans', loanId);
      const loanSnap = await getDoc(loanRef);
      
      if (!loanSnap.exists()) {
        error('Loan not found. Please try again.');
        return false;
      }
      
      const loan = loanSnap.data();
      
      // Show rating modal for the current user
      setRatingData({
        loanId: loanId,
        otherUserId: loan.loanerId === user.uid ? loan.borrowerId : loan.loanerId,
        otherUserName: loan.loanerId === user.uid ? loan.borrowerName : loan.loanerName,
        userRole: loan.loanerId === user.uid ? 'loaner' : 'borrower',
        rating: 5,
        comment: ''
      });
      setShowRatingModal(true);
      
      return true;
    } catch (error) {
      console.error('Error handling rating notification:', error);
      error('Failed to open rating modal. Please try again.');
      return false;
    }
  };

  const handleSubmitRating = async () => {
    try {
      if (!ratingData.otherUserId || !ratingData.loanId) return false;

      // Create rating document
      const ratingDoc = {
        loanId: ratingData.loanId,
        raterId: user.uid,
        raterName: userData?.name || user.email?.split('@')[0] || 'User',
        ratedUserId: ratingData.otherUserId,
        ratedUserName: ratingData.otherUserName,
        rating: ratingData.rating,
        comment: ratingData.comment,
        userRole: ratingData.userRole, // 'borrower' or 'loaner'
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'ratings'), ratingDoc);

      // Update the rated user's average rating
      const userRef = doc(db, 'users', ratingData.otherUserId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentRating = userData.rating || 5.0;
        const totalRatings = userData.totalRatings || 0;
        
        console.log('=== RATING UPDATE DEBUG ===');
        console.log('Rated user:', ratingData.otherUserName);
        console.log('Current rating:', currentRating);
        console.log('Total ratings:', totalRatings);
        console.log('New rating:', ratingData.rating);
        
        // Calculate new average rating
        const newTotalRatings = totalRatings + 1;
        const newAverageRating = ((currentRating * totalRatings) + ratingData.rating) / newTotalRatings;
        
        console.log('New average rating:', newAverageRating);
        console.log('Rounded rating:', Math.round(newAverageRating * 10) / 10);
        
        await updateDoc(userRef, {
          rating: Math.round(newAverageRating * 10) / 10, // Round to 1 decimal place
          totalRatings: newTotalRatings,
          lastUpdated: serverTimestamp()
        });
        
        console.log('Rating updated successfully');
      }

      // Close modal and navigate to profile
      setShowRatingModal(false);
      setRatingData({
        loanId: null,
        otherUserId: null,
        otherUserName: null,
        userRole: null,
        rating: 5,
        comment: ''
      });
      
      // Remove this loan from the shown set since rating is complete
      setShownRatingLoans(prev => {
        const newSet = new Set(prev);
        newSet.delete(ratingData.loanId);
        return newSet;
      });

      success('Rating submitted successfully!', 'Rating Submitted');
      haptic('success');
      navigateTo('/profile', 'Rating submitted - viewing profile');
      
      return true;
    } catch (error) {
      console.error('Error submitting rating:', error);
      error('Failed to submit rating. Please try again.', 'Rating Error');
      return false;
    }
  };

  const handleCancelLoan = async (loanId) => {
    try {
      const loan = activeLoans.find(l => l.id === loanId) || myBorrowedItems.find(l => l.id === loanId);
      if (!loan) return false;

      await updateDoc(doc(db, 'loans', loanId), {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });

      // Mark item as available again
      await updateDoc(doc(db, 'items', loan.itemId), {
        available: true,
        cancelledAt: serverTimestamp()
      });

      // Update request status
      if (loan.requestId) {
        await updateDoc(doc(db, 'requests', loan.requestId), {
          status: 'cancelled',
          cancelledAt: serverTimestamp()
        });
      }

      return true;
    } catch (error) {
      console.error('Error cancelling loan:', error);
      return false;
    }
  };

  const handleRequestItem = async (item) => {
    // Create request form data from the item
    const requestData = {
      itemName: item.name,
      description: `Requesting ${item.name} from ${item.ownerName}`,
      category: item.category || 'General',
      location: userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'Current Location',
      neededFrom: new Date().toISOString(),
      neededUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      maxDistance: 5
    };
    
    const success = await handleCreateRequest(requestData);
    
    if (success) {
      // Auto-navigate to Home to see the new request
      navigateTo('/', 'Item requested - viewing your requests');
    }
    
    return success;
  };

  const handleCancelRequest = async (requestId) => {
    try {
      console.log('🔄 Cancelling request:', requestId);
      
      // Update request status to cancelled
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });

      console.log('✅ Request cancelled successfully');
      success('Request cancelled successfully!', 'Request Cancelled');
      
      return true;
    } catch (error) {
      console.error('❌ Error cancelling request:', error);
      error('Failed to cancel request. Please try again.', 'Cancel Error');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Database reset function - accessible from browser console
  const resetDatabase = async () => {
    console.log('🚨 STARTING DATABASE RESET 🚨');
    console.log('This will delete ALL data except users!');
    
    const confirmReset = confirm('Are you sure you want to reset the database? This will delete all items, requests, loans, and notifications!');
    if (!confirmReset) {
      console.log('Reset cancelled');
      return;
    }

    try {
      console.log('📦 Deleting items...');
      const itemsSnapshot = await getDocs(collection(db, 'items'));
      const itemPromises = [];
      itemsSnapshot.forEach((itemDoc) => {
        itemPromises.push(deleteDoc(doc(db, 'items', itemDoc.id)));
      });
      await Promise.all(itemPromises);
      console.log(`✅ Deleted ${itemsSnapshot.size} items`);

      console.log('📋 Deleting requests...');
      const requestsSnapshot = await getDocs(collection(db, 'requests'));
      const requestPromises = [];
      requestsSnapshot.forEach((requestDoc) => {
        requestPromises.push(deleteDoc(doc(db, 'requests', requestDoc.id)));
      });
      await Promise.all(requestPromises);
      console.log(`✅ Deleted ${requestsSnapshot.size} requests`);

      console.log('🤝 Deleting loans...');
      const loansSnapshot = await getDocs(collection(db, 'loans'));
      const loanPromises = [];
      loansSnapshot.forEach((loanDoc) => {
        loanPromises.push(deleteDoc(doc(db, 'loans', loanDoc.id)));
      });
      await Promise.all(loanPromises);
      console.log(`✅ Deleted ${loansSnapshot.size} loans`);

      console.log('🔔 Deleting notifications...');
      const notificationsSnapshot = await getDocs(collection(db, 'notifications'));
      const notificationPromises = [];
      notificationsSnapshot.forEach((notificationDoc) => {
        notificationPromises.push(deleteDoc(doc(db, 'notifications', notificationDoc.id)));
      });
      await Promise.all(notificationPromises);
      console.log(`✅ Deleted ${notificationsSnapshot.size} notifications`);

      console.log('🎉 DATABASE RESET COMPLETE!');
      console.log('All data has been deleted except users.');
      success('Database reset complete! All items, requests, loans, and notifications have been deleted.');

    } catch (error) {
      console.error('❌ Error during reset:', error);
      error('Error during reset. Check console for details.');
    }
  };

  // Make resetDatabase available globally for console access
  React.useEffect(() => {
    window.resetDatabase = resetDatabase;
    console.log('🛠️ Database reset function available!');
    console.log('Type: resetDatabase() in console to reset the database');
>>>>>>> Stashed changes
  }, []);

  const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

<<<<<<< Updated upstream
    const handleSubmit = () => {
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields');
        return;
      }
      if (isSignUp && !formData.name) {
        alert('Please enter your name');
        return;
      }
      setUser({
        name: formData.name || 'Alex Johnson',
        credits: 10,
        rating: 5.0,
        loansCompleted: 0
      });
      setCurrentPage('home');
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Loop</h1>
            <p className="text-gray-500">Share. Borrow. Connect.</p>
          </div>
          
          <div className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}
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

  const MapPage = () => {
    return (
      <div className="h-screen bg-gray-100 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Interactive map view</p>
            <p className="text-sm text-gray-500 mt-2">See nearby requests and items</p>
          </div>
        </div>
        
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

  const HomePage = () => {
    const handleAcceptRequest = (id) => {
      const request = requests.find(r => r.id === id);
      if (!request) return;
      
      setActiveLoans([...activeLoans, { ...request, status: 'accepted', acceptedAt: new Date() }]);
      setRequests(requests.filter(r => r.id !== id));
      setNotifications([...notifications, { 
        id: Date.now(), 
        message: `You accepted ${request.user}'s request for ${request.item}`,
        time: 'Just now'
      }]);
    };

    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back!</h2>
              <p className="text-gray-500">{user?.name}</p>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 rounded-2xl px-4 py-2">
                <p className="text-xs text-gray-600">Credits</p>
                <p className="text-2xl font-bold text-blue-500">{user?.credits}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{user?.loansCompleted}</p>
              <p className="text-xs text-gray-500 mt-1">Loans</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <p className="text-2xl font-bold text-gray-800">{user?.rating}</p>
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
            <button className="text-sm text-blue-500 hover:underline">See all</button>
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
                      <h4 className="font-semibold text-gray-800 text-lg">{request.item}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {request.distance} away
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-50 rounded-xl px-3 py-1">
                        <p className="text-blue-600 font-semibold text-sm">+{request.credits}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{request.user}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          {request.rating} • {request.time}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const ActiveLoansPage = () => {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [showDamageReport, setShowDamageReport] = useState(null);

    const handleConfirmMeetup = (loan) => {
      setActiveLoans(activeLoans.map(l => 
        l.id === loan.id ? { ...l, status: 'in-progress' } : l
      ));
      setNotifications([...notifications, { 
        id: Date.now(), 
        message: `Meetup confirmed with ${loan.user}`,
        time: 'Just now'
      }]);
      setSelectedLoan(null);
    };

    const handleComplete = (loan) => {
      setActiveLoans(activeLoans.filter(l => l.id !== loan.id));
      setUser({ ...user, credits: user.credits + loan.credits, loansCompleted: user.loansCompleted + 1 });
      setNotifications([...notifications, { 
        id: Date.now(), 
        message: `Loan completed! +${loan.credits} credits earned`,
        time: 'Just now'
      }]);
    };

    const handleDamageReport = (loan) => {
      setShowDamageReport(loan);
    };

    const submitDamageReport = (loan) => {
      setActiveLoans(activeLoans.filter(l => l.id !== loan.id));
      setNotifications([...notifications, { 
        id: Date.now(), 
        message: `Damage report submitted for ${loan.item}. Support will contact you.`,
        time: 'Just now'
      }]);
      setShowDamageReport(null);
    };

    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Active Loans</h2>
          <p className="text-gray-500 mt-1">{activeLoans.length} items currently lending</p>
        </div>

        <div className="px-4 space-y-3">
          {activeLoans.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active loans</p>
              <p className="text-sm text-gray-400 mt-2">Accept requests to start lending</p>
            </div>
          ) : (
            activeLoans.map(loan => (
              <div key={loan.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-800 text-lg">{loan.item}</h4>
                      {loan.status === 'in-progress' && (
                        <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                          In Progress
                        </span>
                      )}
                      {loan.status === 'accepted' && (
                        <span className="ml-2 bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                          Pending Meetup
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Borrower: {loan.user}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {loan.status === 'accepted' && (
                    <>
                      <button
                        onClick={() => setSelectedLoan(loan)}
                        className="w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                      >
                        Confirm Meetup
                      </button>
                      <button className="w-full border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                        <MessageCircle className="w-4 h-4 inline mr-2" />
                        Message {loan.user.split(' ')[0]}
                      </button>
                    </>
                  )}
                  
                  {loan.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() => handleComplete(loan)}
                        className="w-full bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Complete & Return
                      </button>
                      <button 
                        onClick={() => handleDamageReport(loan)}
                        className="w-full border-2 border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition"
                      >
                        <XCircle className="w-4 h-4 inline mr-2" />
                        Report Damage
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedLoan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Meetup</h3>
              <p className="text-gray-600 mb-6">
                Confirm that you've met with {selectedLoan.user} and handed over the {selectedLoan.item}.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleConfirmMeetup(selectedLoan)}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
                >
                  Confirm Meetup
                </button>
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDamageReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Report Damage</h3>
              <p className="text-gray-600 mb-4">
                Was the {showDamageReport.item} returned damaged?
              </p>
              <textarea 
                placeholder="Describe the damage..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 mb-4 h-24"
              />
              <p className="text-sm text-gray-500 mb-6">
                The borrower will be charged for repairs. Our support team will review your report.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => submitDamageReport(showDamageReport)}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setShowDamageReport(null)}
                  className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const NotificationsPage = () => {
    const mockNotifications = [
      { id: 1, message: 'Sarah K. accepted your ladder request', time: '5m ago', type: 'accepted' },
      { id: 2, message: 'New request nearby: Power Drill', time: '1h ago', type: 'new' },
      { id: 3, message: 'You earned 15 credits from completed loan', time: '3h ago', type: 'credit' },
      ...notifications
=======
  // Navigation component
  const Navigation = ({ currentPath }) => {
    const navItems = [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/items', icon: Search, label: 'Browse' },
      { path: '/inventory', icon: Plus, label: 'Inventory' },
      { path: '/loaning', icon: MessageCircle, label: 'Loans' },
      { path: '/profile', icon: User, label: 'Profile' }
>>>>>>> Stashed changes
    ];

    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              <p className="text-gray-500 mt-1">{mockNotifications.length} unread</p>
            </div>
            {mockNotifications.length > 0 && (
              <button className="text-sm text-blue-500 hover:underline">
                Mark all read
              </button>
            )}
          </div>
        </div>

<<<<<<< Updated upstream
        <div className="px-4 space-y-2">
          {mockNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
              <p className="text-sm text-gray-400 mt-2">You're all caught up!</p>
            </div>
          ) : (
            mockNotifications.map(notif => (
              <div key={notif.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Bell className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              </div>
            ))
          )}
=======
  // Render page based on current path
  const renderPage = (path) => {
    if (!user) {
      return <AuthPage />;
    }

    const pageProps = {
      user,
      userData,
      userLocation,
      locationError,
      locationLoading,
      notifications: notificationsCount,
      onLogout: handleLogout,
      onRatingNotification: handleRatingNotification
    };

    switch (path) {
      case '/':
    return (
          <HomePage
            {...pageProps}
            availableItems={availableItems}
            requests={requests}
            myRequests={myRequests}
            myBorrowedItems={myBorrowedItems}
            myInventory={myInventory}
            onCreateRequest={handleCreateRequest}
            onAcceptRequest={handleAcceptRequest}
            onCancelRequest={handleCancelRequest}
            actionLoading={actionLoading}
            getItemSuggestions={getItemSuggestions}
          />
        );
      case '/items':
        return (
          <ItemsPage
            {...pageProps}
            availableItems={availableItems}
            onRequestItem={handleRequestItem}
          />
        );
      case '/inventory':
        return (
          <InventoryPage
            {...pageProps}
            items={myInventory}
            onAddItem={handleAddItem}
            actionLoading={actionLoading}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      case '/loaning':
        return (
          <LoaningPage
            {...pageProps}
            loanings={activeLoans}
            completedLoans={completedLoans}
            myBorrowedItems={myBorrowedItems}
            onConfirmPickup={handleConfirmPickup}
            onCompleteLoan={handleCompleteLoan}
            onCancelLoan={handleCancelLoan}
          />
        );
      case '/map':
        return (
          <MapPage
            {...pageProps}
            requests={requests}
            availableItems={availableItems}
          />
        );
      case '/profile':
        return <ProfilePage {...pageProps} onResetDatabase={resetDatabase} />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #9333ea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading Loop...</p>
>>>>>>> Stashed changes
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-b-3xl shadow-sm p-6 mb-6 text-white">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-4">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-300 mr-1" />
                <span className="text-sm">{user?.rating} rating</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white bg-opacity-20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{user?.credits}</p>
              <p className="text-xs mt-1 opacity-90">Credits</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{user?.loansCompleted}</p>
              <p className="text-xs mt-1 opacity-90">Completed</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{activeLoans.length}</p>
              <p className="text-xs mt-1 opacity-90">Active</p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-3">
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="font-semibold text-gray-800">Edit Profile</span>
            <span className="text-gray-400 text-xl">›</span>
          </button>
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="font-semibold text-gray-800">Loan History</span>
            <span className="text-gray-400 text-xl">›</span>
          </button>
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="font-semibold text-gray-800">Payment Methods</span>
            <span className="text-gray-400 text-xl">›</span>
          </button>
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="font-semibold text-gray-800">Settings</span>
            <span className="text-gray-400 text-xl">›</span>
          </button>
          <button 
            onClick={() => {
              setUser(null);
              setCurrentPage('home');
            }}
            className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-red-50 transition"
          >
            <span className="font-semibold text-red-600">Log Out</span>
            <span className="text-red-400 text-xl">›</span>
          </button>
        </div>
      </div>
    );
  };

  const NavigationBar = () => {
    const navItems = [
      { id: 'home', icon: Home, label: 'Home' },
      { id: 'map', icon: MapPin, label: 'Map' },
      { id: 'loans', icon: Clock, label: 'Loans' },
      { id: 'notifications', icon: Bell, label: 'Alerts' },
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

  const CreateRequestButton = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newRequest, setNewRequest] = useState({ item: '', description: '' });

    const handleCreateRequest = () => {
      if (!newRequest.item) {
        alert('Please enter an item name');
        return;
      }
      
      const request = {
        id: Date.now(),
        user: user.name,
        item: newRequest.item,
        distance: '0.0 mi',
        rating: user.rating,
        credits: 10,
        time: 'Just now',
        status: 'pending'
      };
      
      setMyRequests([...myRequests, request]);
      setNotifications([...notifications, { 
        id: Date.now(), 
        message: `Your request for ${newRequest.item} has been posted`,
        time: 'Just now'
      }]);
      
      setNewRequest({ item: '', description: '' });
      setShowCreateForm(false);
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
                  value={newRequest.item}
                  onChange={(e) => setNewRequest({...newRequest, item: e.target.value})}
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

  if (!user) {
    return <LoginPage />;
  }

  return (
<<<<<<< Updated upstream
    <div className="max-w-lg mx-auto bg-white min-h-screen relative" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'map' && <MapPage />}
      {currentPage === 'loans' && <ActiveLoansPage />}
      {currentPage === 'notifications' && <NotificationsPage />}
      {currentPage === 'profile' && <ProfilePage />}
=======
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Loading Overlay */}
      {actionLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          }}>
            <LoadingSpinner size="large" />
            <p style={{ margin: 0, fontSize: '1rem', color: '#374151' }}>
              Processing...
            </p>
          </div>
        </div>
      )}

      <NotificationContainer />
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        paddingBottom: '5rem' // Space for fixed navigation
      }}>
        <Routes>
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/auth" element={<AuthPage isLogin={false} />} />
          <Route path="/*" element={
            user ? (
              <div>
                {renderPage(location.pathname)}
                <Navigation currentPath={location.pathname} />
              </div>
            ) : (
              <AuthPage isLogin={true} />
            )
          } />
        </Routes>
      </div>
      
      {/* Rating Modal */}
      {showRatingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              textAlign: 'center'
            }}>
              Rate Your Experience
            </h2>
            
            <p style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1rem',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              How was your experience with {ratingData.otherUserName}?
            </p>

            {/* Star Rating */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
        <button 
                  key={star}
                  onClick={() => setRatingData({...ratingData, rating: star})}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= ratingData.rating ? '#fbbf24' : '#e5e7eb',
                    transition: 'color 0.2s'
                  }}
                >
                  ★
        </button>
              ))}
            </div>

            {/* Comment */}
                <textarea
              placeholder="Optional: Share your experience..."
              value={ratingData.comment}
              onChange={(e) => setRatingData({...ratingData, comment: e.target.value})}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '1.5rem',
                fontFamily: 'inherit'
              }}
            />

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
                  <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRatingData({
                    loanId: null,
                    otherUserId: null,
                    otherUserName: null,
                    userRole: null,
                    rating: 5,
                    comment: ''
                  });
                  
                  // Remove this loan from the shown set since user skipped rating
                  setShownRatingLoans(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(ratingData.loanId);
                    return newSet;
                  });
                  
                  navigateTo('/profile', 'Skipped rating - viewing profile');
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Skip
                  </button>
                  <button
                onClick={handleSubmitRating}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Submit Rating
                  </button>
              </div>
            </div>
          </div>
        )}
>>>>>>> Stashed changes
      
      {currentPage !== 'profile' && <CreateRequestButton />}
      <NavigationBar />
    </div>
  );
};

export default App;