import mongoose from 'mongoose';

const AnsSchema1 = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
  
    answer: {
        type:String, // Change to Number to use min and max
        required: true,
        // min: 0, // Minimum value for the answer
        // max: 10 // Maximum value for the answer
    },
});

const AnswerSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    surveyId: {
        type: String,
        required: true,
    },
    questions: [AnsSchema1], // Array of question objects
    
    companyName: {
        type: String,
    },
});

// Export the Survey model
export default mongoose.model('Answers', AnswerSchema);
