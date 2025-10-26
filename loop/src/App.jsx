import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Home, Search, Plus, Bell, User, MessageCircle, Map } from 'lucide-react';

// Pages
import HomePage from './HomePage';
import ItemsPage from './ItemsPage';
import InventoryPage from './InventoryPage';
import LoaningPage from './LoaningPage';
import ProfilePage from './ProfilePage';
import AuthPage from './AuthPage';
import MapPage from './MapPage';

// Theme setup
const theme = createTheme({
  palette: {
    primary: { main: '#9333ea' },
    secondary: { main: '#10b981' },
    error: { main: '#dc2626' },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
});

// Bottom Navigation component
const BottomNavigation = () => {
  const location = useLocation();
  const [unreadCount] = useState(2);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/items', icon: Search, label: 'Browse' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/inventory', icon: Plus, label: 'Inventory' },
    { path: '/loans', icon: MessageCircle, label: 'Loans', badge: unreadCount },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Hide navigation on auth pages
  if (location.pathname.startsWith('/auth')) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        padding: '0.5rem 0',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-around',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <a
            key={item.path}
            href={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: isActive ? '#9333ea' : '#6b7280',
              position: 'relative',
              padding: '0.5rem',
              borderRadius: '0.5rem',
            }}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', item.path);
              window.dispatchEvent(new Event('popstate'));
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={24} />
              {item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.625rem',
                    fontWeight: '600',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '0.625rem',
                marginTop: '0.25rem',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </div>
  );
};

// Main App
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div
          className="app"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative',
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              paddingBottom: '5rem',
              minHeight: '100vh',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/loans" element={<LoaningPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage isLogin={true} />} />
            </Routes>
          </div>

          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
