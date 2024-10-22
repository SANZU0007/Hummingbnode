// models/Survey.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        required: true,
        enum: ['checkbox', 'feedback', 'Boolean'],
        default: 'checkbox', // Set 'checkbox' as the default value
    },
});

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    questions: [questionSchema], // Array of question objects
});

// Export the Survey model
export default mongoose.model('Survey', surveySchema);
