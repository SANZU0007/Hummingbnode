import express from 'express';
import { getMood } from '../controllers/moodController.js';

const router = express.Router();

router.get('/', getMood);

// Add other mood-related routes

export default router;
