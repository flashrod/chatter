import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginScreen from './components/LoginScreen';
import ChatRoom from './components/ChatRoom';
import { SocketProvider } from './contexts/SocketContext';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    eventId: '',
  });

  const handleLogin = (username, eventId) => {
    setUserData({ username, eventId });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({ username: '', eventId: '' });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SocketProvider>
        {!isLoggedIn ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <ChatRoom userData={userData} onLogout={handleLogout} />
        )}
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App; 