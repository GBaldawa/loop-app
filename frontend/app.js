import React, { useState, useEffect } from 'react';
import { MapPin, Bell, Plus, User, Home, Search, Star, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

const LoopApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([
    { id: 1, user: 'Sarah K.', item: 'Ladder', distance: '0.3 mi', rating: 4.8, credits: 15, time: '2h ago', status: 'pending' },
    { id: 2, user: 'Mike T.', item: 'Power Drill', distance: '0.5 mi', rating: 4.9, credits: 25, time: '4h ago', status: 'pending' },
    { id: 3, user: 'Emma L.', item: 'Camping Tent', distance: '0.8 mi', rating: 4.7, credits: 20, time: '5h ago', status: 'pending' }
  ]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

  useEffect(() => {
    const mockUser = {
      name: 'Alex Johnson',
      credits: 42,
      rating: 4.8,
      loansCompleted: 23
    };
    setUser(mockUser);
  }, []);

  const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

    const handleSubmit = () => {
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
  };email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="

  const MapPage = () => {
    return (
      <div className="h-full bg-gray-100 relative">
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
            {requests.map(request => (
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
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ActiveLoansPage = () => {
    const [selectedLoan, setSelectedLoan] = useState(null);

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
                        Complete & Return
                      </button>
                      <button className="w-full border-2 border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
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
      </div>
    );
  };

  const NotificationsPage = () => {
    const mockNotifications = [
      { id: 1, message: 'Sarah K. accepted your ladder request', time: '5m ago', type: 'accepted' },
      { id: 2, message: 'New request nearby: Power Drill', time: '1h ago', type: 'new' },
      { id: 3, message: 'You earned 15 credits from completed loan', time: '3h ago', type: 'credit' },
      ...notifications
    ];

    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-500 mt-1">{mockNotifications.length} unread</p>
        </div>

        <div className="px-4 space-y-2">
          {mockNotifications.map(notif => (
            <div key={notif.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-sm">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </div>
            </div>
          ))}
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
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="font-semibold text-gray-800">Loan History</span>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="font-semibold text-gray-800">Payment Methods</span>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="font-semibold text-gray-800">Settings</span>
            <span className="text-gray-400">›</span>
          </button>
          <button 
            onClick={() => setUser(null)}
            className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:bg-red-50 transition"
          >
            <span className="font-semibold text-red-600">Log Out</span>
            <span className="text-red-400">›</span>
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
    return (
      <button className="fixed bottom-24 right-4 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition z-30">
        <Plus className="w-6 h-6" />
      </button>
    );
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="max-w-lg mx-auto bg-white min-h-screen relative" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'map' && <MapPage />}
      {currentPage === 'loans' && <ActiveLoansPage />}
      {currentPage === 'notifications' && <NotificationsPage />}
      {currentPage === 'profile' && <ProfilePage />}
      
      {currentPage !== 'profile' && <CreateRequestButton />}
      <NavigationBar />
    </div>
  );
};

export default LoopApp;