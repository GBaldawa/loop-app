import React, { useState } from 'react';
import { MapPin, Home, Bell, User, Plus, Search, Star, Clock, MessageCircle, Check, X } from 'lucide-react';
import './App.css';

const LoopApp = () => {
  const [currentPage, setCurrentPage] = useState('requests');
  const [notifications, setNotifications] = useState(3);
  const [userCredits, setUserCredits] = useState(47);
  
  // Sample data
  const [requests, setRequests] = useState([
    { id: 1, item: 'USB-C to USB-C Charger', user: 'Sarah M.', location: 'Thompson Hall', time: '2-4 pm', distance: '0.3 mi', rating: 4.8, status: 'active' },
    { id: 2, item: 'iPhone Charger', user: 'Mike T.', location: 'Student Center', time: '3-6 pm', distance: '0.5 mi', rating: 4.9, status: 'active' },
    { id: 3, item: 'Laptop Charger (HP)', user: 'Emma K.', location: 'Library', time: '1-3 pm', distance: '0.2 mi', rating: 5.0, status: 'active' }
  ]);

  const [myRequests, setMyRequests] = useState([
    { id: 4, item: 'Phone Charger', lender: 'Alex J.', location: 'Thompson Hall', time: '6-8 pm', status: 'accepted', meetupCode: 'A7B2' }
  ]);

  const [loanings, setLoanings] = useState([
    { id: 5, item: 'Charger', borrower: 'Jamie K.', pickupLocation: 'Thompson (B2 wi)', time: '2-4 pm', status: 'pending' }
  ]);

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
  const RequestsPage = () => (
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
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm whitespace-nowrap">All</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">Chargers</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">Near me</button>
      </div>

      <div className="space-y-4">
        {requests.map(request => (
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
                  <span className="text-gray-400">• {request.distance}</span>
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
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              Accept & Help Out
            </button>
          </div>
        ))}
      </div>

      {myRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Active Requests</h2>
          {myRequests.map(request => (
            <div key={request.id} className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Check className="w-5 h-5" />
                <span className="font-medium">Request Accepted!</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{request.item}</h3>
              <p className="text-sm text-gray-600 mb-1">Lender: {request.lender}</p>
              <p className="text-sm text-gray-600 mb-1">Location: {request.location}</p>
              <p className="text-sm text-gray-600 mb-3">Time: {request.time}</p>
              <div className="bg-white rounded-xl p-3 border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Meetup Code:</p>
                <p className="text-2xl font-bold text-center text-gray-800">{request.meetupCode}</p>
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

  // Loaning Page
  const LoaningPage = () => (
    <div className="pb-20 px-4 pt-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Loanings</h1>

      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm">Active</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">Finished</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">Near me</button>
      </div>

      <div className="space-y-4">
        {loanings.map(loan => (
          <div key={loan.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{loan.item}</h3>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Pending Pickup</span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">Borrower: {loan.borrower}</p>
              <p className="text-sm text-gray-600">Location: {loan.pickupLocation}</p>
              <p className="text-sm text-gray-600">Time: {loan.time}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-gray-600 mb-1">Your Meetup Code:</p>
              <p className="text-2xl font-bold text-center text-indigo-600">B7K9</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
                Confirm Pickup
              </button>
              <button className="bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {loanings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600">No active loanings yet</p>
          <p className="text-sm text-gray-400 mt-1">Help someone out to earn credits!</p>
        </div>
      )}
    </div>
  );

  // Map Page
  const MapPage = () => (
    <div className="pb-20 h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 40% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 60% 60%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 30% 70%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)`
          }}>
            {/* Map markers */}
            <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-gray-500 text-sm z-10">Interactive map would connect to Maps API</p>
        </div>
      </div>
      
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-white rounded-2xl shadow-lg p-3">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full px-3 py-2 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="absolute bottom-24 left-4 right-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-1">USB-C Charger</h3>
          <p className="text-sm text-gray-600 mb-2">0.2 mi away • Thompson Hall</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium">
            View Request
          </button>
        </div>
      </div>
    </div>
  );

  // Profile Page
  const ProfilePage = () => (
    <div className="pb-20 px-4 pt-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
          <User className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Alex Johnson</h1>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-lg font-medium">4.9</span>
          <span className="text-gray-500 text-sm">(23 ratings)</span>
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">USB-C to USB-C Charger</span>
              <button className="text-indigo-600 text-sm">Edit</button>
            </div>
          </div>
          <button className="w-full mt-3 py-2 text-indigo-600 font-medium rounded-xl border-2 border-dashed border-gray-300">
            + Add Item
          </button>
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
                defaultValue="Alex Johnson"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="alex@university.edu"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card (for damage deposits)</label>
              <input
                type="text"
                placeholder="•••• •••• •••• 1234"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Enable location services</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
          </label>
        </div>

        <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
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
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 mb-1">New request nearby!</p>
              <p className="text-sm text-gray-600 mb-1">Someone needs a charger at Thompson Hall</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 mb-1">Request accepted!</p>
              <p className="text-sm text-gray-600 mb-1">Sarah M. will lend you a charger</p>
              <p className="text-xs text-gray-500">10 minutes ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 mb-1">You earned 5 credits!</p>
              <p className="text-sm text-gray-600 mb-1">Thanks for helping Mike T.</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
          <input
            type="text"
            placeholder="e.g., Thompson Hall"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Window</label>
          <input
            type="text"
            placeholder="e.g., 2-4 pm"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details (optional)</label>
          <textarea
            rows="3"
            placeholder="Any specific requirements..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
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