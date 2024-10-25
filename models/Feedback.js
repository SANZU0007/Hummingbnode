import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  personid: {
    type: String, // Use 'String' with an uppercase 'S'
    required: true
  },
  message: {
    type: String, // Use 'String' with an uppercase 'S'
    required: true
  },
  messageStatus: {
    type: Boolean, // Use 'Boolean' with an uppercase 'B'
    default: false // Optional: You can set a default value
  }
});

// Correct the model name to match the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; // Export 'Feedback' instead of 'Scores'
