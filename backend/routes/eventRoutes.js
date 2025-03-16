/**
 * Event Routes - API endpoints for event-related operations
 */

const express = require('express');
const router = express.Router();
const eventManager = require('../utils/eventManager');

/**
 * @route   GET /api/events
 * @desc    Get all active events
 * @access  Public
 */
router.get('/', (req, res) => {
  const activeEvents = eventManager.getActiveEvents();
  res.json(activeEvents);
});

/**
 * @route   GET /api/events/:id
 * @desc    Get event details by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  const eventId = req.params.id;
  const eventHistory = eventManager.getEventHistory(eventId);
  
  if (!eventHistory) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  res.json(eventHistory);
});

/**
 * @route   POST /api/events
 * @desc    Create a new event (placeholder - events are created dynamically when users join)
 * @access  Public
 */
router.post('/', (req, res) => {
  // Events are created dynamically when users join
  // This endpoint is a placeholder for future functionality
  // such as creating scheduled events or events with specific settings
  
  const { eventName, description } = req.body;
  
  // For now, just return a success message with a generated event ID
  const eventId = `event_${Date.now()}`;
  
  res.status(201).json({
    message: 'Event created successfully',
    eventId,
    eventName,
    description
  });
});

module.exports = router; 