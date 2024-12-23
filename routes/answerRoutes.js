// routes/answerRoutes.js
import express from 'express';
import { createAnswer, getAnswers, getAnswersByeCompany } from '../controllers/answerController.js';

const router = express.Router();





// POST request to create a new answer
router.post('/answers', createAnswer);

// GET request to fetch answers (all, by userId, or by surveyId)
router.get('/answers', getAnswers);



router.get('/answers/:companyName?', getAnswersByeCompany);






export default router;
