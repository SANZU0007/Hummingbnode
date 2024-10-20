import express from 'express';
import { getScores, getScoresByUserId, createScore, updateScore, deleteScore } from '../controllers/scoreController.js';

const router = express.Router();

// Route to get all scores
router.get('/', getScores);

// Route to get scores by user ID
router.get('/user/:userId', getScoresByUserId);

// Route to create a new score
router.post('/post', createScore);

// Route to update a score by ID
router.put('/:scoreId', updateScore);

// Route to delete a score by ID
router.delete('/:scoreId', deleteScore);

// Add other score-related routes as needed

export default router;
