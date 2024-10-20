import Scores from '../models/scores.js';
import User from '../models/user.js';

// Get All Scores
export const getScores = async (req, res) => {
    try {
        const scores = await Scores.find().populate('user');
        return res.json({ data: scores, message: 'Scores fetched successfully', type: 'success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: null, message: err.message, type: 'error' });
    }
};

// Get Scores by User ID
export const getScoresByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const scores = await Scores.find({ user: userId }).populate('user');
        return res.json({ data: scores, message: 'Scores fetched successfully', type: 'success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: null, message: err.message, type: 'error' });
    }
};

// Create a New Score
export const createScore = async (req, res) => {
    
    const { userId, value, date } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ data: null, message: 'User not found', type: 'error' });
        }

        const newScore = new Scores({ user: userId, value, date });
        await newScore.save();

        return res.status(201).json({ data: newScore, message: 'Score created successfully', type: 'success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: null, message: err.message, type: 'error' });
    }
};

// Update a Score by ID
export const updateScore = async (req, res) => {
    const { scoreId } = req.params;
    const { value, date } = req.body;

    try {
        const updatedScore = await Scores.findByIdAndUpdate(
            scoreId,
            { value, date },
            { new: true }
        );

        if (!updatedScore) {
            return res.status(404).json({ data: null, message: 'Score not found', type: 'error' });
        }

        return res.json({ data: updatedScore, message: 'Score updated successfully', type: 'success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: null, message: err.message, type: 'error' });
    }
};

// Delete a Score by ID
export const deleteScore = async (req, res) => {
    const { scoreId } = req.params;

    try {
        const deletedScore = await Scores.findByIdAndDelete(scoreId);
        if (!deletedScore) {
            return res.status(404).json({ data: null, message: 'Score not found', type: 'error' });
        }

        return res.json({ data: null, message: 'Score deleted successfully', type: 'success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: null, message: err.message, type: 'error' });
    }
};
