/**
 * Event Manager - Handles event-related operations
 */

const moment = require('moment');

class EventManager {
  constructor() {
    // Map to store active events: eventId -> { participants, messages }
    this.events = new Map();
    // Map to store user information: socketId -> { username, eventId }
    this.users = new Map();
  }

  /**
   * Add a user to an event
   * @param {string} socketId - Socket ID of the user
   * @param {string} username - Username
   * @param {string} eventId - Event ID
   * @returns {Object} - Event data including participants and messages
   */
  joinEvent(socketId, username, eventId) {
    // Store user information
    this.users.set(socketId, { username, eventId });
    
    // Initialize event if it doesn't exist
    if (!this.events.has(eventId)) {
      this.events.set(eventId, {
        participants: new Set(),
        messages: []
      });
    }
    
    const event = this.events.get(eventId);
    event.participants.add(socketId);
    
    return {
      event,
      userInfo: { username, eventId },
      participants: this.getParticipantsList(eventId),
      timestamp: moment().format('h:mm a')
    };
  }

  /**
   * Add a message to an event
   * @param {string} socketId - Socket ID of the sender
   * @param {string} messageText - Message content
   * @returns {Object|null} - Message object or null if user/event not found
   */
  addMessage(socketId, messageText) {
    const user = this.users.get(socketId);
    
    if (!user) return null;
    
    const { eventId, username } = user;
    const event = this.events.get(eventId);
    
    if (!event) return null;
    
    // Create message object
    const messageObj = {
      id: Date.now().toString(),
      text: messageText,
      username,
      timestamp: moment().format('h:mm a')
    };
    
    // Store message in event history
    event.messages.push(messageObj);
    
    return {
      message: messageObj,
      eventId
    };
  }

  /**
   * Remove a user from an event
   * @param {string} socketId - Socket ID of the user
   * @returns {Object|null} - Information about the removed user or null if not found
   */
  leaveEvent(socketId) {
    const user = this.users.get(socketId);
    
    if (!user) return null;
    
    const { eventId, username } = user;
    const event = this.events.get(eventId);
    
    if (!event) return null;
    
    // Remove user from participants
    event.participants.delete(socketId);
    
    // Clean up empty events
    if (event.participants.size === 0) {
      this.events.delete(eventId);
    }
    
    // Remove user from users map
    this.users.delete(socketId);
    
    return {
      username,
      eventId,
      participants: this.getParticipantsList(eventId),
      isEmpty: event.participants.size === 0,
      timestamp: moment().format('h:mm a')
    };
  }

  /**
   * Get a list of participant usernames for an event
   * @param {string} eventId - Event ID
   * @returns {Array} - List of usernames
   */
  getParticipantsList(eventId) {
    const event = this.events.get(eventId);
    if (!event) return [];
    
    return Array.from(event.participants)
      .map(id => this.users.get(id)?.username)
      .filter(Boolean);
  }

  /**
   * Get event history (messages and participants)
   * @param {string} eventId - Event ID
   * @returns {Object|null} - Event history or null if event not found
   */
  getEventHistory(eventId) {
    const event = this.events.get(eventId);
    if (!event) return null;
    
    return {
      messages: event.messages,
      participants: this.getParticipantsList(eventId)
    };
  }

  /**
   * Get all active events
   * @returns {Array} - List of event IDs and participant counts
   */
  getActiveEvents() {
    const activeEvents = [];
    
    for (const [eventId, event] of this.events.entries()) {
      activeEvents.push({
        id: eventId,
        participantCount: event.participants.size,
        messageCount: event.messages.length
      });
    }
    
    return activeEvents;
  }
}

module.exports = new EventManager(); 