import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Save socket to state
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join an event
  const joinEvent = (username, eventId) => {
    if (socket) {
      socket.emit('joinEvent', { username, eventId });
    }
  };

  // Leave an event
  const leaveEvent = () => {
    if (socket) {
      socket.emit('leaveEvent');
    }
  };

  // Send a message
  const sendMessage = (message) => {
    if (socket) {
      socket.emit('sendMessage', message);
    }
  };

  // Set typing status
  const setTyping = (isTyping) => {
    if (socket) {
      socket.emit('typing', isTyping);
    }
  };

  // Get active events
  const getActiveEvents = (callback) => {
    if (socket) {
      socket.emit('getActiveEvents', callback);
    }
  };

  const value = {
    socket,
    isConnected,
    joinEvent,
    leaveEvent,
    sendMessage,
    setTyping,
    getActiveEvents,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 