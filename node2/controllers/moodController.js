import Mood from '../models/mood.js';
import User from '../models/user.js';

export const getMood = async (req, res) => {
    try {
        const moods = await Mood.find().populate('user');
        return res.json({ data: moods, message: "Moods fetched successfully", type: "success" });
    } catch (err) {
        return res.json({ data: null, message: err.message, type: "error" });
    }
};

// Add other mood-related functions
