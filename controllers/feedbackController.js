import Feedback from '../models/Feedback.js';



export const getAllFeedback = async (req, res) => {
    try {

      const {companyName} = req.params; // Retrieve optional query parameters

      const feedbackList = await Feedback.find({companyName: companyName});
      res.json(feedbackList);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };






// Create new feedback (POST)
export const createFeedback = async (req, res) => {
    try {
      // Check if all existing feedback records have messageStatus set to true
      const allFeedbackTrue = await Feedback.find({ messageStatus: true });
      
      if (allFeedbackTrue.length > 0) {
        // If there are any feedback records with messageStatus as false, deny the request
        return res.status(400).json({ error: 'Please delete the previous feedback without pinned' });
      }
  
      // Proceed to create new feedback if all feedback records are true
      const { personid, message, messageStatus ,companyName } = req.body;
      const newFeedback = new Feedback({ personid, message, messageStatus,companyName });
      await newFeedback.save();
      res.status(201).json(newFeedback);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Update existing feedback (PUT)
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete feedback (DELETE)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
