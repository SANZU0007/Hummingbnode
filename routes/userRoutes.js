// /routes/userRoutes.js

import express from 'express';
import {  getUserByTeamAndRole, loginUser, registerUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/team/:team/:companyName', getUserByTeamAndRole);

router.put('/register/:id', updateUser);

export default router;
