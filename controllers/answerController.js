// controllers/answerController.js
import mongoose from 'mongoose';
import Answers from '../models/Answer.js'; // Import the Answers model

// Controller to create a new answer (response to a survey)
export const createAnswer = async (req, res) => {
    const { Title, userId, surveyId, username, questions ,companyName } = req.body;

    try {
        // Ensure that each question answer has a valid format
        const formattedQuestions = questions.map((question) => ({
            questionId: question.questionId,
            text: question.text,
            answer: question.answer, // Ensure the answer is within 0 to 10
           
        }));

        // Create a new Answer instance
        const newAnswer = new Answers({
            _id: new mongoose.Types.ObjectId(), // Explicitly set a new ObjectId for the answer
            Title,
            userId,
            surveyId,
            username,
            companyName ,
            questions: formattedQuestions,
        });

        // Save the new answer to the database
        const savedAnswer = await newAnswer.save();
        res.status(201).json(savedAnswer); // Respond with the created answer
    } catch (error) {
        // Handle any errors during the answer creation process
        res.status(500).json({ message: "Failed to create answer", error: error.message });
    }
};

// Controller to get all answers or answers filtered by userId or surveyId
export const getAnswers = async (req, res) => {
    const { userId, surveyId } = req.query; // Retrieve optional query parameters

    try {
        let query = {};

        // Add filters to the query based on the presence of userId and surveyId
        if (userId) {
            query.userId = userId;
        }
        if (surveyId) {
            query.surveyId = surveyId;
        }

        // Fetch answers based on query criteria
        const answers = await Answers.find(query);
        
        res.status(200).json(answers); // Respond with the fetched answers
    } catch (error) {
        // Handle any errors during the fetch process
        res.status(500).json({ message: "Failed to fetch answers", error: error.message });
    }
};




export const getAnswersByeCompany = async (req, res) => {

    const {companyName} = req.params; // Retrieve optional query parameters

    try {
        // Fetch answers based on query criteria
        const answers = await Answers.find({companyName: companyName});
        
        res.status(200).json(answers); // Respond with the fetched answers
    } catch (error) {
        // Handle any errors during the fetch process
        res.status(500).json({ message: "Failed to fetch answers", error: error.message });
    }
};