import mongoose from 'mongoose';
import Survey from '../models/Survey.js'; // Import your Survey model

// Controller to create a new survey
export const createSurvey = async (req, res) => {
    const { title, questions , companyName } = req.body;

    try {
        // Ensure that each question gets a unique incrementing questionId starting from 1
        const formattedQuestions = questions.map((question, index) => ({
            questionId: index + 1, // Incrementing questionId starts from 1
            text: question.text, // Extract question text from request

            questionType: question.questionType, // Extract question text from request
        }));

        // Create a new Survey instance
        const newSurvey = new Survey({
            _id: new mongoose.Types.ObjectId(), // Explicitly set a new ObjectId for the survey
            title,
            companyName,
            questions: formattedQuestions,
        });

        // Save the new survey to the database
        const savedSurvey = await newSurvey.save();
        res.status(201).json(savedSurvey); // Respond with the created survey
    } catch (error) {
        // Handle any errors during the survey creation process
        res.status(500).json({ message: "Failed to create survey", error: error.message });
    }
};

// Controller to get all surveys or a specific survey by ID
export const getSurveys = async (req, res) => {
    const { id } = req.params; // Retrieve survey ID from the URL if provided

    try {
        let surveys;
        if (id) {
            // Fetch a specific survey by ID
            surveys = await Survey.findById(id);
            if (!surveys) {
                return res.status(404).json({ message: "Survey not found" });
            }
        } else {
            // Fetch all surveys
            surveys = await Survey.find();
        }

        res.status(200).json(surveys);
    } catch (error) {
        // Handle any errors during the fetch process
        res.status(500).json({ message: "Failed to fetch surveys", error: error.message });
    }
};
