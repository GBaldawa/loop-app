import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Home, Search, Plus, User, MapPin } from 'lucide-react';

// Pages
import HomePage from './HomePage';
import ItemsPage from './ItemsPage';
import AddItemPage from './AddItemPage';
import ProfilePage from './ProfilePage';
import MapPage from './MapPage';
import AuthPage from './AuthPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9333ea',
    },
    secondary: {
      main: '#6b7280',
    },
    background: {
      default: '#f9fafb',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '8px 16px',
          fontWeight: 600,
        },
      },
    },
  },
});

const BottomNavigation = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/map', icon: MapPin, label: 'Map' },
    { path: '/add-item', icon: Plus, label: 'Add Item' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              color: isActive ? '#9333EA' : '#9CA3AF',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={24} />
            </div>
            <span style={styles.navLabel}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In a real app, you would check authentication status here
  // useEffect(() => {
  //   // Check if user is authenticated
  //   const token = localStorage.getItem('token');
  //   setIsAuthenticated(!!token);
  // }, []);

  // For demo purposes, we'll just set isAuthenticated to true
  // In a real app, you would handle authentication properly
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/signup" element={<AuthPage isLogin={false} />} />
            <Route path="*" element={<AuthPage isLogin={true} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={styles.app}>
          <div style={styles.content}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/add-item" element={<AddItemPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/login" element={<AuthPage isLogin={true} />} />
              <Route path="/signup" element={<AuthPage isLogin={false} />} />
            </Routes>
          </div>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
