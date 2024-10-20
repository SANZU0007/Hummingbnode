import express from 'express';
import { setCheckInOut } from '../controllers/checkInOutController.js';

const router = express.Router();

router.post('/', setCheckInOut);

// Add other check-in/out related routes

export default router;
