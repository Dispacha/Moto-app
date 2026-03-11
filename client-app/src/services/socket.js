import io from 'socket.io-client';

let socket = null;
const subscriptions = new Map();

export const initiateSocket = (userId) => {
  if (socket?.connected) {
    return socket;
  }
  
  // Disconnect old socket before creating new one
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connecté:', socket.id);
    socket.emit('join', userId);
  });

  socket.on('disconnect', () => {
    console.log('Socket déconnecté');
  });

  socket.on('connect_error', (error) => {
    console.error('Erreur de connexion Socket:', error);
  });

  socket.on('error', (error) => {
    console.error('Erreur Socket:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    // Remove all listeners before disconnecting
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    subscriptions.clear();
  }
};

export const getSocket = () => socket;

export const subscribeToNewRide = (callback) => {
  if (!socket) return;
  
  // Remove existing listener to prevent duplicates
  socket.off('new-ride');
  socket.on('new-ride', callback);
  subscriptions.set('new-ride', callback);
};

export const subscribeToRideStatus = (callback) => {
  if (!socket) return;
  
  // Remove existing listener to prevent duplicates
  socket.off('ride-status-update');
  socket.on('ride-status-update', callback);
  subscriptions.set('ride-status-update', callback);
};

export const subscribeToRideAccepted = (callback) => {
  if (!socket) return;
  
  socket.off('ride-accepted');
  socket.on('ride-accepted', callback);
  subscriptions.set('ride-accepted', callback);
};

export const unsubscribeFromEvent = (eventName) => {
  if (socket) {
    socket.off(eventName);
    subscriptions.delete(eventName);
  }
};

export const unsubscribeFromAllEvents = () => {
  if (socket) {
    subscriptions.forEach((_, eventName) => {
      socket.off(eventName);
    });
    subscriptions.clear();
  }
};