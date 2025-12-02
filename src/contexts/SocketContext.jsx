import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());

  useEffect(() => {
    // Initialize socket connection
    // Get base URL from environment variable, remove /api suffix if present
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
    const socketUrl = backendUrl.replace('/api', '');
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
      timeout: 20000, // Connection timeout
    });

    socketRef.current = newSocket;

    const handleConnect = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setSocket(newSocket);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      setSocket(newSocket);
    };

    const handleConnectError = (error) => {
      console.error('WebSocket connection error:', error);
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);

    // Set initial socket after a brief delay to avoid lint warning
    setTimeout(() => {
      setSocket(newSocket);
    }, 0);

    // Clean up on unmount
    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleConnectError);
      
      // Remove all custom listeners
      listenersRef.current.forEach((callback, event) => {
        newSocket.off(event, callback);
      });
      listenersRef.current.clear();
      
      newSocket.close();
    };
  }, []);

  const emit = (event, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      listenersRef.current.set(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
      listenersRef.current.delete(event);
    }
  };

  const joinAdminRoom = () => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('admin-connected');
      console.log('Joined admin room');
    }
  };

  const joinUserRoom = (userId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('user-connected', userId);
      console.log('Joined user room:', userId);
    }
  };

  const value = {
    socket,
    isConnected,
    emit,
    on,
    off,
    joinAdminRoom,
    joinUserRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};