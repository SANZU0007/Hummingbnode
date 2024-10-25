import express from 'express';
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessagesByReceivingId, // Import new function
  getMessagesBySendingId // Import new function
} from '../controllers/messageController.js';

const router = express.Router();

// Create a new message (POST)
router.post('/messages', createMessage);

// Get all messages (GET)
router.get('/messages', getAllMessages);

// Get a single message by ID (GET)
router.get('/messages/:id', getMessageById);

// Get messages by receivingId (GET)
router.get('/messages/receiving/:receivingId', getMessagesByReceivingId);

// Get messages by sendingId (GET)
router.get('/messages/sending/:sendingId', getMessagesBySendingId);

// Update a message (PUT)
router.put('/messages/:id', updateMessage);

// Delete a message (DELETE)
router.delete('/messages/:id', deleteMessage);

export default router;
