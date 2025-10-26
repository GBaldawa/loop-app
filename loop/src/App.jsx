import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Home, Search, Plus, Bell, User, MessageCircle } from 'lucide-react';

// Pages
import HomePage from './HomePage';
import ItemsPage from './ItemsPage';
import AddItemPage from './AddItemPage';
import LoaningPage from './LoaningPage';
import ProfilePage from './ProfilePage';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#9333ea', // Purple color to match the design
    },
    secondary: {
      main: '#10b981', // Green color for success actions
    },
    error: {
      main: '#dc2626', // Red color for error/destructive actions
    },
    background: {
      default: '#f3f4f6', // Light gray background
      paper: '#ffffff',   // White background for cards
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none', // Prevents uppercase in buttons
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners for cards and buttons
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px', // Pill-shaped buttons
          padding: '0.5rem 1.5rem',
          fontWeight: 500,
        },
      },
    },
  },
});

// Navigation component
const BottomNavigation = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(2); // Example unread messages count

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/items', icon: Search, label: 'Browse' },
    { path: '/add-item', icon: Plus, label: 'Add Item' },
    { path: '/loans', icon: MessageCircle, label: 'Loans', badge: unreadCount },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div style={{
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
      borderTop: '1px solid #e5e7eb'
    }}>
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
              transition: 'all 0.2s',
              '&:active': {
                backgroundColor: 'rgba(147, 51, 234, 0.1)'
              }
            }}
            onClick={(e) => {
              // Prevent full page reload
              e.preventDefault();
              window.history.pushState({}, '', item.path);
              // Force a re-render
              window.dispatchEvent(new Event('popstate'));
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={24} />
              {item.badge > 0 && (
                <span style={{
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
                  fontWeight: '600'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '0.625rem',
              marginTop: '0.25rem',
              fontWeight: isActive ? '600' : '400'
            }}>
              {item.label}
            </span>
          </a>
        );
      })}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app" style={{
          maxWidth: '500px',
          margin: '0 auto',
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            paddingBottom: '5rem', // Space for bottom navigation
            minHeight: '100vh',
            overflowX: 'hidden',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none' // Hide scrollbar for Chrome, Safari and Opera
            },
            msOverflowStyle: 'none',  // Hide scrollbar for IE and Edge
            scrollbarWidth: 'none'   // Hide scrollbar for Firefox
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/add-item" element={<AddItemPage />} />
              <Route path="/loans" element={<LoaningPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
