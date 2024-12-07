import express from 'express';
import {
  saveDeepWork,
  getDeepWorkByUserId,
  getAllDeepWork,
  updateDeepWork,
  deleteDeepWork,
} from '../controllers/deepworkController.js';

const router = express.Router();

// Routes
router.post('/save', saveDeepWork); // Create or Update entry
router.get('/', getAllDeepWork); // Get all entries


router.put('/:sessionId', updateDeepWork); // Update entry by userId

router.get('/:sessionId', getDeepWorkByUserId); // Get entry by userId

router.delete('/:userId', deleteDeepWork); // Delete entry by userId

export default router;
