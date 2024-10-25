import Message from '../models/Message.js';

// Create a new message (POST)
export const createMessage = async (req, res) => {
  try {
    const { sendingId, message, receivingId, receivingUserName, sendingUserName } = req.body;

    // Create a new message instance
    const newMessage = new Message({ sendingId, message, receivingId, receivingUserName, sendingUserName });

    // Save the new message to the database
    await newMessage.save();

    // Respond with the newly created message
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all messages (GET)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find(); // Fetch all messages
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific message by ID (GET)
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id); // Fetch message by ID
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages by receivingId (GET)
export const getMessagesByReceivingId = async (req, res) => {
  try {
    const { receivingId } = req.params;
    const messages = await Message.find({ receivingId }); // Fetch all messages by receivingId

    if (messages.length === 0) {
      return res.status(404).json({ error: 'No messages found for this receivingId' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages by sendingId (GET)
export const getMessagesBySendingId = async (req, res) => {
  try {
    const { sendingId } = req.params;
    const messages = await Message.find({ sendingId }); // Fetch all messages by sendingId

    if (messages.length === 0) {
      return res.status(404).json({ error: 'No messages found for this sendingId' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a message by ID (PUT)
export const updateMessage = async (req, res) => {
  try {
    const { sendingId, message, receivingId, receivingUserName, sendingUserName } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { sendingId, message, receivingId, receivingUserName, sendingUserName }, // Updated fields
      { new: true } // Return updated document
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a message by ID (DELETE)
export const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id); // Delete by ID
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
