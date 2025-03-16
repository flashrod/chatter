/**
 * Socket Handler - Manages all socket events
 */

const eventManager = require('../utils/eventManager');

/**
 * Initialize socket handlers
 * @param {Object} io - Socket.IO instance
 */
function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle user joining an event
    socket.on('joinEvent', ({ username, eventId }) => {
      // Join the socket room for this event
      socket.join(eventId);
      
      // Add user to event
      const result = eventManager.joinEvent(socket.id, username, eventId);
      
      // Notify all users in the event about the new participant
      io.to(eventId).emit('userJoined', {
        user: username,
        participants: result.participants,
        timestamp: result.timestamp
      });
      
      // Send event history to the new user
      const history = eventManager.getEventHistory(eventId);
      socket.emit('eventHistory', history);
      
      console.log(`${username} joined event: ${eventId}`);
    });

    // Handle chat messages
    socket.on('sendMessage', (message) => {
      const result = eventManager.addMessage(socket.id, message);
      
      if (!result) return;
      
      // Broadcast message to all users in the event
      io.to(result.eventId).emit('newMessage', result.message);
      
      console.log(`Message from ${result.message.username} in event ${result.eventId}: ${message}`);
    });

    // Handle user leaving an event
    socket.on('leaveEvent', () => {
      handleUserLeaving(socket, io);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      handleUserLeaving(socket, io);
      console.log(`Disconnected: ${socket.id}`);
    });

    // Handle typing indicator
    socket.on('typing', (isTyping) => {
      const user = eventManager.users.get(socket.id);
      if (!user) return;
      
      // Broadcast typing status to all users in the event except the sender
      socket.to(user.eventId).emit('userTyping', {
        username: user.username,
        isTyping
      });
    });

    // Handle get active events
    socket.on('getActiveEvents', (callback) => {
      const activeEvents = eventManager.getActiveEvents();
      callback(activeEvents);
    });
  });
}

/**
 * Handle user leaving an event
 * @param {Object} socket - Socket instance
 * @param {Object} io - Socket.IO instance
 */
function handleUserLeaving(socket, io) {
  const result = eventManager.leaveEvent(socket.id);
  
  if (!result) return;
  
  // Leave the socket room
  socket.leave(result.eventId);
  
  // Notify remaining users
  io.to(result.eventId).emit('userLeft', {
    user: result.username,
    participants: result.participants,
    timestamp: result.timestamp
  });
  
  if (result.isEmpty) {
    console.log(`Event ${result.eventId} removed as it has no participants`);
  }
  
  console.log(`${result.username} left event: ${result.eventId}`);
}

module.exports = { initializeSocketHandlers }; 