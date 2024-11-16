import express from 'express';
import { createFeedback, updateFeedback, deleteFeedback, getAllFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/feedback', createFeedback);

router.get('/feedback/:companyName?', getAllFeedback);

router.put('/feedback/:id', updateFeedback);

router.delete('/feedback/:id', deleteFeedback);

export default router;
